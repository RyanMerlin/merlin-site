# merlin-site

Static blog for Merlin. **The Aria `publisher` profile drives all content here** — humans (Merlin) approve, agents draft.

## Stack

- **SvelteKit 2** + **mdsvex** (markdown → Svelte) + **adapter-static** → static HTML/JS
- **Tailwind CSS 4** + `@tailwindcss/typography` for prose styling
- **TypeScript** throughout
- **bun** as the package manager
- **Deploy target:** Cloudflare Pages (connect this repo in CF dashboard; no workflow needed)

## Content flow

```
publisher/queue/<post>.md    (Aria vault, source of truth for drafts)
        ↓ /publish skill — opens a PR
src/posts/<post>.md          (this repo, source of truth for what is live)
        ↓ git merge to main
CF Pages build               (bun install + bun run build → upload build/)
        ↓
https://merlin.pages.dev/posts/<slug>
```

The vault is where drafts live. **What ships is what's in `src/posts/` on `main`.** Once a post is merged here, the vault note can be archived to `publisher/published/` — but this repo is authoritative for the live site.

## Post format

Markdown with frontmatter (mdsvex-compatible):

```markdown
---
title: Post title
created: 2026-05-10
status: published
tags: [tag1, tag2]
summary: Optional one-line summary shown on the index.
---

Body markdown here.
```

Only posts with `status: published` (or no `status` field) appear on the homepage.

## Files

| Path | Purpose |
|------|---------|
| `src/posts/` | Markdown post files (mdsvex renders) |
| `src/lib/posts.ts` | Loads + sorts all posts via `import.meta.glob` |
| `src/routes/+page.svelte` | Homepage (post list) |
| `src/routes/posts/[slug]/+page.{ts,svelte}` | Dynamic post route; prerendered |
| `src/routes/layout.css` | Tailwind imports + base styling |
| `scripts/pull-from-vault.sh` | Sync `publisher/published/` notes → `src/posts/` |
| `svelte.config.js` | mdsvex preprocessor + adapter-static |

## Local dev

```bash
bun install
bun run dev          # http://localhost:5173
bun run build        # static output to build/
bun run preview      # serve the built site
bun run check        # type-check + svelte-check
bun run lint
bun run format
```

## Cloudflare Pages setup (do this once)

1. Push this repo to GitHub (`gh repo create merlin-site --private` or `--public`)
2. CF dashboard → Pages → Connect to Git → pick this repo
3. Build settings:
   - Framework preset: **SvelteKit**
   - Build command: `bun run build`
   - Build output: `build`
   - Root directory: (empty)
4. (Optional) Bind a custom domain in the CF Pages app settings — DNS will autoconfigure if the zone is in the same CF account.

## Rules for agents working in this repo

- **Never push to `main` directly.** Always PR. CF Pages auto-deploys from `main` once connected.
- **Only commit `.md` files into `src/posts/` that have already been approved in the Aria vault.** The `/publish` skill enforces this; don't bypass.
- **Don't add server-side features.** This is `adapter-static`. Everything must prerender.
- **Don't add tracking, analytics, or third-party scripts** without Merlin's explicit approval.
- Keep the design opinionated and minimal. Resist the urge to add a CMS, a comments system, or a newsletter widget — Substack handles the newsletter side.
