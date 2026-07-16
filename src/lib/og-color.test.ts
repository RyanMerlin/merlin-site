import { describe, it, expect } from 'vitest';
import { mixHex, cardGradient } from '../pages/og/[slug].png';
import { topicColorHex, type PostMeta } from './posts';

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

describe('mixHex', () => {
	it('returns the first color unchanged at t=0', () => {
		expect(mixHex('#000000', '#ffffff', 0)).toBe('#000000');
	});

	it('returns the second color unchanged at t=1', () => {
		expect(mixHex('#000000', '#ffffff', 1)).toBe('#ffffff');
	});

	it('returns the midpoint at t=0.5', () => {
		expect(mixHex('#000000', '#ffffff', 0.5)).toBe('#808080');
	});
});

describe('cardGradient', () => {
	it('keeps the flat charcoal gradient for a post with no matching topic', () => {
		const post = makePost({ tags: ['unrelated-tag'] });
		expect(cardGradient(post)).toBe('linear-gradient(145deg, #17130f 0%, #0d0a07 100%)');
	});

	it('tints the gradient toward the topic accent for a tagged post', () => {
		const post = makePost({ tags: ['agents'] }); // -> ai topic
		const gradient = cardGradient(post);
		expect(gradient).not.toContain('#17130f');
		expect(gradient).toBe(`linear-gradient(145deg, ${mixHex('#17130f', topicColorHex.ai, 0.3)} 0%, #0d0a07 100%)`);
	});

	it('produces a different tint per topic', () => {
		const ai = cardGradient(makePost({ tags: ['agents'] }));
		const cog = cardGradient(makePost({ tags: ['consciousness'] }));
		const econ = cardGradient(makePost({ tags: ['economics'] }));
		expect(new Set([ai, cog, econ]).size).toBe(3);
	});
});
