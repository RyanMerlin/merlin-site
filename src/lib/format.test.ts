import { describe, it, expect } from 'vitest';
import { formatDate, readingTime } from './format';

describe('formatDate', () => {
	it('defaults to the short listing style', () => {
		expect(formatDate('2026-07-09')).toBe('Jul 9, 2026');
	});

	it('renders the long style for post pages', () => {
		expect(formatDate('2026-07-09', 'long')).toBe('July 9, 2026');
	});

	// The date is a bare YYYY-MM-DD, which Date parses as UTC midnight. Formatting
	// in a timezone behind UTC would roll it back a day — pinned because the bug
	// only ever shows up for readers west of Greenwich.
	it('does not shift the day across timezones', () => {
		expect(formatDate('2026-01-01')).toBe('Jan 1, 2026');
		expect(formatDate('2026-12-31', 'long')).toBe('December 31, 2026');
	});
});

describe('readingTime', () => {
	it('floors at 1 minute for an empty or tiny post', () => {
		expect(readingTime(0)).toBe('1 min read');
		expect(readingTime(1)).toBe('1 min read');
	});

	it('rounds up to the next whole minute', () => {
		expect(readingTime(200)).toBe('1 min read');
		expect(readingTime(201)).toBe('2 min read');
	});
});
