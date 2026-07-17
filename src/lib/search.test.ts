import { describe, it, expect } from 'vitest';
import { scoreItem, highlightSegments, matchedTags, type Searchable } from './search';

function make(overrides: Partial<Searchable> = {}): Searchable {
	return { title: 'Test Post', summary: 'A summary.', tags: [], ...overrides };
}

describe('scoreItem', () => {
	it('scores 0 for an empty or whitespace-only query', () => {
		expect(scoreItem(make(), '')).toBe(0);
		expect(scoreItem(make(), '   ')).toBe(0);
	});

	it('scores 0 when nothing matches', () => {
		expect(scoreItem(make({ title: 'Agents' }), 'economics')).toBe(0);
	});

	it('weights a title hit above a tag hit above a summary hit', () => {
		const title = scoreItem(make({ title: 'agents', summary: '', tags: [] }), 'agents');
		const tag = scoreItem(make({ title: '', summary: '', tags: ['agents'] }), 'agents');
		const summary = scoreItem(make({ title: '', summary: 'agents', tags: [] }), 'agents');
		expect(title).toBeGreaterThan(tag);
		expect(tag).toBeGreaterThan(summary);
		expect(summary).toBeGreaterThan(0);
	});

	it('sums the weights of every field a term hits', () => {
		const titleOnly = scoreItem(make({ title: 'agents', summary: '', tags: [] }), 'agents');
		const both = scoreItem(make({ title: 'agents', summary: 'agents', tags: [] }), 'agents');
		expect(both).toBeGreaterThan(titleOnly);
	});

	it('is case-insensitive', () => {
		expect(scoreItem(make({ title: 'Building Agents' }), 'AGENTS')).toBeGreaterThan(0);
	});

	it('matches on a partial word so search feels live while typing', () => {
		expect(scoreItem(make({ title: 'Building Agents' }), 'age')).toBeGreaterThan(0);
	});

	it('requires every term to match somewhere (AND, not OR)', () => {
		const item = make({ title: 'Building Agents', summary: 'On infrastructure.', tags: [] });
		expect(scoreItem(item, 'agents infrastructure')).toBeGreaterThan(0);
		expect(scoreItem(item, 'agents economics')).toBe(0);
	});

	it('ranks a title hit over a summary hit for the same query', () => {
		const inTitle = make({ title: 'Agents', summary: 'Unrelated.' });
		const inSummary = make({ title: 'Unrelated', summary: 'Agents.' });
		expect(scoreItem(inTitle, 'agents')).toBeGreaterThan(scoreItem(inSummary, 'agents'));
	});

	it('tolerates a missing summary', () => {
		expect(scoreItem({ title: 'Agents', tags: [] }, 'agents')).toBeGreaterThan(0);
	});

	// A repeated term is one constraint, not two — otherwise "agent agent" outranks
	// "agent" for no reason a reader could explain.
	it('does not let a duplicated term inflate the score', () => {
		const item = make({ title: 'Agents' });
		expect(scoreItem(item, 'agent agent')).toBe(scoreItem(item, 'agent'));
	});
});

describe('highlightSegments', () => {
	it('returns one unhit segment when the query is empty', () => {
		expect(highlightSegments('Building Agents', '')).toEqual([{ text: 'Building Agents', hit: false }]);
	});

	it('returns an empty list for empty text', () => {
		expect(highlightSegments('', 'agents')).toEqual([]);
	});

	it('returns one unhit segment when nothing matches', () => {
		expect(highlightSegments('Building Agents', 'economics')).toEqual([
			{ text: 'Building Agents', hit: false }
		]);
	});

	it('splits a mid-string match into three segments', () => {
		expect(highlightSegments('Building Agents Now', 'agents')).toEqual([
			{ text: 'Building ', hit: false },
			{ text: 'Agents', hit: true },
			{ text: ' Now', hit: false }
		]);
	});

	it('preserves the original casing of a hit', () => {
		const segs = highlightSegments('Building AGENTS', 'agents');
		expect(segs.find((s) => s.hit)?.text).toBe('AGENTS');
	});

	it('marks a hit at the very start with no leading empty segment', () => {
		expect(highlightSegments('Agents rule', 'agents')).toEqual([
			{ text: 'Agents', hit: true },
			{ text: ' rule', hit: false }
		]);
	});

	it('marks a hit at the very end with no trailing empty segment', () => {
		expect(highlightSegments('We love agents', 'agents')).toEqual([
			{ text: 'We love ', hit: false },
			{ text: 'agents', hit: true }
		]);
	});

	it('marks every occurrence of a term', () => {
		const segs = highlightSegments('agents and agents', 'agents');
		expect(segs.filter((s) => s.hit).length).toBe(2);
	});

	it('highlights each of several terms', () => {
		const segs = highlightSegments('agents and infra', 'agents infra');
		expect(segs.filter((s) => s.hit).map((s) => s.text)).toEqual(['agents', 'infra']);
	});

	it('merges overlapping term matches into one segment', () => {
		// 'age' and 'gent' overlap inside 'agent' — must not double-wrap.
		const segs = highlightSegments('agent', 'age gent');
		expect(segs).toEqual([{ text: 'agent', hit: true }]);
	});

	it('rejoins to exactly the original text', () => {
		const text = 'Building Agents on infrastructure';
		expect(
			highlightSegments(text, 'agents infra')
				.map((s) => s.text)
				.join('')
		).toBe(text);
	});

	it('treats regex metacharacters as literal text', () => {
		expect(highlightSegments('cost is $5 (net)', '(net)')).toEqual([
			{ text: 'cost is $5 ', hit: false },
			{ text: '(net)', hit: true }
		]);
	});

	// 'İ'.toLowerCase() is two code units, so indexing a lowercased copy and
	// slicing the original drifts by one and emits an empty <mark>. Offsets must
	// come from the original string.
	it('keeps offsets correct when lowercasing changes length', () => {
		expect(highlightSegments('İx', 'x')).toEqual([
			{ text: 'İ', hit: false },
			{ text: 'x', hit: true }
		]);
	});

	it('never emits an empty segment', () => {
		for (const [text, query] of [
			['İx', 'x'],
			['ẞtraße', 'traße'],
			['agent', 'age gent'],
			['aaa', 'aa']
		]) {
			for (const seg of highlightSegments(text, query)) {
				expect(seg.text.length).toBeGreaterThan(0);
			}
		}
	});

	// Occurrences at 0 and 1 overlap and merge, so the whole run marks.
	it('still marks overlapping occurrences of one term', () => {
		expect(highlightSegments('aaa', 'aa')).toEqual([{ text: 'aaa', hit: true }]);
	});

	it('stays fast on a pathological repeated-term query', () => {
		const t0 = performance.now();
		highlightSegments('a'.repeat(1000), Array(1000).fill('a').join(' '));
		expect(performance.now() - t0).toBeLessThan(50);
	});
});

describe('matchedTags', () => {
	it('returns only the tags a term hits', () => {
		expect(matchedTags(['ai', 'agents', 'economics'], 'agent')).toEqual(['agents']);
	});

	it('returns an empty list for an empty query', () => {
		expect(matchedTags(['ai'], '')).toEqual([]);
	});

	it('returns an empty list when no tag matches', () => {
		expect(matchedTags(['ai'], 'economics')).toEqual([]);
	});

	it('is case-insensitive but returns the original tag casing', () => {
		expect(matchedTags(['Agents'], 'AGENT')).toEqual(['Agents']);
	});

	it('does not duplicate a tag hit by two terms', () => {
		expect(matchedTags(['agents'], 'age agent')).toEqual(['agents']);
	});
});
