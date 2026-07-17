import { useEffect, useMemo, useRef, useState } from 'react';
import { scoreItem, highlightSegments, matchedTags } from '../lib/search';
import { formatDate, readingTime } from '../lib/format';

type Topic = { slug: string; label: string; color: string; matchTags: string[] };

export type FilterItem = {
	slug: string;
	title: string;
	created: string;
	summary?: string;
	tags: string[];
	wordCount: number;
	topicSlug: string | null;
	topicLabel: string | null;
	topicColor: string | null;
	thumbnailSrc: string;
};

// Render `text` with the query's hits wrapped, so a result shows why it matched.
function Highlighted({ text, query }: { text: string; query: string }) {
	if (!query) return <>{text}</>;
	return (
		<>
			{highlightSegments(text, query).map((seg, i) =>
				seg.hit ? (
					<mark key={i} className="search-hit">
						{seg.text}
					</mark>
				) : (
					<span key={i}>{seg.text}</span>
				)
			)}
		</>
	);
}

export default function TopicFilter({ items, topics }: { items: FilterItem[]; topics: Topic[] }) {
	const [activeTopic, setActiveTopic] = useState<string | null>(null);
	const [query, setQuery] = useState('');
	const [searchFocused, setSearchFocused] = useState(false);
	const [announcement, setAnnouncement] = useState('');
	const searchRef = useRef<HTMLInputElement>(null);

	const trimmedQuery = query.trim();

	// "/" focuses search, the convention every code-hosting and docs site trained
	// this audience on. Ignored while typing somewhere else, so it never swallows a
	// literal slash.
	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
			const el = e.target as HTMLElement | null;
			if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
			e.preventDefault();
			searchRef.current?.focus();
		}
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, []);

	// Topic and search compose: the tabs scope the corpus, the query ranks within
	// it. `items` arrives date-descending, which stays the order until a query
	// gives us something better to sort on.
	const filtered = useMemo(() => {
		const inTopic = activeTopic ? items.filter((p) => p.topicSlug === activeTopic) : items;
		if (!trimmedQuery) return inTopic;
		return inTopic
			.map((post) => ({ post, score: scoreItem(post, trimmedQuery) }))
			.filter(({ score }) => score > 0)
			.sort((a, b) => b.score - a.score || b.post.created.localeCompare(a.post.created))
			.map(({ post }) => post);
	}, [items, activeTopic, trimmedQuery]);

	// The live region must not narrate every keystroke: typing "infrastructure"
	// would queue "1 post…", "3 posts…", once per letter, and a screen reader reads
	// the backlog. Announce the result count only once typing settles, and don't
	// echo the query back — the reader just typed it.
	useEffect(() => {
		if (!trimmedQuery) {
			setAnnouncement('');
			return;
		}
		const id = setTimeout(() => {
			setAnnouncement(`${filtered.length} ${filtered.length === 1 ? 'post' : 'posts'} found`);
		}, 500);
		return () => clearTimeout(id);
	}, [trimmedQuery, filtered.length]);

	const activeTopicLabel = topics.find((t) => t.slug === activeTopic)?.label;

	// A query with hits elsewhere but none in the active topic is a dead end, and
	// the reader can't see the way out. Every post is already in memory, so count
	// the wider corpus and offer to widen to it. Only computed when we're actually
	// looking at an empty result set.
	const matchesOutsideTopic = useMemo(() => {
		if (!trimmedQuery || !activeTopic || filtered.length > 0) return 0;
		return items.filter((p) => scoreItem(p, trimmedQuery) > 0).length;
	}, [items, activeTopic, trimmedQuery, filtered.length]);

	return (
		<>
			<div className="mb-8 flex flex-wrap items-center gap-x-0 gap-y-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
				<button
					className={`tab${activeTopic === null ? ' active' : ''}`}
					onClick={() => setActiveTopic(null)}
				>
					All writing
				</button>
				{topics.map((topic) => (
					<button
						key={topic.slug}
						className={`tab${activeTopic === topic.slug ? ' active' : ''}`}
						style={{ ['--topic-color' as string]: topic.color } as React.CSSProperties}
						onClick={() => setActiveTopic(activeTopic === topic.slug ? null : topic.slug)}
					>
						{topic.label}
					</button>
				))}

				<div className="search-field ml-auto">
					<label className="sr-only" htmlFor="post-search">
						Search posts
					</label>
					<input
						id="post-search"
						ref={searchRef}
						type="search"
						className="search-input"
						placeholder="Search…"
						value={query}
						autoComplete="off"
						// Longer than any real query, and it bounds the highlighter's
						// worst case rather than trusting a pasted wall of text.
						maxLength={64}
						onChange={(e) => setQuery(e.target.value)}
						onFocus={() => setSearchFocused(true)}
						onBlur={() => setSearchFocused(false)}
						onKeyDown={(e) => {
							if (e.key === 'Escape') setQuery('');
						}}
					/>
					{/* A shortcut nobody can see is a shortcut nobody uses. The hint gets
					    out of the way as soon as the field is in use. */}
					{!searchFocused && !query && (
						<kbd className="search-kbd" aria-hidden="true">
							/
						</kbd>
					)}
				</div>
			</div>

			<p className="sr-only" role="status" aria-live="polite">
				{announcement}
			</p>

			{filtered.length === 0 ? (
				<div>
					<p style={{ color: 'var(--color-text-muted)' }} className="italic">
						{trimmedQuery
							? `No posts match “${trimmedQuery}”${activeTopicLabel ? ` in ${activeTopicLabel}` : ''}.`
							: 'No posts in this topic yet.'}
					</p>
					{matchesOutsideTopic > 0 && (
						<button className="search-widen" onClick={() => setActiveTopic(null)}>
							{matchesOutsideTopic === 1
								? 'Show the 1 match in all writing'
								: `Show all ${matchesOutsideTopic} matches in all writing`}
						</button>
					)}
				</div>
			) : (
				<ul className="space-y-10">
					{filtered.map((post) => (
						<li key={post.slug}>
							<article>
								<a href={`/posts/${post.slug}`} className="group flex gap-4 sm:gap-5">
									<img
										src={post.thumbnailSrc}
										alt=""
										width={256}
										height={135}
										loading="lazy"
										decoding="async"
										className="w-32 h-[67px] sm:w-64 sm:h-[135px] shrink-0 rounded-md border object-cover object-top"
										style={{ borderColor: 'var(--color-border)' }}
									/>
									<div className="min-w-0 flex-1">
										<h2
											className="text-lg font-medium transition-colors line-clamp-1"
											style={{ color: 'var(--color-text)' }}
										>
											<Highlighted text={post.title} query={trimmedQuery} />
										</h2>
										<div
											className="mt-1.5 flex items-center gap-2.5 text-xs"
											style={{ color: 'var(--color-text-muted)' }}
										>
											<time dateTime={post.created}>{formatDate(post.created)}</time>
											{post.topicLabel && (
												<>
													<span>·</span>
													<span
														className="topic-badge"
														style={{ ['--badge-color' as string]: post.topicColor } as React.CSSProperties}
													>
														{post.topicLabel}
													</span>
												</>
											)}
											<span>·</span>
											<span>{readingTime(post.wordCount)}</span>
										</div>
										{post.summary && (
											<p
												className="mt-2 text-sm leading-relaxed line-clamp-3"
												style={{ color: 'var(--color-text-muted)' }}
											>
												<Highlighted text={post.summary} query={trimmedQuery} />
											</p>
										)}

										{/* Tags are searchable but never otherwise rendered, so a tag-only
										    hit would show a result with nothing in it matching the query.
										    Surfacing the tag that matched is what makes the ranking legible. */}
										{trimmedQuery && matchedTags(post.tags, trimmedQuery).length > 0 && (
											<p className="mt-2 flex flex-wrap items-center gap-1.5">
												{matchedTags(post.tags, trimmedQuery).map((tag) => (
													<span key={tag} className="tag-hit">
														<Highlighted text={tag} query={trimmedQuery} />
													</span>
												))}
											</p>
										)}
									</div>
								</a>
							</article>
						</li>
					))}
				</ul>
			)}

			{activeTopic && (
				<p className="mt-8 text-xs" style={{ color: 'var(--color-text-muted)' }}>
					📡{' '}
					<a href={`/topics/${activeTopic}/feed.xml`} style={{ color: 'var(--color-accent)' }}>
						RSS feed for this topic
					</a>
				</p>
			)}
		</>
	);
}
