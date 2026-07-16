import { describe, it, expect } from 'vitest';
import { metaDescription, postTopic, relatedPosts, readingTime, postThumbnail, topics, type PostMeta } from './posts';
import { SITE_DESCRIPTION } from './config';

function makePost(overrides: Partial<PostMeta> = {}): PostMeta {
	return {
		slug: 'test-post',
		title: 'Test Post',
		created: '2026-01-01',
		tags: [],
		wordCount: 500,
		...overrides
	};
}

describe('metaDescription', () => {
	it('prefers an explicit description over summary', () => {
		expect(metaDescription({ description: 'Explicit.', summary: 'Summary.' })).toBe('Explicit.');
	});

	it('falls back to summary when no description is set', () => {
		expect(metaDescription({ summary: 'A short summary.' })).toBe('A short summary.');
	});

	it('falls back to SITE_DESCRIPTION when neither is set', () => {
		expect(metaDescription({})).toBe(SITE_DESCRIPTION);
	});

	it('returns a summary unmodified at exactly 160 chars', () => {
		const s = 'a'.repeat(160);
		expect(metaDescription({ summary: s })).toBe(s);
	});

	it('truncates a long summary at a word boundary with an ellipsis', () => {
		const s = 'word '.repeat(40).trim(); // 199 chars, spaces every 5 chars
		const result = metaDescription({ summary: s });
		expect(result.length).toBeLessThanOrEqual(160);
		expect(result.endsWith('…')).toBe(true);
		expect(result.slice(0, -1).trimEnd()).toBe(result.slice(0, -1));
	});

	it('hard-cuts at 157 chars when no word boundary exists past char 100', () => {
		const s = 'x'.repeat(200); // one giant word, no spaces
		expect(metaDescription({ summary: s })).toBe('x'.repeat(157) + '…');
	});
});

describe('postTopic', () => {
	it('returns undefined when no tags match any topic', () => {
		expect(postTopic(makePost({ tags: ['unrelated-tag'] }))).toBeUndefined();
	});

	it('picks the topic with the most matching tags, not just the first match', () => {
		// 'economics' + 'markets' match the economics topic (2); 'agents' matches ai (1).
		const post = makePost({ tags: ['economics', 'markets', 'agents'] });
		expect(postTopic(post)?.slug).toBe('economics');
	});

	it('breaks ties by topic declaration order (ai, then cognitive-science, then economics)', () => {
		// 'agents' -> ai (1 match), 'consciousness' -> cognitive-science (1 match)
		const post = makePost({ tags: ['agents', 'consciousness'] });
		expect(postTopic(post)?.slug).toBe('ai');
	});
});

describe('topics', () => {
	it('is declared in the order the tie-break above depends on', () => {
		expect(topics.map((t) => t.slug)).toEqual(['ai', 'cognitive-science', 'economics']);
	});
});

describe('relatedPosts', () => {
	const current = makePost({ slug: 'current', tags: ['agents', 'mcp'], created: '2026-05-01' });
	const sameTagsOlder = makePost({ slug: 'a', tags: ['agents', 'mcp'], created: '2026-01-01' });
	const sameTagsNewer = makePost({ slug: 'b', tags: ['agents', 'mcp'], created: '2026-06-01' });
	const oneTag = makePost({ slug: 'c', tags: ['agents'], created: '2026-07-01' });
	const noTags = makePost({ slug: 'd', tags: [], created: '2026-08-01' });
	const all = [current, sameTagsOlder, sameTagsNewer, oneTag, noTags];

	it('excludes the current post from the results', () => {
		const result = relatedPosts(all, current, 10);
		expect(result.find((p) => p.slug === 'current')).toBeUndefined();
	});

	it('ranks by shared-tag count, ties broken by more recent date', () => {
		const result = relatedPosts(all, current, 10);
		expect(result.map((p) => p.slug)).toEqual(['b', 'a', 'c', 'd']);
	});

	it('respects the count limit', () => {
		const result = relatedPosts(all, current, 2);
		expect(result.map((p) => p.slug)).toEqual(['b', 'a']);
	});
});

describe('readingTime', () => {
	it('rounds up and floors at 1 minute', () => {
		expect(readingTime(0)).toBe('1 min read');
		expect(readingTime(1)).toBe('1 min read');
		expect(readingTime(200)).toBe('1 min read');
		expect(readingTime(201)).toBe('2 min read');
	});
});

describe('postThumbnail', () => {
	it('derives the OG image URL from the slug', () => {
		expect(postThumbnail(makePost({ slug: 'my-post', title: 'My Post' }))).toEqual({
			src: '/og/my-post.png',
			alt: 'My Post'
		});
	});
});
