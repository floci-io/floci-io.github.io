---
name: floci.io
description: Website for the Floci local cloud emulators. A quiet night-indigo console where the terminal is the hero.
colors:
  indigo-light: "#7A7FD6"
  indigo: "#5559A7"
  indigo-mid: "#6368C2"
  indigo-ink: "#44488C"
  indigo-cream: "#E8E9F8"
  night: "#070B14"
  night-raised: "#161E2E"
  night-sunken: "#0F1520"
  night-border: "#2A3142"
  night-border-bright: "#3D4559"
  starlight: "#F8FAFC"
  slate-muted: "#94A3B8"
  slate-dim: "#7A889E"
  day: "#F8FAFC"
  day-raised: "#F1F5F9"
  day-sunken: "#E2E8F0"
  day-border: "#CBD5E1"
  signal-green: "#22c55e"
  signal-red: "#ef4444"
  signal-green-text: "#22c55e"
  signal-green-text-day: "#1E7E34"
  cloud-aws: "#FF9900"
  cloud-azure: "#0078D4"
  cloud-gcp: "#34A853"
  cloud-oci: "#C74634"
  cloud-azure-text: "#3A9BEF"
  cloud-oci-text: "#F0604D"
  cloud-aws-day: "#9A4D00"
  cloud-azure-day: "#0067B8"
  cloud-gcp-day: "#1E7E34"
  cloud-oci-day: "#B03A2A"
  term-bg: "#0d1117"
  term-bar: "#161b22"
  term-border: "#30363d"
  term-text: "#e6edf3"
  term-dim: "#8b949e"
  term-accent: "#a5a9f0"
  term-string: "#a5d6a7"
  term-dot-close: "#ff5f57"
  term-dot-min: "#febc2e"
  term-dot-max: "#28c840"
  logo-ink: "#262425"
  logo-cloud-ink: "#151515"
  white: "#FFFFFF"
  sponsor-gold: "#E8C574"
  sponsor-gold-day: "#A67C2E"
  gcp-yellow: "#fbbc04"
typography:
  display:
    fontFamily: "Sora, sans-serif"
    fontSize: "clamp(48px, 7.5vw, 96px)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-3px"
  headline:
    fontFamily: "Sora, sans-serif"
    fontSize: "clamp(28px, 4vw, 44px)"
    fontWeight: 800
    letterSpacing: "-1px"
  title-lg:
    fontFamily: "Sora, sans-serif"
    fontSize: "26px"
    fontWeight: 700
  title:
    fontFamily: "Sora, sans-serif"
    fontSize: "22px"
    fontWeight: 700
  title-sm:
    fontFamily: "Sora, sans-serif"
    fontSize: "20px"
    fontWeight: 700
  body:
    fontFamily: "Sora, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "Sora, sans-serif"
    fontSize: "16px"
    fontWeight: 400
  ui:
    fontFamily: "Sora, sans-serif"
    fontSize: "15px"
    fontWeight: 500
  small:
    fontFamily: "Sora, sans-serif"
    fontSize: "14px"
    fontWeight: 500
  label:
    fontFamily: "Space Mono, monospace"
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "3px"
  code:
    fontFamily: "Space Mono, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.75
  micro:
    fontFamily: "Space Mono, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "1px"
  editorial-display:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "clamp(48px, 7vw, 88px)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.055em"
  editorial-headline:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-1px"
rounded:
  tag: "4px"
  inline: "6px"
  control: "8px"
  terminal: "10px"
  card: "12px"
  panel: "14px"
  feature: "16px"
  pill: "100px"
spacing:
  section-y: "100px"
  section-y-mobile: "60px"
  gutter: "2rem"
  gutter-mobile: "1rem"
  container: "1100px"
components:
  button-primary:
    backgroundColor: "{colors.indigo}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "13px 28px"
  button-primary-hover:
    backgroundColor: "{colors.indigo-mid}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.starlight}"
    rounded: "{rounded.control}"
    padding: "13px 28px"
  button-ghost-hover:
    textColor: "{colors.indigo-light}"
  nav-bar:
    backgroundColor: "rgba(7,11,20,0.92)"
    textColor: "{colors.slate-muted}"
    height: "60px"
  nav-tool:
    backgroundColor: "transparent"
    textColor: "{colors.slate-muted}"
    rounded: "{rounded.control}"
    height: "36px"
  terminal:
    backgroundColor: "{colors.term-bg}"
    textColor: "{colors.term-text}"
    typography: "{typography.code}"
    rounded: "{rounded.terminal}"
    padding: "54px 20px 18px"
  cloud-card:
    backgroundColor: "{colors.night}"
    textColor: "{colors.starlight}"
    rounded: "{rounded.card}"
    padding: "20px 22px 18px"
  tag:
    backgroundColor: "rgba(85,89,167,0.12)"
    textColor: "{colors.indigo-light}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "2px 8px"
  input:
    backgroundColor: "{colors.night}"
    textColor: "{colors.starlight}"
    rounded: "{rounded.control}"
---

# Design System: floci.io

## Overview

**Creative North Star: "The Night Shift Terminal"**

floci.io reads like a developer's console late in the evening: a deep night-indigo field, quiet
chrome, and a lit terminal window at the centre of attention. The product is a set of commands you
run, so the terminal is the main visual object. Install blocks, CLI snippets and agent transcripts
sit in real window frames with traffic-light dots and a copy button, and they stay dark in both
themes. Everything around them steps back: thin 1px borders, slate secondary text, one indigo accent,
and Space Mono labels that read like a status line.

Density is generous on marketing surfaces (100px section rhythm, 1100px container, 96px display
headlines) and calmer in reading surfaces. The Chronicle switches to a Georgia serif voice for
headlines, pull quotes and subtitles, so engineering writing reads as editorial rather than as a
product page. The four clouds share one shell and are told apart only by a single accent hue each
(orange, blue, green, coral), applied to dots, underlines and top borders, never to whole surfaces.

Components are quiet and precise: flat at rest, colour only on state, and movement no larger than a
1–2px lift. Dark is the default theme; `html.light` is a full peer, not an afterthought.

**Key Characteristics:**
- Night-indigo field (dark default) with a full light theme.
- The terminal window is the signature object, dark in both themes.
- One indigo accent; four cloud hues used as thin markers only.
- Sora for interface and headlines, Space Mono for labels and code, Georgia for Chronicle editorial.
- Flat, bordered surfaces; depth comes from tone and 1px lines, not shadows.

## Colors

A cool, low-chroma night palette carried by a single periwinkle-indigo accent, with four cloud hues
reserved for identity markers and the terminal palette held apart.

### Primary
- **Flock Indigo** (`indigo`): the primary action colour. It fills primary buttons, is the logo dot
  in light mode, and is the accent in the light theme.
- **Periwinkle Signal** (`indigo-light`): the accent on dark. It covers section labels, links, focus
  rings, the logo dot, active tab underlines and hover text.
- **Indigo Dusk** (`indigo-mid`) and **Indigo Ink** (`indigo-ink`): hover and pressed steps of
  the primary (dark and light themes respectively).
- **Indigo Cream** (`indigo-cream`): the pale tint of the accent, used for soft fills and as text
  on indigo.

### Secondary
- **Cloud hues**, one per emulator, in two tiers. The brand tier is **Cargo Orange**
  (`cloud-aws`), **Azure Blue** (`cloud-azure`), **Field Green** (`cloud-gcp`) and **Oracle Red**
  (`cloud-oci`). It covers marks: dots, borders, service icons, logo dots, glows, large hero
  accents, Labs badges and OG images. The text tier is for small text. On dark, AWS and GCP use
  their brand hue, while Azure and OCI use the lighter **Sky Signal** (`cloud-azure-text`) and
  **Ember Coral** (`cloud-oci-text`), because the brand hues fall below 4.5:1 on the night
  backgrounds. On light, all four use the darker `-day` variants. They mark identity only: nav
  hover and active, section-nav dot and underline, hero eyebrows, install links, card top borders,
  status dots.

### Neutral
- **Night** (`night`): page background on dark. **Night Raised** (`night-raised`) and **Night
  Sunken** (`night-sunken`) give alternate section bands and inset panels.
- **Night Border** / **Night Border Bright**: 1px dividers and control outlines.
- **Starlight** (`starlight`): primary text on dark. **Slate Muted** (`slate-muted`): secondary
  text. **Slate Dim** (`slate-dim`): tertiary text, meta and icons; on light it is `#5F6E84`. Both
  clear 4.5:1 on the page and raised backgrounds, so dim text stays readable at small sizes.
- **Day** family (`day`, `day-raised`, `day-sunken`, `day-border`): the light theme's surfaces.
  In light mode secondary text is slate (`--text-muted: #475569`); indigo is kept for links, labels and state, so it still reads as interactive.
- **Signal Green** / **Signal Red**: success (copied, valid) and error (invalid field) only. Green
  as text on page backgrounds uses `--green-text` (`signal-green-text`, `-day` on light), because
  Signal Green fails contrast on the light theme.
- **Logo inks** (`logo-ink`, `logo-cloud-ink`): the wordmark and cloud fills of the floci logo on
  the light theme. On dark the logo uses Starlight. `white` is text on Flock Indigo fills only.
- **Sponsor Gold** (`sponsor-gold`, `sponsor-gold-day` on light): the gold sponsor tier only.
- **GCP Yellow** (`gcp-yellow`): "coming soon" badges and the yellow status dot on the GCP page.
- **Terminal palette** (`term-*`): a GitHub-dark style window that never changes with the theme,
  including the three window-bar dots (`term-dot-*`).
  Accent and string colours are tuned to it and are not used outside code.

### Named Rules
**The One Accent Rule.** Indigo is the only interface accent. Cloud hues identify a cloud; they never
style a generic button, link or section.

**The One Source Rule.** The text-tier cloud hues are the `--c-aws`, `--c-az`, `--c-gcp` and `--c-oci`
custom properties in `Layout.astro`, which switch to the `-day` values on `html.light`. Components read
those variables; they never repeat the hex values.

**The Two-Tier Hue Rule.** A cloud hue in small text (under 24px, or under 18.66px bold) uses the
text tier: `cloud-azure-text` / `cloud-oci-text` on dark and `-day` on light. Marks, icons, borders
and large headlines use the brand hue.

**The Thin Marker Rule.** A cloud hue appears as a dot, a 2px underline, a 2px top border or hover
text, never as a filled surface or a large block of text.

**The Token Rule.** Colours come from the `Layout.astro` custom properties (`--bg*`, `--text*`,
`--accent*`, `--border*`, `--term-*`). Don't introduce new hardcoded colours. Cloud hues are the one
exception, and they use the canonical set above.

## Typography

**Display Font:** Sora (with sans-serif)
**Body Font:** Sora (with sans-serif)
**Label/Mono Font:** Space Mono (with monospace)
**Editorial Font:** Georgia (with 'Times New Roman', serif), for the Chronicle only

**Character:** Sora's geometric, heavy display weights make the headlines confident and slightly
techy. Space Mono makes labels read like terminal output, and Georgia gives the Chronicle a calm
editorial counter-voice.

### Hierarchy
- **Display:** the hero `h1` on landing and cloud pages. Tight negative tracking that relaxes on
  mobile (-1.5px at ≤768px, -1px at ≤480px).
- **Headline:** section `h2`s, always preceded by a mono Label.
- **Title (lg / default / sm):** 26 / 22 / 20px card and panel titles, sponsor prices, feature
  headings.
- **Body:** 18px running text. Section descriptions are capped at about 540px. The site never goes
  below 16px for body text.
- **Body small / UI / Small:** 16px for secondary paragraphs, card descriptions and form text;
  15px for buttons; 14px for nav links, inline code and dense UI copy.
- **Label:** the uppercase mono eyebrow above every section heading, plus tags and meta.
- **Code:** terminal contents. 11–12px mono for tabs, copy buttons and the window-bar language
  label.
- **Micro:** 11px mono for metadata: dates, tags, figure captions, protocol notes, sponsor names.
  This is the floor; nothing on the site is set smaller.
- **Editorial Display / Headline:** Chronicle article titles, subtitles, prose `h2`s, pull quotes
  and index feature headings, all at weight 400.

### Named Rules
**The 11px Floor Rule.** No text is smaller than 11px. Metadata that wants to recede does it with
colour and case, not with a smaller size.

**The Mono Means Machine Rule.** Space Mono marks things that are technical or system-like: labels,
code, ports, counts, tags. Never set paragraphs or headlines in it.

**The Serif Is the Chronicle Rule.** Georgia appears only in Chronicle (and the author card). Product
pages stay in Sora.

## Layout

A single centred column: sections are full-bleed bands (`section-y` vertical by `gutter`
horizontal) with content in a 1100px container. Section bands alternate between the `night` and
`night-raised` backgrounds. A fixed 60px translucent nav (blur 12px) sits above everything, and
`scroll-padding-top: 72px` keeps anchors clear of it. Cloud pages add a sticky `SectionNav` under
the main nav.

Grids are CSS grid/flex and collapse to one column on small screens. The main breakpoints are 960px
(nav collapses to the burger menu), 768px (stacked hero actions, tighter display tracking) and 480px
(60px by 1rem section padding). Several components add local breakpoints between 560px and 900px.
The mobile floor applies: no horizontal scroll at 360px, tap targets of at least 44px, and code
blocks that scroll inside themselves.

## Elevation & Depth

The system is flat. Depth comes from tonal steps (night, then night-sunken, then night-raised) and
1px borders, not from shadows. The few shadows that exist are responses to state or a
light-theme correction:

- **Card hover glow** (`box-shadow: 0 12px 32px color-mix(in srgb, var(--chip) 14%, transparent)`):
  a faint cloud-tinted lift on cloud cards, paired with `translateY(-2px)`.
- **Terminal on light** (`--term-shadow: 0 8px 24px rgba(15, 23, 42, 0.12)`): lets the dark terminal
  sit on the pale light-theme page. It is `none` on dark.
- **Inset underlines** (`box-shadow: inset 0 -2px 0 <accent>`): active nav, tab and section-nav
  states, drawn as an inset shadow so the box never moves.

### Named Rules
**The Flat-at-Rest Rule.** Surfaces carry no shadow at rest. A shadow appears only on hover, or to
seat the terminal on the light theme.

**The Still Box Rule.** State changes (active, hover, selected) never change an element's size or
position, except a hover lift of 1–2px. Underlines are inset shadows, not borders.

## Shapes

Gently rounded and consistent per role: 4px for tags and small chips, 6px for inline elements
(heading anchors, small icon buttons), 8px for buttons, nav tools and inputs, 10px for terminal
windows (tabs take the top 10px corners, the block the bottom ones), 12px for cards (the dominant
radius), 14px for larger panels, 16px for feature banners, pills at 100px, and dots at 50%. Values
outside this scale (2px, 3px, 5px, 20px) are drift. Borders are always
1px solid. The only heavier stroke is the 2px cloud-hue top border on cloud cards and the 2px inset
underline for active states.

## Components

### Buttons
- **Shape:** gently rounded (8px).
- **Primary:** Flock Indigo fill, white 15px/700 Sora text, 13px by 28px padding, inline-flex with
  an 8px gap for icons.
- **Hover / Focus:** primary moves to Indigo Dusk and lifts 1px; transitions are 0.2s. The focus
  ring is a 2px accent outline.
- **Ghost:** transparent with a 1px bright border and weight 500. On hover the border and text turn
  accent.

### Chips (tags and pills)
- **Tag:** 11px mono on the accent tint (`--accent-dim`) in accent text, 4px radius.
- **Cloud pill:** a rounded pill with a cloud-hue status dot; the dot carries the colour, the pill
  stays neutral.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** page background (`--bg`) on a raised band, or `--bg2` on a base band.
- **Shadow Strategy:** none at rest; see Elevation & Depth.
- **Border:** 1px `--border`. Cloud cards add a 2px cloud-hue top border, and on hover the side
  borders tint toward the hue.
- **Internal Padding:** about 20–22px.

### Inputs / Fields
- **Style:** 1px border, page background, 8px radius, 16px text (prevents iOS zoom).
- **Focus:** 2px accent outline with a 1px offset, and the border turns accent.
- **Error:** border turns Signal Red (`aria-invalid="true"`).
- **Topic picker:** radio cards whose selected state is drawn on the label body, with the focus
  ring forwarded from the hidden radio.

### Navigation
- **Bar:** fixed, 60px, translucent `--nav-bg` with a 12px backdrop blur and a 1px bottom border.
  It is identical on every page.
- **Links:** Sora 14px/500 in muted text. Hover and active turn to full text, and active adds a 2px
  inset underline in `currentColor`. Cloud links take their cloud hue on hover and active.
- **Tools:** the GitHub link and theme toggle are 36px bordered 8px-radius boxes.
- **Mobile:** at 960px and below the links collapse behind a 44px burger that animates into an X.

### Terminal Window (signature component)
The site's hero object. It is a dark frame in both themes with a 36px window bar holding three
traffic-light dots and a centred mono language label from `data-lang`. Contents are 13px Space
Mono with a 1.75 line height, using classes for the command, comment, accent and string colours. A
Copy button sits top right: faint until hover or focus, and green "copied" on success. Tabbed
variants (install picker, multi-language snippets) replace the window bar with a row of mono tabs,
where the active tab gets a 2px indigo inset underline. The home install picker wraps its tabs
rather than scrolling them. Every fenced code block in MDX is wrapped in this frame by
`astro.config.mjs`.

### Section Label
The uppercase Space Mono eyebrow (12px, 3px tracking, Periwinkle Signal) that introduces every
section heading. It is the site's most repeated typographic signature.

## Do's and Don'ts

### Do:
- **Do** put commands in the Terminal Window. A command shown anywhere else is plain text without
  the copy affordance.
- **Do** introduce each section with a mono Section Label followed by a Sora 800 headline.
- **Do** pick the cloud-hue tier by use: the brand hue for marks and large type, the text tier for
  small text (see The Two-Tier Hue Rule). Keep cloud hues to dots, 2px lines, icons and accent
  text.
- **Do** check every change in both themes. The terminal stays dark; everything else follows the
  theme tokens.
- **Do** keep hover motion to a 1–2px lift and transitions to about 0.15–0.25s, and honour
  `prefers-reduced-motion`.
- **Do** use neutral `ServiceIcon` glyphs for service grids.

### Don't:
- **Don't** set small text in `cloud-azure` or `cloud-oci` on a dark background; it fails 4.5:1.
- **Don't** use vendor product icons or logos in service grids.
- **Don't** add drop shadows to cards, buttons or sections at rest.
- **Don't** fill surfaces or buttons with a cloud hue, or use one as a generic accent.
- **Don't** set Georgia outside the Chronicle, or Space Mono for running text.
- **Don't** fork the nav per page or change its height or position between pages.
