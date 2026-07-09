import { getCollection, type CollectionEntry } from 'astro:content';

export type PostMeta = {
	slug: string;
	title: string;
	created: string;
	tags: string[];
	summary?: string;
	wordCount: number;
};

export type Topic = {
	slug: string;
	label: string;
	color: string;
	matchTags: string[];
};

export const topics: Topic[] = [
	{ slug: 'ai', label: 'AI & Agents', color: 'var(--topic-ai)', matchTags: ['ai', 'agents', 'edgeplane', 'mcp', 'acp', 'a2a', 'infrastructure', 'architecture', 'dora', 'productivity', 'devops'] },
	{ slug: 'cognitive-science', label: 'Cognitive Science', color: 'var(--topic-cog)', matchTags: ['psychology', 'neuroscience', 'behavior', 'decision-making', 'cognition', 'consciousness', 'free-will', 'predictive-processing', 'behavioral-economics'] },
	{ slug: 'economics', label: 'Economics', color: 'var(--topic-econ)', matchTags: ['economics', 'markets', 'investing', 'finance'] }
];

function countWords(body: string): number {
	const stripped = body.replace(/^---[\s\S]*?---/, '');
	return stripped.trim().split(/\s+/).filter(Boolean).length;
}

function toMeta(entry: CollectionEntry<'posts'>): PostMeta {
	return {
		slug: entry.id,
		title: entry.data.title,
		created: entry.data.created,
		tags: entry.data.tags ?? [],
		summary: entry.data.summary,
		wordCount: countWords(entry.body ?? '')
	};
}

export async function getPosts(): Promise<PostMeta[]> {
	const entries = await getCollection('posts', (e) => !e.data.status || e.data.status === 'published');
	return entries.map(toMeta).sort((a, b) => b.created.localeCompare(a.created));
}

export function postTopic(post: PostMeta): Topic | undefined {
	for (const topic of topics) {
		if (post.tags.some((t) => topic.matchTags.includes(t))) return topic;
	}
	return undefined;
}

export function postsByTopic(posts: PostMeta[], topicSlug: string): PostMeta[] {
	const topic = topics.find((t) => t.slug === topicSlug);
	if (!topic) return [];
	return posts.filter((p) => p.tags.some((t) => topic.matchTags.includes(t)));
}

export function relatedPosts(posts: PostMeta[], current: PostMeta, count: number): PostMeta[] {
	const scored = posts
		.filter((p) => p.slug !== current.slug)
		.map((p) => ({
			post: p,
			score: p.tags.filter((t) => current.tags.includes(t)).length
		}))
		.sort((a, b) => b.score - a.score || b.post.created.localeCompare(a.post.created));
	return scored.slice(0, count).map((s) => s.post);
}

export function readingTime(wordCount: number): string {
	return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}
