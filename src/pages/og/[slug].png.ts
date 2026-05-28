import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const pages = [
  { slug: 'home',    title: 'floci',              sub: 'Local cloud emulators for AWS · Azure · GCP',      color: '#ffe082', tag: 'Open Source · MIT License' },
  { slug: 'aws',     title: 'floci',              sub: '47 AWS services. 24 ms startup. No auth token.',   color: '#FF9900', tag: 'Drop-in LocalStack replacement' },
  { slug: 'az',      title: 'floci-az',           sub: '8 Azure services. Native speed. MIT license.',     color: '#0078D4', tag: 'Blob · Queue · Functions · Key Vault' },
  { slug: 'gcp',     title: 'floci-gcp',          sub: 'Google Cloud emulator. No account needed.',        color: '#34A853', tag: 'Cloud Storage · Pub/Sub · Firestore' },
  { slug: 'compare', title: 'Floci vs LocalStack', sub: 'Free · No auth token · Drop-in replacement.',    color: '#ffe082', tag: '138× faster startup · 91% less memory' },
];

export const getStaticPaths: GetStaticPaths = () =>
  pages.map(p => ({ params: { slug: p.slug }, props: p }));

const fontData: ArrayBuffer = readFileSync(join(process.cwd(), 'src/fonts/Sora.ttf')).buffer as ArrayBuffer;

export const GET: APIRoute = async ({ props }) => {
  const { title, sub, color, tag } = props as typeof pages[0];

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px', height: '630px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          background: '#0f1117', padding: '64px 80px',
          fontFamily: 'Sora',
        },
        children: [
          // Wordmark row
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '14px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    },
                    children: {
                      type: 'div',
                      props: { style: { width: '18px', height: '12px', background: '#0f1117', borderRadius: '6px' }, children: '' },
                    },
                  },
                },
                {
                  type: 'div',
                  props: { style: { fontSize: 22, color: color, fontWeight: 700, letterSpacing: '1px' }, children: 'floci.io' },
                },
              ],
            },
          },
          // Main title + subtitle
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '18px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { fontSize: title.length > 12 ? 72 : 96, fontWeight: 700, color: color, lineHeight: '1', letterSpacing: '-2px' },
                    children: title,
                  },
                },
                {
                  type: 'div',
                  props: { style: { fontSize: 30, color: 'rgba(232,234,246,0.65)', fontWeight: 400, lineHeight: '1.4' }, children: sub },
                },
              ],
            },
          },
          // Bottom tag + divider
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '14px' },
              children: [
                { type: 'div', props: { style: { width: '48px', height: '3px', background: color, borderRadius: '2px', opacity: '0.7' }, children: '' } },
                { type: 'div', props: { style: { fontSize: 18, color: 'rgba(121,134,203,0.7)', fontWeight: 400, letterSpacing: '0.5px' }, children: tag } },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200, height: 630,
      fonts: [{ name: 'Sora', data: fontData, weight: 700, style: 'normal' }],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();
  return new Response(png, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000' } });
};
