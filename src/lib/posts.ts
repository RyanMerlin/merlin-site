import type { SvelteComponent } from 'svelte';

export type PostMeta = {
	slug: string;
	title: string;
	created: string;
	tags: string[];
	summary?: string;
};

type RawModule = {
	metadata: Omit<PostMeta, 'slug'> & Record<string, unknown>;
	default: typeof SvelteComponent;
};

const modules = import.meta.glob<RawModule>('/src/posts/*.md', { eager: true });

function toMeta(path: string, mod: RawModule): PostMeta {
	const slug = path.split('/').pop()!.replace(/\.md$/, '');
	const m = mod.metadata ?? {};
	return {
		slug,
		title: (m.title as string) ?? slug,
		created: (m.created as string) ?? '1970-01-01',
		tags: Array.isArray(m.tags) ? (m.tags as string[]) : [],
		summary: m.summary as string | undefined
	};
}

export const posts: PostMeta[] = Object.entries(modules)
	.filter(([, mod]) => {
		const status = mod.metadata?.status as string | undefined;
		return !status || status === 'published';
	})
	.map(([path, mod]) => toMeta(path, mod))
	.sort((a, b) => b.created.localeCompare(a.created));

export async function loadPost(slug: string) {
	const path = `/src/posts/${slug}.md`;
	const mod = modules[path];
	if (!mod) throw new Error(`Post not found: ${slug}`);
	return { meta: toMeta(path, mod), Component: mod.default };
}
