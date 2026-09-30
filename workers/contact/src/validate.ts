import { TOPICS, type TopicId } from './topics';

export interface ContactInput {
  topic: TopicId;
  name: string;
  email: string;
  company: string;
  message: string;
}

export type ValidationResult =
  | { ok: true; value: ContactInput }
  | { ok: false; errors: Partial<Record<keyof ContactInput, string>> };

export const LIMITS = {
  name: 100,
  email: 254,
  company: 100,
  messageMin: 10,
  messageMax: 5000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPIC_IDS = new Set<string>(TOPICS.map((t) => t.id));

// Collapse whitespace and drop CR/LF so a value can't smuggle extra headers
// into an email subject or reply-to.
export function oneLine(value: string): string {
  return value.replace(/[\r\n\t\v\f]+/g, ' ').replace(/ {2,}/g, ' ').trim();
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

// The hidden `website` field: humans never see it, naive bots fill it in.
export function isSpamTrap(raw: Record<string, unknown>): boolean {
  return str(raw.website).trim() !== '';
}

export function validate(raw: Record<string, unknown>): ValidationResult {
  const topic = str(raw.topic).trim();
  const name = oneLine(str(raw.name));
  const email = oneLine(str(raw.email));
  const company = oneLine(str(raw.company));
  const message = str(raw.message).replace(/\r\n?/g, '\n').trim();

  const errors: Partial<Record<keyof ContactInput, string>> = {};
  if (!TOPIC_IDS.has(topic)) errors.topic = 'Pick a topic.';
  if (!name) errors.name = 'Tell us your name.';
  else if (name.length > LIMITS.name) errors.name = `Keep it under ${LIMITS.name} characters.`;
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email) errors.email = 'Enter a valid email address.';
  if (company.length > LIMITS.company) errors.company = `Keep it under ${LIMITS.company} characters.`;
  if (message.length < LIMITS.messageMin) errors.message = `Write at least ${LIMITS.messageMin} characters.`;
  else if (message.length > LIMITS.messageMax) errors.message = `Keep it under ${LIMITS.messageMax} characters.`;

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { topic: topic as TopicId, name, email, company, message } };
}
