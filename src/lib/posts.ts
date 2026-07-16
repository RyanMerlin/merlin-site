import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE_DESCRIPTION } from './config';

// Resolve the SEO/social meta description for a post. Prefer an explicit,
// hand-tuned `description` (kept <=160 chars). Fall back to the `summary` (which
// also serves as the on-page listing excerpt), truncated at a word boundary so
// Bing never sees an over-length tag. Never emits an empty string.
export function metaDescription(data: { description?: string; summary?: string }): string {
	if (data.description) return data.description;
	const s = data.summary;
	if (!s) return SITE_DESCRIPTION;
	if (s.length <= 160) return s;
	const cut = s.slice(0, 157);
	const lastSpace = cut.lastIndexOf(' ');
	return (lastSpace > 100 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…';
}

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
	description: string;
	matchTags: string[];
};

export const topics: Topic[] = [
	{ slug: 'ai', label: 'AI & Agents', color: 'var(--topic-ai)', description: 'Building production AI agents and the infrastructure around them: control planes, agent protocols, secrets, and the orchestration the model never solves.', matchTags: ['ai', 'agents', 'ai-agents', 'llm', 'edgeplane', 'mcp', 'acp', 'a2a', 'infrastructure', 'architecture', 'dora', 'productivity', 'devops'] },
	{ slug: 'cognitive-science', label: 'Cognitive Science', color: 'var(--topic-cog)', description: 'Where cognitive science meets AI: consciousness, working memory, and decision-making, and what human minds reveal about building better artificial agents.', matchTags: ['psychology', 'neuroscience', 'behavior', 'decision-making', 'cognition', 'cognitive-science', 'consciousness', 'access-consciousness', 'global-workspace', 'working-memory', 'free-will', 'predictive-processing', 'behavioral-economics'] },
	{ slug: 'economics', label: 'Economics', color: 'var(--topic-econ)', description: 'Notes on economics, markets, and investing: incentives, coordination, and how value actually moves through systems.', matchTags: ['economics', 'markets', 'investing', 'finance'] }
];

// Literal hex mirror of the dark-theme --topic-* custom properties in global.css.
// Satori (the OG-card renderer) runs server-side with no CSS cascade, so it can't
// resolve CSS variables — this is the single source of truth for build-time image
// generation. The live browser badge/tab colors keep reading the CSS vars directly.
export const topicColorHex: Record<string, string> = {
	ai: '#6a8fd4',
	'cognitive-science': '#bb96cb',
	economics: '#d4a24e'
};

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
	// A post's badge is its dominant topic: the one whose matchTags it hits most.
	// Ties resolve to the earlier topic in `topics` order (AI → cognitive-science → economics).
	let best: Topic | undefined;
	let bestCount = 0;
	for (const topic of topics) {
		const count = post.tags.filter((t) => topic.matchTags.includes(t)).length;
		if (count > bestCount) {
			bestCount = count;
			best = topic;
		}
	}
	return best;
}

export function postsByTopic(posts: PostMeta[], topicSlug: string): PostMeta[] {
	// Filter by dominant topic so a post appears under exactly the topic it's badged as.
	return posts.filter((p) => postTopic(p)?.slug === topicSlug);
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

// Every post gets an image at this URL — real colocated hero art if present,
// otherwise the satori-generated title card. Centralized so both list surfaces
// (and anything else that wants a thumbnail later) resolve it the same way.
export function postThumbnail(post: PostMeta): { src: string; alt: string } {
	return { src: `/og/${post.slug}.png`, alt: post.title };
}
