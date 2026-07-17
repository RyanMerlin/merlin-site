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
/**
 * The distinct terms in `query`, lowercased. De-duplicated because a repeated
 * term is one constraint, not two: without this, "agent agent" both outscores
 * "agent" and makes the highlighter do the same scan twice.
 */
function queryTerms(query: string): string[] {
	return [...new Set(query.toLowerCase().split(/\s+/).filter(Boolean))];
}

function escapeRegExp(literal: string): string {
	return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function scoreItem(item: Searchable, query: string): number {
	const terms = queryTerms(query);
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

export type Segment = { text: string; hit: boolean };

/**
 * Split `text` into consecutive matched/unmatched runs for `query`, so a result
 * can show *why* it matched. Segments rejoin to exactly the original text, and
 * hits keep their original casing.
 *
 * Terms are matched with a case-insensitive RegExp over the *original* string,
 * so offsets always index the text being sliced. Searching a lowercased copy
 * instead would drift wherever lowercasing changes length ('İ'.toLowerCase() is
 * two code units), which produced an empty <mark>. Terms are escaped, so a query
 * of pure metacharacters is literal text and can never throw.
 */
export function highlightSegments(text: string, query: string): Segment[] {
	if (!text) return [];
	const terms = queryTerms(query);
	if (terms.length === 0) return [{ text, hit: false }];

	const ranges: Array<[number, number]> = [];
	for (const term of terms) {
		const re = new RegExp(escapeRegExp(term), 'gi');
		let m: RegExpExecArray | null;
		while ((m = re.exec(text)) !== null) {
			ranges.push([m.index, m.index + m[0].length]);
			re.lastIndex = m.index + 1; // +1 so overlapping hits still count
		}
	}
	if (ranges.length === 0) return [{ text, hit: false }];

	// Terms can overlap ('age' and 'gent' inside 'agent'). Merge before slicing so
	// a character is never wrapped twice.
	ranges.sort((a, b) => a[0] - b[0]);
	const merged: Array<[number, number]> = [ranges[0]];
	for (const [start, end] of ranges.slice(1)) {
		const last = merged[merged.length - 1];
		if (start <= last[1]) last[1] = Math.max(last[1], end);
		else merged.push([start, end]);
	}

	const segments: Segment[] = [];
	let cursor = 0;
	for (const [start, end] of merged) {
		if (start > cursor) segments.push({ text: text.slice(cursor, start), hit: false });
		segments.push({ text: text.slice(start, end), hit: true });
		cursor = end;
	}
	if (cursor < text.length) segments.push({ text: text.slice(cursor), hit: false });
	return segments;
}

/**
 * The tags `query` hits, in their original casing. Tags are searchable but not
 * otherwise rendered in the listing, so a tag-only match would look like a
 * result with nothing in it matching. Callers surface these to close that gap.
 */
export function matchedTags(tags: string[], query: string): string[] {
	const terms = queryTerms(query);
	if (terms.length === 0) return [];
	return tags.filter((tag) => {
		const t = tag.toLowerCase();
		return terms.some((term) => t.includes(term));
	});
}
