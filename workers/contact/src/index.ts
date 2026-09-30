// floci.io contact form endpoint.
// Receives the /contact form, checks it (origin, honeypot, fields, rate limit, Turnstile),
// emails the team through Resend, sends the sender a generic confirmation, and pings Telegram.
// Stores nothing: the emails and the Telegram message are the only record.
import {
  CONFIRMATION_HTML,
  CONFIRMATION_SUBJECT,
  CONFIRMATION_TEXT,
  escapeHtml,
  teamBody,
  teamHtml,
  teamSubject,
} from './messages';
import { topicLabel } from './topics';
import { isSpamTrap, validate, type ContactInput } from './validate';

export interface Env {
  ALLOWED_ORIGINS: string;   // comma-separated, e.g. "https://floci.io,http://localhost:4321"
  RETURN_URL: string;        // where the no-JS form lands afterwards, e.g. "https://floci.io/contact/"
  TO_EMAIL: string;          // team inbox
  FROM_EMAIL: string;        // verified Resend sender, e.g. "floci <contact@floci.io>"
  RESEND_API_KEY: string;
  TURNSTILE_SECRET: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  CONTACT_LIMITER?: { limit(opts: { key: string }): Promise<{ success: boolean }> };
}

type ErrorCode = 'origin' | 'method' | 'invalid' | 'rate_limited' | 'captcha' | 'send_failed';

const TURNSTILE_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESEND_URL = 'https://api.resend.com/emails';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get('Origin') ?? '';
    const allowed = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).includes(origin);
    const cors: Record<string, string> = allowed
      ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' }
      : { Vary: 'Origin' };

    if (request.method === 'OPTIONS') {
      if (!allowed) return new Response(null, { status: 403, headers: cors });
      return new Response(null, {
        status: 204,
        headers: {
          ...cors,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const isForm = (request.headers.get('Content-Type') ?? '').includes('application/x-www-form-urlencoded');
    const reply = (status: number, error?: ErrorCode, fields?: Record<string, string>) => {
      if (isForm && allowed) {
        const url = new URL(env.RETURN_URL);
        url.searchParams.set(error ? 'error' : 'sent', error ?? '1');
        return Response.redirect(url.toString(), 303);
      }
      const body = error ? { ok: false, error, ...(fields && { fields }) } : { ok: true };
      return Response.json(body, { status, headers: cors });
    };

    if (!allowed) return reply(403, 'origin');
    if (request.method !== 'POST') return reply(405, 'method');

    let raw: Record<string, unknown>;
    try {
      raw = isForm
        ? Object.fromEntries(await request.formData())
        : ((await request.json()) as Record<string, unknown>);
      if (!raw || typeof raw !== 'object') throw new Error('not an object');
    } catch {
      return reply(400, 'invalid');
    }

    // Bots that fill the hidden field get a normal-looking success and nothing is sent.
    if (isSpamTrap(raw)) return reply(200);

    const result = validate(raw);
    if (!result.ok) return reply(400, 'invalid', result.errors as Record<string, string>);
    const input = result.value;

    const ip = request.headers.get('CF-Connecting-IP') ?? '';
    if (env.CONTACT_LIMITER) {
      const { success } = await env.CONTACT_LIMITER.limit({ key: ip || 'unknown' });
      if (!success) return reply(429, 'rate_limited');
    }

    const token = typeof raw['cf-turnstile-response'] === 'string' ? raw['cf-turnstile-response'] : '';
    if (!(await verifyTurnstile(token, ip, env.TURNSTILE_SECRET))) return reply(400, 'captcha');

    const country = (request as { cf?: { country?: string } }).cf?.country ?? 'unknown';
    const teamSent = await sendEmail(env, {
      from: env.FROM_EMAIL,
      to: [env.TO_EMAIL],
      reply_to: input.email,
      subject: teamSubject(input),
      text: teamBody(input, country),
      html: teamHtml(input, country),
    });
    if (!teamSent) return reply(502, 'send_failed');

    // The confirmation and Telegram are best effort: the team already has the message.
    ctx.waitUntil(
      Promise.allSettled([
        sendEmail(env, {
          from: env.FROM_EMAIL,
          to: [input.email],
          subject: CONFIRMATION_SUBJECT,
          text: CONFIRMATION_TEXT,
          html: CONFIRMATION_HTML,
        }),
        notifyTelegram(env, input, country),
      ]),
    );

    return reply(200);
  },
} satisfies ExportedHandler<Env>;

async function verifyTurnstile(token: string, ip: string, secret: string): Promise<boolean> {
  if (!token) return false;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  try {
    const res = await fetch(TURNSTILE_URL, { method: 'POST', body });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

interface Email {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
  reply_to?: string;
}

async function sendEmail(env: Env, email: Email): Promise<boolean> {
  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(email),
    });
    if (!res.ok) console.error('resend', res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error('resend', err);
    return false;
  }
}

async function notifyTelegram(env: Env, input: ContactInput, country: string): Promise<void> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  const message = input.message.length > 3000 ? `${input.message.slice(0, 3000)}…` : input.message;
  const lines = [
    `<b>New contact: ${escapeHtml(topicLabel(input.topic))}</b>`,
    `${escapeHtml(input.name)} &lt;${escapeHtml(input.email)}&gt;`,
  ];
  if (input.company) lines.push(escapeHtml(input.company));
  lines.push(`Country: ${escapeHtml(country)}`, '', escapeHtml(message));
  const text = lines.join('\n');
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) console.error('telegram', res.status, await res.text());
}
