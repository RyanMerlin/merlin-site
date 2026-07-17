// Client-side post search. Deliberately dependency-free and free of any `node:`
// imports so it can bundle into the TopicFilter island (posts.ts cannot — it
// reaches for node:fs to resolve hero art).
//
// Scope: title, tags, and summary. Post bodies are not searched; indexing 300KB
// of markdown for 20 posts would cost more payload than it buys. If body search
// is ever wanted, that's a post-build index (Pagefind), not a bigger version of
// this file.

export type Searchable = {
	title: string;
	summary?: string;
	tags: string[];
};

// Relative weights, not absolute scores: only their ordering is meaningful.
// A title hit outranks a tag hit outranks a summary hit, so a query for a word
// in a headline sorts above a post that merely mentions it in passing.
const WEIGHT_TITLE = 3;
const WEIGHT_TAG = 2;
const WEIGHT_SUMMARY = 1;

/**
 * Rank `item` against `query`. Returns 0 for "no match" — callers filter on > 0.
 *
 * Terms are AND-ed: every whitespace-separated term must hit some field, so
 * adding a word always narrows the result set rather than widening it. Matching
 * is substring, not word-boundary, so results narrow on every keystroke.
 */
export function scoreItem(item: Searchable, query: string): number {
	const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
	if (terms.length === 0) return 0;

	const title = item.title.toLowerCase();
	const summary = (item.summary ?? '').toLowerCase();
	const tags = item.tags.map((t) => t.toLowerCase());

	let score = 0;
	for (const term of terms) {
		let termScore = 0;
		if (title.includes(term)) termScore += WEIGHT_TITLE;
		if (tags.some((t) => t.includes(term))) termScore += WEIGHT_TAG;
		if (summary.includes(term)) termScore += WEIGHT_SUMMARY;
		if (termScore === 0) return 0; // AND: one miss disqualifies the item
		score += termScore;
	}
	return score;
}
