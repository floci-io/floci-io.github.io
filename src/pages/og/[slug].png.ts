import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const pages = [
  { slug: 'home',    title: 'floci',               sub: 'Local cloud emulators for AWS, Azure, and GCP.',  color: '#7A7FD6', tag: 'Open Source · MIT License · No account needed' },
  { slug: 'aws',     title: 'floci',               sub: '47 AWS services. 24 ms startup. No auth token.',  color: '#FF9900', tag: 'Drop-in LocalStack replacement' },
  { slug: 'az',      title: 'floci-az',            sub: '10 Azure services. Native speed. MIT license.',   color: '#0078D4', tag: 'Blob · Queue · Functions · Key Vault · Cosmos DB' },
  { slug: 'gcp',     title: 'floci-gcp',           sub: '7 GCP services. No project, no billing.',         color: '#34A853', tag: 'Cloud Storage · Pub/Sub · Firestore · Secret Manager' },
  { slug: 'compare', title: 'Floci vs LocalStack', sub: 'Free · No auth token · Drop-in replacement.',     color: '#7A7FD6', tag: '138× faster startup · 91% less memory' },
  { slug: 'blog',    title: 'Blog',                sub: 'Engineering notes from the floci team.',           color: '#7A7FD6', tag: 'floci.io · Open Source · MIT License' },
  { slug: 'labs',    title: '101 Labs',            sub: 'Hands-on guides for AWS, Azure, and GCP.',        color: '#7A7FD6', tag: 'No cloud account needed · Runs on your laptop' },
];

export const getStaticPaths: GetStaticPaths = () =>
  pages.map(p => ({ params: { slug: p.slug }, props: p }));

const fontData: ArrayBuffer = readFileSync(
  join(process.cwd(), 'src/fonts/Sora.ttf')
).buffer as ArrayBuffer;

const rawLogoSvg = readFileSync(
  join(process.cwd(), 'public/floci-logo.svg'),
  'utf-8'
);

// Build a logo data URI with white wordmark/cloud and per-page accent dots.
// The source SVG uses: #262425 (text), #151515 / #141414 (cloud), #5559a7 (dots).
function buildLogoUri(accentColor: string): string {
  const svg = rawLogoSvg
    .replace(/#262425/gi, '#F8FAFC')
    .replace(/#151515/gi, '#F8FAFC')
    .replace(/#141414/gi, '#F8FAFC')
    .replace(/#5559a7/gi, accentColor);
  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
}

// Logo viewBox is 531.25 × 156.71 → aspect ratio ≈ 3.39 : 1
const LOGO_H = 64;
const LOGO_W = Math.round(LOGO_H * (531.25 / 156.71)); // ≈ 217

export const GET: APIRoute = async ({ props }) => {
  const { title, sub, color, tag } = props as typeof pages[0];
  const logoUri = buildLogoUri(color);

  // Scale title font size for longer product names
  const titleSize = title.length > 14 ? 64 : title.length > 8 ? 80 : 96;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#070B14',
          padding: '60px 80px',
          fontFamily: 'Sora',
        },
        children: [
          // ── Top row: logo + domain ──────────────────────────────
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
              children: [
                {
                  type: 'img',
                  props: {
                    src: logoUri,
                    width: LOGO_W,
                    height: LOGO_H,
                    style: { display: 'block' },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'rgba(248,250,252,0.3)',
                      letterSpacing: '0.1em',
                    },
                    children: 'floci.io',
                  },
                },
              ],
            },
          },

          // ── Center: title + subtitle ────────────────────────────
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: titleSize,
                      fontWeight: 700,
                      color: color,
                      lineHeight: '1',
                      letterSpacing: '-2px',
                    },
                    children: title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 26,
                      fontWeight: 700,
                      color: 'rgba(248,250,252,0.6)',
                      lineHeight: '1.45',
                      maxWidth: '860px',
                    },
                    children: sub,
                  },
                },
              ],
            },
          },

          // ── Bottom: accent bar + tag ────────────────────────────
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '52px',
                      height: '4px',
                      background: color,
                      borderRadius: '2px',
                    },
                    children: '',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'rgba(148,163,184,0.65)',
                      letterSpacing: '0.02em',
                    },
                    children: tag,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Sora', data: fontData, weight: 700, style: 'normal' }],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
};
