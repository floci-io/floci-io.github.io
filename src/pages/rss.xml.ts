import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { assertChronicleEntries, chronicleFullTitle, chroniclePublicSlug } from '../lib/chronicle';
import { getAuthor } from '../data/authors';

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function GET(context: { site?: URL }) {
  const entries = (await getCollection('chronicle', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  assertChronicleEntries(entries);

  return rss({
    title: 'floci Chronicle',
    description: 'Notes and stories from the floci community.',
    site: context.site ?? new URL('https://floci.io'),
    xmlns: { dc: 'http://purl.org/dc/elements/1.1/' },
    customData: '<language>en-us</language>',
    items: entries.map(entry => ({
      title: chronicleFullTitle(entry),
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      categories: entry.data.tags,
      link: `/chronicle/${chroniclePublicSlug(entry)}/`,
      customData: `<dc:creator>${escapeXml(getAuthor(entry.data.author).name)}</dc:creator>`,
    })),
  });
}
