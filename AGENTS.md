# AGENTS.md

Instructions for coding agents working on this repository.

## What this is

Source for [floci.io](https://floci.io), the website for the Floci local cloud emulators (AWS, Azure,
GCP, OCI). It is a static [Astro 4](https://astro.build) site (`output: 'static'`) with MDX, sitemap
and RSS. Every push to `main` is built and deployed to GitHub Pages by
`.github/workflows/deploy.yml` (Node 20, `npm ci && npm run build`).

## Commands

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # writes dist/ — must pass before committing; CI runs the same command
npm run preview    # serves dist/
npm run add:video -- '<youtube-url>'   # adds a Chronicle video entry + thumbnail
```

There is no test suite; `npm run build` is the gate (content schemas and author handles are
validated at build time).

## Layout

- `src/pages/` — routes: `/`, `/aws` (+ `/aws/compare`), `/az`, `/gcp`, `/oci`, `/floci*`,
  `/chronicle`, `/labs`, legacy `/blog/*` redirects, `og/[slug].png.ts` (OG images), `rss.xml.ts`.
- `src/layouts/Layout.astro` — shared `<head>`, global CSS and design tokens, skip link.
- `src/components/` — `Nav`, `Footer`, `SectionNav`, `ServiceIcon`, `AuthorCard`, etc.
- `src/content/` — `chronicle/` and `labs/` collections; schemas in `src/content/config.ts`.
- `src/data/` — site data (see below).
- `public/` — static assets, `llms.txt`, `install.sh` / `install.ps1`.

## Single sources of truth — never hardcode these

- **Service counts:** `SERVICE_COUNTS` in `src/data/services.ts` is the only place the per-cloud
  "N services" numbers live. Headlines, stat tiles, OG images and JSON-LD derive from it. Derive
  the numbers from the emulator repos' `origin/main` (method in that file's header comment), never
  from their READMEs.
- **Service grids:** `src/data/cloud-services.ts`. Use neutral glyphs from `ServiceIcon`, not
  vendor product icons. Verify every `url` returns HTTP 200 when adding a service.
- **Authors:** `src/data/authors.ts`. An unknown `author` handle fails the build.
- **`public/llms.txt`:** keep it in sync when counts or key facts change.

## Content

- Chronicle entries go in `src/content/chronicle/notes/` or `.../chronicles/`. The filename is the
  public URL `/chronicle/<slug>/` and must be unique across both folders; don't set a `slug`
  field. Required: `title`, `description`, `pubDate`, `author`. Optional: `subtitle`, `tags`,
  `draft`, `heroImage`.
- Labs go in `src/content/labs/`. Required: `title`, `description`, `cloud`, `difficulty`,
  `duration`, `author`.
- Drafts show in dev only; they are excluded from production routes and RSS.
- Fenced code blocks are wrapped in the site's terminal frame by `astro.config.mjs`. Tag shell
  snippets as `bash`/`sh`.
- See `README.md` for the full publishing checklist.

## Design and UX conventions

- Reuse the CSS tokens defined in `Layout.astro` (`--bg*`, `--text*`, `--accent*`, `--border*`,
  `--mono`, `--sans`). Don't introduce new hardcoded colors.
- Both themes must work: dark (default) and `html.light`.
- The main nav is identical on every page (`Nav.astro`); don't fork it per page.
- Keep equivalent pages (the AWS / Azure / GCP / OCI pages; Chronicle vs Labs) structurally
  consistent.
- Mobile first: no horizontal scroll at 360px, tap targets ≥ 44px, body text ≥ 16px, code blocks
  scroll inside themselves.
- One `<h1>` per page, headings in order, and a `<main id="main-content">` so the skip link works.
- Keep pages fast: avoid client-side JS and heavy assets; prefer WebP images with width/height set.

## Contact form

- `/contact` (`src/pages/contact.astro`) posts to a Cloudflare Worker in `workers/contact/`, which
  emails the team through Resend (and pings Telegram when its secrets are set; currently off). See `workers/contact/README.md`.
- The endpoint, Turnstile site key and contact address live in `src/data/contact.ts`; the topic list
  lives in `workers/contact/src/topics.ts` and is shared by both. Don't hardcode any of them.
- Secrets live only in Cloudflare (`wrangler secret put`), never in the repo.
- The Worker has its own `package.json`; `npm run build` for the site doesn't touch it. Run
  `npm test` in `workers/contact/` when changing it.

## Git

- Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:` (see `git log`).
- Branch off `main` for PRs.
- Do not add `Co-Authored-By` trailers to commits.

## Maintainers

See [MAINTAINERS.md](MAINTAINERS.md).
