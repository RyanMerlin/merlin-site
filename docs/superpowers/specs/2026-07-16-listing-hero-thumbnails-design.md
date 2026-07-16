# Listing Page Hero Thumbnails — Design

## Problem

The article listing surfaces (homepage `/` and per-topic `/topics/<slug>`) are pure text
rows. Every post already has a rendered social-share image at `/og/[slug].png` — either
real colocated hero art (`hero.png`/`og.png`, 3/10 posts today) or an auto-generated
satori title card (7/10 posts) — but neither is used anywhere except unfurl previews.
Goal: add a small thumbnail to each list row using that existing image, without
introducing a new image pipeline, and make the auto-generated fallback card visually
distinct per topic instead of one flat dark card for every untagged/no-art post.

## Non-goals

- No new hero art generation workflow (real photography/art creation stays a separate
  manual step per post).
- No redesign of the post page itself (`posts/[slug].astro`) — this only touches list
  rows.
- No grid/featured-large magazine layout — keeps the existing vertical list, adds a
  thumbnail per row.

## Architecture

### Data layer — `src/lib/posts.ts`

Add:

- `topicColorHex` — the dark-mode hex values already living in `global.css`
  (`--topic-ai: #6a8fd4`, `--topic-cog: #bb96cb`, `--topic-econ: #d4a24e`), duplicated
  here as literal TS constants because satori (Node-side render, no CSS cascade) can't
  resolve CSS custom properties. This becomes the single source of truth both the
  satori script and any future card work read from — CSS keeps its own copies for the
  *live* browser-rendered badge/tab colors (unchanged); this new copy is specifically
  for build-time image generation.
- `postThumbnail(post: PostMeta): { src: string; alt: string }` — returns
  `{ src: '/og/' + post.slug + '.png', alt: post.title }`. Trivial today (the URL is
  always derivable from the slug), but centralizing it means if thumbnail sourcing ever
  changes (e.g. a dedicated smaller render), there's one call site to update instead of
  two.

### Image generation — `src/pages/og/[slug].png.ts`

- Import `topics`, `postTopic`, `topicColorHex` from `lib/posts.ts`.
- Replace the fixed gradient (`linear-gradient(145deg, #17130f 0%, #0d0a07 100%)`) with
  a per-topic gradient: blend the post's topic hex into the lighter end of the same
  dark gradient shape, so the card stays legible (title text is `#f6efe2`, needs to stay
  high-contrast against the background at all three topic colors) without changing text
  styling.
- Untagged posts (`postTopic()` returns `undefined`) keep exactly today's neutral dark
  gradient — no behavior change there.
- This function only runs for the satori-generated fallback path; posts with a real
  colocated `hero.png`/`og.png` are returned as-is, untouched (real art already wins
  over anything auto-generated).

### Presentation — homepage (`TopicFilter.tsx`)

- Each `<li>` row wraps its content in a flex row: thumbnail on the left (fixed box,
  landscape crop), text block (topic badge, title, meta, summary) on the right — same
  content as today, just no longer full-width.
- Thumbnail: `<img src={thumbnailSrc} alt={...} loading="lazy" decoding="async"
  width={160} height={84} style={{ objectFit: 'cover', borderRadius: ... }} />`.
  Explicit `width`/`height` attributes prevent layout shift (native, no JS needed).
- `FilterItem` type gains a `thumbnailSrc: string` field, passed down from
  `index.astro`, computed once via `postThumbnail()`.

### Presentation — topic pages (`topics/[topic].astro`)

- Same row shape, same `postThumbnail()` call, hand-written in Astro template syntax
  (no shared UI component across the Astro/React boundary — see Trade-offs). Kept
  visually identical to the homepage row by using the same Tailwind utility classes and
  thumbnail dimensions.

## Data flow

```
build time:
  post.md + (optional hero.png/og.png)
    -> getStaticPaths() in og/[slug].png.ts
    -> real file served as-is  |  satori render (topic-colored if tagged)
    -> static PNG at /og/<slug>.png  (prerendered, Astro output: static)

request time:
  index.astro / topics/[topic].astro
    -> getPosts() / postsByTopic()
    -> postThumbnail(post) -> { src: '/og/<slug>.png', alt }
    -> <img> tag, browser fetches the already-built static PNG, CSS crops to 160x84
```

No new build step, no new API route, no runtime image processing — the crop is CSS
`object-fit: cover` on an existing static asset.

## Trade-offs

- **Shared markup vs. shared data.** True component sharing between the React island
  (`TopicFilter.tsx`) and the static Astro page (`topics/[topic].astro`) isn't possible
  — Astro components compile away at build time and can't be imported into React.
  Unifying at the data layer (`postThumbnail()`, `topicColorHex`) means the URL/color
  logic can't drift between the two surfaces even though the markup is hand-duplicated
  in two small templates, as it already is today for title/date/summary.
- **Landscape (1.91:1) thumbnail, not square.** A square center-crop of a 1200x630
  title card risks clipping the title text, which spans the card's full width. Scaling
  the native ratio down avoids any redesign-for-crop-safety work.
- **Recoloring the fallback card also changes social-share previews** (the same image
  serves `og:image`). Treated as a bonus, not a side effect to hide — surfaced here
  explicitly.

## Error handling

- Missing/broken thumbnail image: the `<img>` `alt` text covers the accessibility case;
  a broken-image icon is the acceptable degraded state (no post can lack an
  `/og/[slug].png.ts`-derived entry — every post gets one, real or generated, so a 404
  here would indicate a build bug elsewhere, not a case to defensively code around).
- Untagged post (no matching topic): falls through to the existing neutral dark
  gradient, unchanged from current behavior — no new failure mode introduced.

## Testing / verification

- Visual check in dev server (`bun run dev`) across: a post with real hero art, a
  tagged post with no hero art (one per topic, confirm distinct accent color), and an
  untagged post (confirm unchanged neutral card).
- Confirm homepage and one `/topics/<slug>` page render matching row heights and
  thumbnail treatment.
- Confirm the site's dark/light theme toggle doesn't clash visually with the thumbnail
  in either theme (the image itself is a static PNG, theme-invariant by design).
- Confirm `bun run build` succeeds (satori/resvg render for all posts, no missing
  font/asset errors).
- Spot-check one post's `og:image` meta tag / social preview to confirm the recolor
  didn't break legibility.
