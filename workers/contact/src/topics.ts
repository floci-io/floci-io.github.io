// The contact form's topics. The site imports this file too (src/data/contact.ts),
// so the picker and the Worker's validation can never drift apart.
export const TOPICS = [
  { id: 'sponsorship', label: 'Sponsorship', hint: 'Back floci and get your logo in front of its users' },
  { id: 'enterprise',  label: 'Enterprise & support', hint: 'Adoption at your company, support, or a feature you need' },
  { id: 'partnership', label: 'Partnership', hint: 'Integrations, tooling, or co-marketing' },
  { id: 'press',       label: 'Press', hint: 'Interviews, articles, and talks' },
  { id: 'other',       label: 'Something else', hint: 'Anything that fits nowhere else' },
] as const;

export type TopicId = (typeof TOPICS)[number]['id'];

export function topicLabel(id: TopicId): string {
  return TOPICS.find((t) => t.id === id)?.label ?? id;
}
