// Presentation helpers shared by the Astro pages and the client island.
//
// These live here rather than in posts.ts because posts.ts imports node:fs to
// resolve hero art, which makes it unimportable from a `client:*` component.
// Anything a React island needs must stay free of `node:` imports — see also
// lib/search.ts.

/**
 * Format a post's `created` date.
 *
 * `short` ("Jul 9, 2026") is the listing style — home, topics. `long`
 * ("July 9, 2026") is the article style — post and draft pages. The two styles
 * predate this module and are deliberate; keep them distinct.
 *
 * Dates in frontmatter are bare YYYY-MM-DD, which Date parses as UTC midnight,
 * so formatting is pinned to UTC. Without that, any reader behind UTC renders
 * the previous day.
 */
export function formatDate(iso: string, month: 'short' | 'long' = 'short'): string {
	const d = new Date(iso);
	return d.toLocaleDateString('en-US', { year: 'numeric', month, day: 'numeric', timeZone: 'UTC' });
}

/** Reading time at a 200 wpm assumption, floored at one minute. */
export function readingTime(wordCount: number): string {
	return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}
