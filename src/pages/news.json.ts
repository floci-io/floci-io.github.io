import { z } from 'astro/zod';
import news from '../data/news.json';

// The feed the emulator dashboards (AWS, Azure, GCP, OCI) fetch from https://floci.io/news.json.
// A dashboard shows the items for its own `product` plus the ones with no product, in the order
// they appear here, drops any item without a title or an http(s) url, and uses the highest
// `version` among its own product's items to tell the user whether a newer release is out.
// A bad feed fails the build instead of reaching users.

export const NEWS_KINDS = [
  'security', 'release', 'breaking', 'service', 'deprecation',
  'guide', 'event', 'community', 'announcement',
] as const;

export const NEWS_PRODUCTS = ['aws', 'azure', 'gcp', 'oci'] as const;

// Per dashboard: its own product's items plus the ones with no product.
export const MAX_ITEMS = 10;

const isRealDate = (value: string) => {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
};

const item = z.object({
  kind: z.enum(NEWS_KINDS),
  product: z.enum(NEWS_PRODUCTS).optional(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'version must be x.y.z').optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD').refine(isRealDate, 'not a real date'),
  title: z.string().trim().min(1).max(80),
  summary: z.string().trim().min(1).max(200),
  url: z.string().url().startsWith('https://'),
}).strict().refine(
  entry => entry.version === undefined || entry.kind === 'release',
  { message: 'only "release" items may carry a version', path: ['version'] },
).refine(
  entry => entry.kind !== 'release' || (entry.version !== undefined && entry.product !== undefined),
  { message: 'a "release" item needs both a product and a version', path: ['kind'] },
);

const feed = z.object({ items: z.array(item) }).strict().superRefine(({ items }, ctx) => {
  for (const product of NEWS_PRODUCTS) {
    const shown = items.filter(entry => entry.product === undefined || entry.product === product).length;
    if (shown > MAX_ITEMS) {
      ctx.addIssue({ code: 'custom', path: ['items'], message: `the ${product} dashboard would show ${shown} items, the limit is ${MAX_ITEMS}` });
    }
  }
  items.forEach((entry, index) => {
    if (index > 0 && entry.date > items[index - 1].date) {
      ctx.addIssue({ code: 'custom', path: ['items', index, 'date'], message: 'items must be newest first' });
    }
    if (items.findIndex(other => other.url === entry.url) !== index) {
      ctx.addIssue({ code: 'custom', path: ['items', index, 'url'], message: 'duplicate url' });
    }
  });
});

export function GET() {
  const parsed = feed.safeParse(news);
  if (!parsed.success) {
    const problems = parsed.error.issues.map(issue => `  ${issue.path.join('.')}: ${issue.message}`);
    throw new Error(`src/data/news.json is invalid:\n${problems.join('\n')}`);
  }
  return new Response(JSON.stringify(parsed.data), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
