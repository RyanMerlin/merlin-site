# merlin-site

Static blog for Merlin (ryanmerlin.com). **The Aria `publisher` profile drives all content here** — humans (Merlin) approve, agents draft.

## Stack

- **Astro 5** + **React 19 islands** (`@astrojs/react`) — static-by-default; only interactive components ship JS
- **Tailwind CSS 4** (`@tailwindcss/vite`) + `@tailwindcss/typography` for prose styling
- **TypeScript** throughout
- **bun** as the package manager
- **Deploy target:** Cloudflare Pages, direct-upload via GitHub Actions (`.github/workflows/deploy.yml` → `wrangler pages deploy dist`)

Migrated from SvelteKit/mdsvex on 2026-05-31. The only React island today is the home-page topic filter (`src/components/TopicFilter.tsx`); every other page is pure static `.astro` and ships zero JavaScript.

## Content flow

```
publisher/queue/<post>.md           (Aria vault — drafts, pending approval)
        ↓ /pub publish  (Merlin approves: "yes, send it")
src/posts/<year>/<slug>/index.md    (this repo — SOURCE OF TRUTH for what is live)
        ↓ git push to main
GitHub Action (deploy.yml)          (bun install + astro build → wrangler pages deploy dist)
        ↓
https://ryanmerlin.com/posts/<slug>
```

The vault is where drafts originate. **What ships is what's in `src/posts/` on `main`.** This repo is authoritative for the live site.

## Post format — page bundles

Each post is a folder: `src/posts/<year>/<slug>/index.md`, with colocated images alongside it. Astro's content collection (`src/content.config.ts`) globs these; the **slug is the parent folder name**.

```markdown
---
title: "Post title"
created: "2026-05-10"
status: published
tags: ["tag1", "tag2"]
summary: "Optional one-line summary shown on the index (also the on-page listing/RSS excerpt)."
description: "Optional SEO/social meta description, <=160 chars."
---

Body markdown here.

![alt](./colocated-image.png)
```

**`summary` vs `description`:** `summary` is the visible excerpt (homepage, topic pages, RSS). `description` is the SEO/social `<meta>` (and OG/Twitter/JSON-LD) and must stay ≤160 chars for Bing. When `description` is omitted, `metaDescription()` in `src/lib/posts.ts` falls back to a word-boundary-truncated `summary`, then to the site description — it never emits an empty tag. Prefer writing an explicit `description` on any post whose `summary` exceeds 160.

Relative image paths (`./img.png`) go through Astro's image pipeline (→ hashed WebP). Only posts with `status: published` (or no `status`) appear on the homepage. For a rare absolute-path image, put the file in `public/images/` and reference `/images/<file>.png`.

**`evidence.md` (optional, never rendered):** a bundle may carry a sibling `src/posts/<year>/<slug>/evidence.md` holding the post's research provenance (discourse position, so-what test, verified sources). The content collection globs `**/index.md` only, so `evidence.md` lives in the repo as provenance but is never built, routed, or served. It is the published home of a post's vault `drafts/<slug>-evidence.md` scaffold.

## Files

| Path | Purpose |
|------|---------|
| `src/posts/<year>/<slug>/index.md` | Post page bundles (markdown + colocated images) |
| `src/posts/<year>/<slug>/evidence.md` | Optional research provenance; globbed out (`**/index.md` only) — never rendered |
| `src/content.config.ts` | Content collection: glob loader + Zod schema |
| `src/lib/posts.ts` | `getPosts()` + topic / related / reading-time helpers (`getCollection`) |
| `src/pages/index.astro` | Homepage; mounts the `TopicFilter` React island |
| `src/pages/posts/[slug].astro` | Post route (`getStaticPaths` + `<Content />`) |
| `src/pages/{about,now,connect}.astro` | Static pages |
| `src/pages/topics/[topic].astro` + `.../feed.xml.ts` | Topic landing + per-topic RSS |
| `src/pages/{feed.xml,sitemap.xml}.ts`, `src/pages/og/[slug].png.ts` | RSS, sitemap, per-post OG images (satori + resvg) |
| `src/components/TopicFilter.tsx` | The one React island (home topic filter) |
| `src/components/*.astro`, `src/layouts/Base.astro` | Static components + page shell |
| `src/styles/global.css` | Tailwind imports + theme + prose styling |
| `public/` | Static assets served at root (`_headers`, `_redirects`, favicons, `robots.txt`, `images/`) |
| `scripts/pull-from-vault.sh` | Sync helper: vault notes → `src/posts/` (predates Astro; verify the target path before relying on it) |

## Local dev

```bash
bun install
bun run dev          # http://localhost:4321
bun run build        # static output to dist/
bun run preview      # serve the built site
bun run check        # astro check (type-check)
```

## Deploy (already configured — no CF dashboard build)

Push to `main` triggers `.github/workflows/deploy.yml`: `bun install --frozen-lockfile` → `bun run build` → `wrangler pages deploy dist --project-name=merlin-site`. The output dir (`dist`) is declared in both `wrangler.jsonc` and the workflow. Cloudflare Pages is **direct-upload via the Action**, not a CF-side git build — there is no framework preset or build config in the CF dashboard to maintain.

Rollback: `git revert` + push, or redeploy a prior build from the CF Pages dashboard (all deploys retained).

## Rules for agents working in this repo

- **Pushing to `main` requires Merlin's explicit approval** (the publisher draft-only-autonomy rule). When approved, push **directly to `main`** — that is the deploy trigger. No PR/branch workflow is required (Merlin's convention).
- **Only commit posts into `src/posts/` that have been approved in the Aria vault.** The `/pub publish` skill enforces this; don't bypass.
- **Static only.** No SSR/server features beyond build-time prerendered routes. Everything must build to `dist/` as static output.
- **SEO continuity is load-bearing.** Don't change post URLs, `public/_redirects` (the legacy 301s), `robots.txt`, or the sitemap path without weighing the impact. Search Console verification is DNS/Cloudflare-based.
- **Don't add tracking/analytics/third-party scripts** beyond the existing GA tag without Merlin's explicit approval.
- Keep the design opinionated and minimal. No CMS, comments, or newsletter widget — Substack handles the newsletter.
