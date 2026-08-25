import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SERVICE_COUNTS } from '../../data/services';

const pages = [
  { slug: 'home',    title: 'floci',               sub: 'Run AWS, Azure, GCP, and OCI locally in milliseconds: the fast, credential-free loop your team and its AI agents need to ship faster.',  color: '#7A7FD6', tag: 'Instant · Credential-free · MIT License' },
  { slug: 'aws',     title: 'floci',               sub: `${SERVICE_COUNTS.aws} AWS services. 24 ms startup. No auth token.`,  color: '#FF9900', tag: 'Drop-in LocalStack replacement' },
  { slug: 'az',      title: 'floci-az',            sub: `${SERVICE_COUNTS.azure} Azure services. Native speed. MIT license.`,   color: '#0078D4', tag: 'Blob · Queue · Functions · Key Vault · Cosmos DB' },
  { slug: 'gcp',     title: 'floci-gcp',           sub: `${SERVICE_COUNTS.gcp} GCP services. No project, no billing.`,         color: '#34A853', tag: 'Cloud Storage · Pub/Sub · Firestore · Secret Manager' },
  { slug: 'oci',     title: 'floci-oci',           sub: `${SERVICE_COUNTS.oci} OCI services. No account, no key ceremony.`,    color: '#C74634', tag: 'Object Storage · Queue · Streaming · KMS · Functions' },
  { slug: 'compare', title: 'Floci vs LocalStack', sub: 'Free · No auth token · Drop-in replacement.',     color: '#7A7FD6', tag: '138× faster startup · 91% less memory' },
  { slug: 'blog',    title: 'Blog',                sub: 'Engineering notes from the floci team.',           color: '#7A7FD6', tag: 'floci.io · Open Source · MIT License' },
  { slug: 'labs',    title: '101 Labs',            sub: 'Hands-on guides for AWS, Azure, GCP, and OCI.',        color: '#7A7FD6', tag: 'No cloud account needed · Runs on your laptop' },
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

// The home card mirrors the homepage hero (light theme): original-color logo,
// "Any cloud. / Locally." headline, hero subtitle, and the action pills.
const rawLogoUri =
  'data:image/svg+xml;base64,' + Buffer.from(rawLogoSvg).toString('base64');

const HERO_LOGO_H = 78;
const HERO_LOGO_W = Math.round(HERO_LOGO_H * (531.25 / 156.71)); // ≈ 264

const pill = (label: string, primary = false) => ({
  type: 'div',
  props: {
    style: {
      display: 'flex',
      padding: '16px 30px',
      borderRadius: '10px',
      fontSize: 21,
      fontWeight: 700,
      background: primary ? '#5559A7' : '#FFFFFF',
      color: primary ? '#FFFFFF' : '#070B14',
      border: primary ? '1px solid #5559A7' : '1px solid #CBD5E1',
    },
    children: label,
  },
});

const homeCard = (sub: string) => ({
  type: 'div',
  props: {
    style: {
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F8FAFC',
      backgroundImage:
        'linear-gradient(rgba(57,73,171,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(57,73,171,0.07) 1px, transparent 1px)',
      backgroundSize: '60px 60px',
      fontFamily: 'Sora',
    },
    children: [
      {
        type: 'img',
        props: {
          src: rawLogoUri,
          width: HERO_LOGO_W,
          height: HERO_LOGO_H,
          style: { display: 'block', marginBottom: '40px' },
        },
      },
      {
        type: 'div',
        props: {
          style: {
            fontSize: 86,
            fontWeight: 700,
            color: '#5559A7',
            lineHeight: '1.05',
            letterSpacing: '-3px',
          },
          children: 'Any cloud.',
        },
      },
      {
        type: 'div',
        props: {
          style: {
            fontSize: 86,
            fontWeight: 700,
            color: '#070B14',
            lineHeight: '1.05',
            letterSpacing: '-3px',
          },
          children: 'Locally.',
        },
      },
      {
        type: 'div',
        props: {
          style: {
            fontSize: 27,
            fontWeight: 700,
            color: '#5559A7',
            lineHeight: '1.5',
            maxWidth: '820px',
            textAlign: 'center',
            marginTop: '26px',
          },
          children: sub,
        },
      },
      {
        type: 'div',
        props: {
          style: { display: 'flex', gap: '16px', marginTop: '40px' },
          children: [pill('Get started', true), pill('For AI agents'), pill('GitHub')],
        },
      },
    ],
  },
});

export const GET: APIRoute = async ({ props }) => {
  const { slug, title, sub, color, tag } = props as typeof pages[0];
  const logoUri = buildLogoUri(color);

  // Scale title font size for longer product names
  const titleSize = title.length > 14 ? 64 : title.length > 8 ? 80 : 96;

  const darkCard = {
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
    };

  const svg = await satori(
    slug === 'home' ? homeCard(sub) : darkCard,
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
