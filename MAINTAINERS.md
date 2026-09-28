# Maintainers

This file lists the people responsible for this repository. See the org-wide
[GOVERNANCE.md](https://github.com/floci-io/.github/blob/main/GOVERNANCE.md) for roles and the
path to becoming a Maintainer.

## Lead Maintainer
- Hector Ventura (@hectorvent): final authority across the project.

## Maintainers (this repository)
- Hector Ventura (@hectorvent): the floci.io website.

## Publishing the Chronicle

- Add Notes to `src/content/chronicle/notes/<slug>.mdx` and long-form stories to
  `src/content/chronicle/chronicles/<slug>.mdx`. The filename becomes the flat public URL
  `/chronicle/<slug>/`, so filenames must be unique across both folders. Do not add a custom
  frontmatter `slug`.
- Every entry requires `title`, `description`, and `pubDate`. `tags`, `draft`, and `heroImage` are
  optional. Dates order entries within each section; they do not schedule publication. Drafts are
  visible in development but excluded from production routes and `/rss.xml`. A `heroImage` path
  under `public/` becomes the entry's index artwork and opened-page banner; add inline images with
  normal MDX `<figure>` and `<img>` elements.
- Add a YouTube video with `npm run add:video -- '<youtube-url>'`. Commit the page update and the
  downloaded thumbnail under `public/chronicle/videos/`.
- Run `npm run build` before publishing. Check `/chronicle/`, one Note, one Chronicle, legacy
  `/blog/<slug>/` redirects, and `/rss.xml`.

## Emeritus
- (none yet)
