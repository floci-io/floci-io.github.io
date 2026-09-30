import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import worker, { type Env } from '../src/index';
import { CONFIRMATION_HTML, CONFIRMATION_TEXT, teamHtml, teamSubject } from '../src/messages';
import { isSpamTrap, oneLine, validate } from '../src/validate';

const valid = {
  topic: 'sponsorship',
  name: 'Jane Doe',
  email: 'jane@example.com',
  company: 'Acme',
  message: 'We would like to sponsor floci.',
};

describe('validate', () => {
  it('accepts a complete submission', () => {
    const r = validate(valid);
    expect(r.ok).toBe(true);
  });

  it('allows an empty company', () => {
    expect(validate({ ...valid, company: '' }).ok).toBe(true);
  });

  it.each([
    ['topic', { topic: 'hacking' }],
    ['name', { name: '' }],
    ['name', { name: 'x'.repeat(101) }],
    ['email', { email: 'not-an-email' }],
    ['email', { email: `${'a'.repeat(250)}@x.io` }],
    ['company', { company: 'x'.repeat(101) }],
    ['message', { message: 'too short' }],
    ['message', { message: 'x'.repeat(5001) }],
  ])('rejects a bad %s', (field, patch) => {
    const r = validate({ ...valid, ...patch });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors)).toContain(field);
  });

  it('ignores non-string values', () => {
    expect(validate({ ...valid, name: { $gt: '' } }).ok).toBe(false);
  });

  it('strips line breaks from single-line fields (no header injection)', () => {
    const r = validate({ ...valid, name: 'Jane\r\nBcc: victim@example.com', email: 'jane@example.com' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.name).toBe('Jane Bcc: victim@example.com');
    expect(oneLine('a\n\n b')).toBe('a b');
  });

  it('keeps line breaks in the message', () => {
    const r = validate({ ...valid, message: 'line one\r\nline two' });
    if (r.ok) expect(r.value.message).toBe('line one\nline two');
  });

  it('spots the honeypot', () => {
    expect(isSpamTrap({ ...valid, website: 'http://spam' })).toBe(true);
    expect(isSpamTrap({ ...valid, website: '' })).toBe(false);
    expect(isSpamTrap(valid)).toBe(false);
  });

  it('escapes everything the sender typed in the team HTML', () => {
    const r = validate({ ...valid, name: '<img src=x onerror=alert(1)>', company: '"><script>', message: '<b>hi</b> & bye' });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const html = teamHtml(r.value, 'US');
    expect(html).not.toContain('<img src=x');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;b&gt;hi&lt;/b&gt; &amp; bye');
  });

  it('keeps the confirmation free of sender input', () => {
    expect(CONFIRMATION_HTML).not.toMatch(/Jane|example\.com/);
  });

  it('builds the team subject', () => {
    const r = validate(valid);
    if (r.ok) expect(teamSubject(r.value)).toBe('[Sponsorship] Jane Doe · Acme');
  });
});

describe('worker', () => {
  const env: Env = {
    ALLOWED_ORIGINS: 'https://floci.io,http://localhost:4321',
    RETURN_URL: 'https://floci.io/contact/',
    TO_EMAIL: 'contact@floci.io',
    FROM_EMAIL: 'floci <contact@floci.io>',
    RESEND_API_KEY: 're_test',
    TURNSTILE_SECRET: 'secret',
    TELEGRAM_BOT_TOKEN: 'bot',
    TELEGRAM_CHAT_ID: '42',
  };

  let fetchMock: ReturnType<typeof vi.fn>;
  let pending: Promise<unknown>[];
  const ctx = {
    waitUntil: (p: Promise<unknown>) => pending.push(p),
    passThroughOnException: () => {},
  } as unknown as ExecutionContext;

  const calls = (host: string) =>
    fetchMock.mock.calls.filter(([url]) => String(url).includes(host));

  function post(body: unknown, headers: Record<string, string> = {}) {
    const isForm = typeof body === 'string';
    return new Request('https://contact.example/', {
      method: 'POST',
      headers: {
        Origin: 'https://floci.io',
        'Content-Type': isForm ? 'application/x-www-form-urlencoded' : 'application/json',
        'CF-Connecting-IP': '203.0.113.7',
        ...headers,
      },
      body: isForm ? body : JSON.stringify(body),
    });
  }

  beforeEach(() => {
    pending = [];
    fetchMock = vi.fn(async (url: string) => {
      if (url.includes('turnstile')) return Response.json({ success: true });
      return Response.json({ id: 'ok' });
    });
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('sends the team email, the confirmation and the Telegram ping', async () => {
    const res = await worker.fetch(post({ ...valid, 'cf-turnstile-response': 't' }), env, ctx);
    await Promise.all(pending);
    expect(res.status).toBe(200);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://floci.io');

    const emails = calls('resend').map(([, init]) => JSON.parse(init.body));
    expect(emails).toHaveLength(2);
    expect(emails[0]).toMatchObject({ to: ['contact@floci.io'], reply_to: 'jane@example.com' });
    expect(emails[0].text).toContain('We would like to sponsor floci.');
    // The confirmation never echoes what the sender typed.
    expect(emails[1]).toMatchObject({ to: ['jane@example.com'], text: CONFIRMATION_TEXT });
    expect(emails[1].text).not.toContain('Jane');
    expect(emails[1].html).toBe(CONFIRMATION_HTML);
    expect(emails[0].html).toContain('We would like to sponsor floci.');

    const tg = JSON.parse(calls('telegram')[0][1].body);
    expect(tg).toMatchObject({ chat_id: '42', parse_mode: 'HTML' });
  });

  it('skips Telegram when its secrets are not set', async () => {
    const off = { ...env, TELEGRAM_BOT_TOKEN: undefined, TELEGRAM_CHAT_ID: undefined };
    const res = await worker.fetch(post({ ...valid, 'cf-turnstile-response': 't' }), off, ctx);
    await Promise.all(pending);
    expect(res.status).toBe(200);
    expect(calls('resend')).toHaveLength(2);
    expect(calls('telegram')).toHaveLength(0);
  });

  it('escapes HTML in the Telegram message', async () => {
    await worker.fetch(post({ ...valid, name: '<b>x</b>', 'cf-turnstile-response': 't' }), env, ctx);
    await Promise.all(pending);
    const tg = JSON.parse(calls('telegram')[0][1].body);
    expect(tg.text).toContain('&lt;b&gt;x&lt;/b&gt;');
  });

  it('rejects a foreign origin', async () => {
    const res = await worker.fetch(post(valid, { Origin: 'https://evil.example' }), env, ctx);
    expect(res.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('answers the CORS preflight for allowed origins only', async () => {
    const ok = await worker.fetch(
      new Request('https://contact.example/', { method: 'OPTIONS', headers: { Origin: 'http://localhost:4321' } }),
      env, ctx,
    );
    expect(ok.status).toBe(204);
    const bad = await worker.fetch(
      new Request('https://contact.example/', { method: 'OPTIONS', headers: { Origin: 'https://evil.example' } }),
      env, ctx,
    );
    expect(bad.status).toBe(403);
  });

  it('fakes success for the honeypot and sends nothing', async () => {
    const res = await worker.fetch(post({ ...valid, website: 'http://spam' }), env, ctx);
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns field errors for invalid input', async () => {
    const res = await worker.fetch(post({ ...valid, email: 'nope' }), env, ctx);
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ ok: false, error: 'invalid', fields: { email: expect.any(String) } });
  });

  it('rejects a failed captcha', async () => {
    fetchMock.mockImplementation(async () => Response.json({ success: false }));
    const res = await worker.fetch(post({ ...valid, 'cf-turnstile-response': 'bad' }), env, ctx);
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: 'captcha' });
    expect(calls('resend')).toHaveLength(0);
  });

  it('rate limits', async () => {
    const limited = { ...env, CONTACT_LIMITER: { limit: async () => ({ success: false }) } };
    const res = await worker.fetch(post({ ...valid, 'cf-turnstile-response': 't' }), limited, ctx);
    expect(res.status).toBe(429);
  });

  it('returns 502 when the team email fails', async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url.includes('turnstile') ? Response.json({ success: true }) : new Response('down', { status: 500 }),
    );
    const res = await worker.fetch(post({ ...valid, 'cf-turnstile-response': 't' }), env, ctx);
    expect(res.status).toBe(502);
  });

  it('redirects the no-JS form post back to the site', async () => {
    const form = new URLSearchParams({ ...valid, 'cf-turnstile-response': 't' }).toString();
    const res = await worker.fetch(post(form), env, ctx);
    expect(res.status).toBe(303);
    expect(res.headers.get('Location')).toBe('https://floci.io/contact/?sent=1');

    const bad = new URLSearchParams({ ...valid, email: 'nope' }).toString();
    const res2 = await worker.fetch(post(bad), env, ctx);
    expect(res2.headers.get('Location')).toBe('https://floci.io/contact/?error=invalid');
  });
});
