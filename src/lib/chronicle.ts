import type { CollectionEntry } from 'astro:content';

export type ChronicleEntry = CollectionEntry<'chronicle'>;
export type ChronicleKind = 'note' | 'chronicle';

const extensionPattern = /\.(md|mdx)$/;

function defaultSlug(entry: ChronicleEntry): string {
  return entry.id.replace(extensionPattern, '');
}

export function chronicleKind(entry: ChronicleEntry): ChronicleKind {
  if (entry.id.startsWith('notes/')) return 'note';
  if (entry.id.startsWith('chronicles/')) return 'chronicle';
  throw new Error(`Chronicle entry must be inside notes/ or chronicles/: ${entry.id}`);
}

export function chroniclePublicSlug(entry: ChronicleEntry): string {
  const slug = defaultSlug(entry);
  return slug.substring(slug.lastIndexOf('/') + 1);
}

export function assertChronicleEntries(entries: ChronicleEntry[]): void {
  const entriesBySlug = new Map<string, string>();

  for (const entry of entries) {
    chronicleKind(entry);

    const expectedSlug = defaultSlug(entry);
    if (entry.slug !== expectedSlug) {
      throw new Error(`Custom Chronicle slugs are not supported: ${entry.id}`);
    }

    const slug = chroniclePublicSlug(entry);
    const existing = entriesBySlug.get(slug);
    if (existing) {
      throw new Error(`Chronicle URL collision for "${slug}": ${existing} and ${entry.id}`);
    }
    entriesBySlug.set(slug, entry.id);
  }
}
