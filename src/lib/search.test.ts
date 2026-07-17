import { describe, it, expect } from 'vitest';
import { scoreItem, type Searchable } from './search';

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
});
