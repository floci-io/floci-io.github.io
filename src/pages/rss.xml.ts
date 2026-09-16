import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { assertChronicleEntries, chroniclePublicSlug } from '../lib/chronicle';

export async function GET(context: { site?: URL }) {
  const entries = (await getCollection('chronicle', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  assertChronicleEntries(entries);

  return rss({
    title: 'floci Chronicle',
    description: 'Notes and stories from the floci community.',
    site: context.site ?? new URL('https://floci.io'),
    customData: '<language>en-us</language>',
    items: entries.map(entry => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      categories: entry.data.tags,
      link: `/chronicle/${chroniclePublicSlug(entry)}/`,
    })),
  });
}
