# floci.io

Source for [floci.io](https://floci.io), built with [Astro](https://astro.build) and deployed to
GitHub Pages.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # writes dist/
npm run preview  # serves dist/
```

## Publishing the Chronicle

- Add Notes to `src/content/chronicle/notes/<slug>.mdx` and long-form stories to
  `src/content/chronicle/chronicles/<slug>.mdx`. The filename becomes the flat public URL
  `/chronicle/<slug>/`, so filenames must be unique across both folders. Do not add a custom
  frontmatter `slug`.
- Every entry requires `title`, `description`, `pubDate`, and `author`. `subtitle`, `tags`,
  `draft`, and `heroImage` are optional. Keep `title` short; it is set in very large type. Put the
  rest in `subtitle`, which is shown under the heading and joined to the title as
  `Title: Subtitle` for the browser tab, RSS, and structured data. `author` is a handle from `src/data/authors.ts` (`hectorvent` or
  `floci-team`); an unknown handle fails the build. Labs require `author` too. To credit a new
  person, add them to that file with their name and GitHub, LinkedIn, and X links. Dates order entries within each section; they do not schedule publication. Drafts are
  visible in development but excluded from production routes and `/rss.xml`. A `heroImage` path
  under `public/` becomes the entry's index artwork and opened-page banner; add inline images with
  normal MDX `<figure>` and `<img>` elements.
- Add a YouTube video with `npm run add:video -- '<youtube-url>'`. Commit the page update and the
  downloaded thumbnail under `public/chronicle/videos/`.
- Run `npm run build` before publishing. Check `/chronicle/`, one Note, one Chronicle, legacy
  `/blog/<slug>/` redirects, and `/rss.xml`.

## Maintainers

See [MAINTAINERS.md](MAINTAINERS.md).
