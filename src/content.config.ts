import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Posts live as page bundles: src/posts/<year>/<slug>/index.md (+ colocated images).
// The slug is the parent folder name, not the year or the filename.
const posts = defineCollection({
	loader: glob({
		pattern: '**/index.md',
		base: './src/posts',
		// entry is always `<year>/<slug>/index.md`, so at(-2) is always a slug —
		// non-null assertion, not a real optional case.
		generateId: ({ entry }) => entry.split('/').at(-2)!
	}),
	schema: z.object({
		title: z.string(),
		created: z.string(),
		status: z.string().default('published'),
		tags: z.array(z.string()).default([]),
		summary: z.string().optional(),
		// SEO/social meta description (<=160 chars). Falls back to a truncated
		// `summary` when omitted — see metaDescription() in lib/posts.ts.
		description: z.string().optional()
	})
});

// Drafts: same shape as posts, but rendered only at /draft/<slug> (noindex,
// excluded from listings/sitemap/RSS). Promote to src/posts/ to publish.
const drafts = defineCollection({
	loader: glob({
		pattern: '**/index.md',
		base: './src/drafts',
		generateId: ({ entry }) => entry.split('/').at(-2)!
	}),
	schema: z.object({
		title: z.string(),
		created: z.string(),
		status: z.string().default('draft'),
		tags: z.array(z.string()).default([]),
		summary: z.string().optional(),
		// SEO/social meta description (<=160 chars). Falls back to a truncated
		// `summary` when omitted — see metaDescription() in lib/posts.ts.
		description: z.string().optional()
	})
});

export const collections = { posts, drafts };
