---
title: Hello, world
created: 2026-05-10
status: published
tags:
  - meta
summary: First post — placeholder so the build pipeline has something to render. Delete when a real first post lands.
---

This is a placeholder so the SvelteKit build has something to prerender. Replace or delete when the first real post is published from the Aria `publisher` profile.

## How content gets here

Posts are markdown files in `src/posts/` with mdsvex-compatible frontmatter. The `/publish` skill in the Aria publisher profile copies an approved vault note into this directory and opens a PR.

```
publisher/queue/2026-05-10-some-post.md   (Aria vault)
                       ↓ /publish site
src/posts/2026-05-10-some-post.md         (this repo, via PR)
                       ↓ git push, CF Pages build
merlin.pages.dev/posts/2026-05-10-some-post
```

Frontmatter schema:

```yaml
---
title: Post title here
created: 2026-05-10
status: published      # only "published" entries are surfaced on the homepage
tags: [tag1, tag2]
summary: Optional one-line summary shown on the index page.
---
```

That's it.
