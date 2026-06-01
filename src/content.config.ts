import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Posts live as page bundles: src/posts/<year>/<slug>/index.md (+ colocated images).
// The slug is the parent folder name, not the year or the filename.
const posts = defineCollection({
	loader: glob({
		pattern: '**/index.md',
		base: './src/posts',
		generateId: ({ entry }) => entry.split('/').at(-2)
	}),
	schema: z.object({
		title: z.string(),
		created: z.string(),
		status: z.string().default('published'),
		tags: z.array(z.string()).default([]),
		summary: z.string().optional()
	})
});

export const collections = { posts };
