import type { SvelteComponent } from 'svelte';

export type PostMeta = {
	slug: string;
	title: string;
	created: string;
	tags: string[];
	summary?: string;
	wordCount: number;
};

type RawModule = {
	metadata: Omit<PostMeta, 'slug' | 'wordCount'> & Record<string, unknown>;
	default: typeof SvelteComponent;
};

const modules = import.meta.glob<RawModule>('/src/posts/*.md', { eager: true });
const rawModules = import.meta.glob<string>('/src/posts/*.md', { query: '?raw', eager: true });

function countWords(path: string): number {
	const mod = rawModules[path] as unknown as { default: string } | string | undefined;
	const raw = typeof mod === 'string' ? mod : (mod as { default: string } | undefined)?.default ?? '';
	const body = raw.replace(/^---[\s\S]*?---/, '');
	return body.trim().split(/\s+/).filter(Boolean).length;
}

function toMeta(path: string, mod: RawModule): PostMeta {
	const slug = path.split('/').pop()!.replace(/\.md$/, '');
	const m = mod.metadata ?? {};
	return {
		slug,
		title: (m.title as string) ?? slug,
		created: (m.created as string) ?? '1970-01-01',
		tags: Array.isArray(m.tags) ? (m.tags as string[]) : [],
		summary: m.summary as string | undefined,
		wordCount: countWords(path)
	};
}

export const posts: PostMeta[] = Object.entries(modules)
	.filter(([, mod]) => {
		const status = mod.metadata?.status as string | undefined;
		return !status || status === 'published';
	})
	.map(([path, mod]) => toMeta(path, mod))
	.sort((a, b) => b.created.localeCompare(a.created));

export type Topic = {
	slug: string;
	label: string;
	color: string;
	matchTags: string[];
};

export const topics: Topic[] = [
	{ slug: 'ai', label: 'AI & Agents', color: '#7c9cf8', matchTags: ['ai', 'agents', 'edgeplane', 'mcp', 'acp', 'a2a', 'infrastructure', 'architecture', 'dora', 'productivity', 'devops'] },
	{ slug: 'cognitive-science', label: 'Cognitive Science', color: '#a78bfa', matchTags: ['psychology', 'neuroscience', 'behavior', 'decision-making', 'cognition', 'consciousness', 'free-will', 'predictive-processing', 'behavioral-economics'] },
	{ slug: 'economics', label: 'Economics', color: '#34d399', matchTags: ['economics', 'markets', 'investing', 'finance'] },
];

export function postTopic(post: PostMeta): Topic | undefined {
	for (const topic of topics) {
		if (post.tags.some((t) => topic.matchTags.includes(t))) return topic;
	}
	return undefined;
}

export function postsByTopic(topicSlug: string): PostMeta[] {
	const topic = topics.find((t) => t.slug === topicSlug);
	if (!topic) return [];
	return posts.filter((p) => p.tags.some((t) => topic.matchTags.includes(t)));
}

export async function loadPost(slug: string) {
	const path = `/src/posts/${slug}.md`;
	const mod = modules[path];
	if (!mod) throw new Error(`Post not found: ${slug}`);
	return { meta: toMeta(path, mod), Component: mod.default };
}

export function relatedPosts(current: PostMeta, count: number): PostMeta[] {
	const scored = posts
		.filter((p) => p.slug !== current.slug)
		.map((p) => ({
			post: p,
			score: p.tags.filter((t) => current.tags.includes(t)).length,
		}))
		.sort((a, b) => b.score - a.score || b.post.created.localeCompare(a.post.created));
	return scored.slice(0, count).map((s) => s.post);
}

export function readingTime(wordCount: number): string {
	return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}
