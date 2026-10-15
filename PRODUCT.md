# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: developers building with AI coding agents who need somewhere safe for those agents to
create, run, and verify cloud code. They arrive with an agent that can run shell commands, and
their job is to point it at a local cloud instead of a real account, with no real credentials in
the agent's context and no bill if it goes wrong.

Secondary: cloud developers and teams doing local development, CI/CD pipelines, and integration
tests on AWS, Azure, GCP, or OCI, including teams moving off LocalStack or Azurite.

Also served: sponsors, companies looking for enterprise support, partners, and press, via
`/contact` and the sponsor tiers.

## Product Purpose

floci.io is the website for Floci, a suite of free, MIT-licensed local cloud emulators: `floci`
(AWS, port 4566), `floci-az` (Azure, 4577), `floci-gcp` (GCP, 4588) and `floci-oci` (OCI, 4599).
The site explains what each emulator does, gets visitors to a running emulator fast, and publishes
the project's Chronicle (news and engineering writing) and hands-on Labs.

Success is measured in four ways, all of them in scope:

- **Install and first run:** the visitor copies an install command and gets an emulator running.
- **Community:** GitHub stars, contributors, Chronicle readers, and RSS subscribers.
- **Sponsors:** GitHub Sponsors tiers and sponsor logos.
- **Leads:** enterprise support, partnership, and press enquiries through the contact form.

## Positioning

A local cloud that coding agents can't break: four standalone emulators covering AWS, Azure, GCP,
and OCI, free forever, with no account, auth token, or internet access needed at runtime. Agents
use throwaway keys, so there's nothing to exfiltrate and nothing to bill. Services such as Lambda,
RDS, Redis, and Kafka run for real rather than as mocks, so code an agent verifies locally behaves
the same in production. For AWS it is a drop-in LocalStack replacement: the same SDK endpoint
override and the same CLI flags.

## Operating Context

- Visitors evaluate from a terminal and an editor: the site's main artifacts are install commands
  (`install.sh`, `install.ps1`, `docker run`), CLI snippets, and SDK endpoint overrides.
- `floci-cli` (`floci start`, `floci env`) is the main install path; `docker run` and Compose are the
  alternatives. The emulators run only as containers (a GraalVM native image inside); there is no
  standalone binary to download.
- Stable releases ship on the 1st and 3rd Tuesday of each month; `nightly` tags track main.
- The emulator dashboards of all four clouds read the site's `/news.json` feed.
- AI agents and crawlers read the site through `public/llms.txt`.

## Capabilities and Constraints

- Static Astro 4 site on GitHub Pages; every push to `main` deploys. No server runtime except the
  contact-form Cloudflare Worker in `workers/contact/`.
- Service counts come only from `SERVICE_COUNTS` in `src/data/services.ts`, derived from the
  emulator repos. Service grids come from `src/data/cloud-services.ts` and use neutral glyphs,
  never vendor product icons.
- The four cloud pages (`/aws`, `/az`, `/gcp`, `/oci`) are equivalent and stay structurally
  consistent; so do Chronicle and Labs.
- Minimal client-side JavaScript and light assets; pages must stay fast.
- Terminology: "emulator", "service", "Chronicle" (Notes and Chronicles), "Labs" ("101 Labs"),
  "State of the Flock" (the monthly issue).

## Brand Commitments

- Name: Floci (product repos `floci`, `floci-az`, `floci-gcp`, `floci-oci`; CLI `floci-cli`).
- MIT license and "free forever: no paid tiers, no feature gates" are binding commitments.
- The incumbent visual system lives in `src/layouts/Layout.astro` (CSS tokens, dark default plus
  `html.light`) and is the design authority until a redesign is chosen.

## Evidence on Hand

- **Performance figures (approved to quote):** 24 ms startup, ~13 MiB idle memory, and against
  LocalStack 138× faster startup and 91% less memory.
- **Service counts:** `SERVICE_COUNTS` in `src/data/services.ts`.
- **Sponsor logos (approved as social proof):** `src/data/sponsors.json`, assets in
  `public/sponsors/`.
- **Content:** Chronicle entries in `src/content/chronicle/`, Labs in `src/content/labs/`,
  YouTube videos under `public/chronicle/videos/`.
- **Not approved:** adoption figures from Chronicle posts (such as "Who's actually using floci")
  are not to be cited as proof. There are no testimonials, user quotes, or customer logos; never
  invent any.

## Product Principles

1. **Agents first, humans never excluded.** Lead with the agent use case, but every page must
   still serve a developer setting up local dev or CI by hand.
2. **Time to a running emulator beats everything.** The install command is always close, and it
   works when copied.
3. **Only claims we can back.** Numbers come from their source of truth or the approved figures
   above, never from a README or a guess.
4. **Four clouds, one family.** Equivalent pages and equivalent treatment for AWS, Azure, GCP, and
   OCI, even though their service counts differ.
5. **Free and open is the point.** Sponsorship and enterprise asks support the project; they
   never read as a paywall.

## Accessibility & Inclusion

- One `<h1>` per page, headings in order, and a working skip link to `<main id="main-content">`.
- Mobile first: no horizontal scroll at 360px, tap targets of at least 44px, body text of at
  least 16px, and code blocks that scroll inside themselves.
- Both themes (dark default and light) must work; motion respects `prefers-reduced-motion`.
