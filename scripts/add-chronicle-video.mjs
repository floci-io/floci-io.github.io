import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const videoUrl = process.argv[2];

if (!videoUrl) {
  console.error('Usage: npm run add:video -- <youtube-url>');
  process.exit(1);
}

function getVideoId(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid URL: ${value}`);
  }

  const hostname = url.hostname.replace(/^www\./, '');
  let id;

  if (hostname === 'youtu.be') {
    id = url.pathname.split('/').filter(Boolean)[0];
  } else if (hostname === 'youtube.com' || hostname === 'm.youtube.com' || hostname === 'youtube-nocookie.com') {
    id = url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|live|shorts)\/([^/?]+)/)?.[1];
  }

  if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) {
    throw new Error(`Could not find a valid YouTube video ID in: ${value}`);
  }

  return id;
}

async function fetchRequired(url, label, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`${label} request failed with HTTP ${response.status}`);
  }
  return response;
}

function quote(value) {
  return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
}

const root = fileURLToPath(new URL('../', import.meta.url));
const indexPath = join(root, 'src/pages/chronicle/index.astro');
const thumbnailDirectory = join(root, 'public/chronicle/videos');

try {
  const id = getVideoId(videoUrl);
  const source = await readFile(indexPath, 'utf8');

  if (source.includes(`id: '${id}'`)) {
    throw new Error(`Video ${id} is already in the Chronicle list`);
  }

  const canonicalUrl = `https://www.youtube.com/watch?v=${id}`;
  const [metadataResponse, pageResponse] = await Promise.all([
    fetchRequired(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(canonicalUrl)}&format=json`,
      'YouTube metadata'
    ),
    fetchRequired(canonicalUrl, 'YouTube page', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
  ]);
  const metadata = await metadataResponse.json();
  const page = await pageResponse.text();
  const published = page.match(/"publishDate":"([^"]+)"/)?.[1];

  if (typeof metadata.title !== 'string' || !published) {
    throw new Error('YouTube did not return the required title and publication date');
  }

  const publishedDate = new Date(published);
  if (Number.isNaN(publishedDate.valueOf())) {
    throw new Error(`YouTube returned an invalid publication date: ${published}`);
  }

  const date = publishedDate.toISOString().slice(0, 10);
  const thumbnailUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const thumbnailResponse = await fetchRequired(thumbnailUrl, 'YouTube thumbnail');
  const thumbnail = Buffer.from(await thumbnailResponse.arrayBuffer());
  const marker = 'const videos = [\n';
  const entry = `  { id: ${quote(id)}, url: ${quote(canonicalUrl)}, title: ${quote(metadata.title)}, pubDate: new Date('${date}T00:00:00Z') },\n`;

  if (!source.includes(marker)) {
    throw new Error(`Could not locate the videos array in ${indexPath}`);
  }

  await mkdir(thumbnailDirectory, { recursive: true });
  await writeFile(join(thumbnailDirectory, `${id}.jpg`), thumbnail);
  await writeFile(indexPath, source.replace(marker, () => marker + entry));

  console.log(`Added "${metadata.title}" (${date})`);
  console.log(`Thumbnail: public/chronicle/videos/${id}.jpg`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
