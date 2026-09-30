// Email content for the contact Worker. Kept out of index.ts because the Workers runtime
// treats every named export of the entry module as an entrypoint.
//
// Each email has a plain-text part and an HTML part. The HTML uses tables and inline styles
// only, because that is all Gmail, Outlook and Apple Mail reliably agree on.
import { topicLabel } from './topics';
import type { ContactInput } from './validate';

const SITE = 'https://floci.io';
const LOGO_URL = `${SITE}/email/floci-logo.png`; // 240x80, white background, shown at 120x40

const C = {
  page: '#F4F5FA',
  card: '#FFFFFF',
  border: '#E4E6F0',
  accent: '#5559A7',
  accentSoft: '#EEEFF8',
  text: '#0F172A',
  muted: '#64748B',
  faint: '#94A3B8',
};
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function layout(opts: { preheader: string; body: string; footer: string }): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>floci</title>
</head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.card};border:1px solid ${C.border};border-radius:12px;overflow:hidden;">
      <tr><td style="height:4px;background:${C.accent};font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr><td style="padding:28px 32px 0;">
        <a href="${SITE}" style="text-decoration:none;"><img src="${LOGO_URL}" width="120" height="40" alt="floci" style="display:block;border:0;font-family:${FONT};font-size:26px;font-weight:700;line-height:40px;color:${C.text};"></a>
      </td></tr>
      <tr><td style="padding:24px 32px 32px;font-family:${FONT};color:${C.text};font-size:15px;line-height:1.6;">
        ${opts.body}
      </td></tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
      <tr><td style="padding:20px 32px;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.faint};text-align:center;">
        ${opts.footer}
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function eyebrow(text: string): string {
  return `<div style="font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${C.accent};margin:0 0 8px;">${text}</div>`;
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0;"><tr>
  <td style="border-radius:8px;background:${C.accent};">
    <a href="${href}" style="display:inline-block;padding:12px 22px;font-family:${FONT};font-size:14px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:8px;">${label}</a>
  </td></tr></table>`;
}

const SIGNATURE_FOOTER = `floci · Local cloud emulators for AWS, Azure, GCP and OCI<br>
<a href="${SITE}" style="color:${C.faint};">floci.io</a> · <a href="https://github.com/floci-io" style="color:${C.faint};">GitHub</a>`;

// ---- Team notification ------------------------------------------------------

export function teamSubject(input: ContactInput): string {
  const who = input.company ? `${input.name} · ${input.company}` : input.name;
  return `[${topicLabel(input.topic)}] ${who}`;
}

export function teamBody(input: ContactInput, country: string): string {
  return [
    `Topic: ${topicLabel(input.topic)}`,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Company: ${input.company || '-'}`,
    `Country: ${country}`,
    '',
    input.message,
    '',
    '--',
    'Sent from the floci.io contact form. Reply to this email to answer the sender.',
  ].join('\n');
}

// Everything the sender typed is escaped: this HTML is rendered in the team's inbox.
export function teamHtml(input: ContactInput, country: string): string {
  const name = escapeHtml(input.name);
  const email = escapeHtml(input.email);
  const firstName = escapeHtml(input.name.split(' ')[0]);
  const replyHref = `mailto:${encodeURIComponent(input.email)}?subject=${encodeURIComponent(`Re: ${teamSubject(input)}`)}`;
  const row = (label: string, value: string) => `<tr>
    <td style="padding:6px 0;width:96px;color:${C.muted};font-size:13px;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;font-size:14px;vertical-align:top;">${value}</td></tr>`;

  const body = `${eyebrow(`New message · ${escapeHtml(topicLabel(input.topic))}`)}
<h1 style="margin:0 0 20px;font-size:22px;line-height:1.3;font-weight:700;color:${C.text};">${name}${input.company ? ` <span style="color:${C.muted};font-weight:400;">· ${escapeHtml(input.company)}</span>` : ''}</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.border};border-bottom:1px solid ${C.border};margin:0 0 20px;">
  <tr><td style="padding:10px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${row('Email', `<a href="mailto:${email}" style="color:${C.accent};text-decoration:none;">${email}</a>`)}
    ${row('Company', input.company ? escapeHtml(input.company) : `<span style="color:${C.faint};">Not given</span>`)}
    ${row('Country', escapeHtml(country))}
  </table></td></tr>
</table>
<div style="background:${C.accentSoft};border-left:3px solid ${C.accent};border-radius:4px;padding:16px 18px;font-size:15px;line-height:1.65;white-space:pre-wrap;word-break:break-word;">${escapeHtml(input.message)}</div>
${button(replyHref, `Reply to ${firstName}`)}`;

  return layout({
    preheader: escapeHtml(input.message.slice(0, 120)),
    body,
    footer: 'Sent from the floci.io contact form. Replying to this email answers the sender directly.',
  });
}

// ---- Confirmation to the sender --------------------------------------------
// Fixed content on purpose: echoing anything the sender typed would let anyone use the
// form to send arbitrary text to an arbitrary address.

export const CONFIRMATION_SUBJECT = 'We got your message';

export const CONFIRMATION_TEXT = [
  'Hi,',
  '',
  'Thanks for reaching out to floci. Your message reached the team, and we usually',
  'reply within two business days.',
  '',
  'While you wait, the 101 Labs are a quick way to see floci in action:',
  `${SITE}/labs/`,
  '',
  'If you did not send this, you can ignore this email.',
  '',
  'The floci team',
  SITE,
].join('\n');

export const CONFIRMATION_HTML = layout({
  preheader: 'Your message reached the floci team. We usually reply within two business days.',
  body: `${eyebrow('Message received')}
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:700;color:${C.text};">Thanks for reaching out</h1>
<p style="margin:0 0 16px;">Your message reached the floci team. A maintainer will read it and reply, usually within <strong>two business days</strong>.</p>
<p style="margin:0;">While you wait, the 101 Labs are a quick way to see floci in action: real AWS, Azure, GCP and OCI workflows, running on your laptop.</p>
${button(`${SITE}/labs/`, 'Explore the 101 Labs')}
<p style="margin:28px 0 0;color:${C.muted};">The floci team</p>
<p style="margin:24px 0 0;padding-top:16px;border-top:1px solid ${C.border};font-size:12px;color:${C.faint};">If you did not send this, you can ignore this email.</p>`,
  footer: SIGNATURE_FOOTER,
});
