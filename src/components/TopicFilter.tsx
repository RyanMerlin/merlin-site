import { useMemo, useState } from 'react';
import { scoreItem } from '../lib/search';

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

function formatDate(iso: string): string {
	const d = new Date(iso);
	return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function readingTime(wordCount: number): string {
	return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

export default function TopicFilter({ items, topics }: { items: FilterItem[]; topics: Topic[] }) {
	const [activeTopic, setActiveTopic] = useState<string | null>(null);
	const [query, setQuery] = useState('');

	const trimmedQuery = query.trim();

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

	const activeTopicLabel = topics.find((t) => t.slug === activeTopic)?.label;

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
						type="search"
						className="search-input"
						placeholder="Search…"
						value={query}
						autoComplete="off"
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Escape') setQuery('');
						}}
					/>
				</div>
			</div>

			<p className="sr-only" role="status" aria-live="polite">
				{trimmedQuery
					? `${filtered.length} ${filtered.length === 1 ? 'post' : 'posts'} matching ${trimmedQuery}`
					: ''}
			</p>

			{filtered.length === 0 ? (
				<p style={{ color: 'var(--color-text-muted)' }} className="italic">
					{trimmedQuery
						? `No posts match “${trimmedQuery}”${activeTopicLabel ? ` in ${activeTopicLabel}` : ''}.`
						: 'No posts in this topic yet.'}
				</p>
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
											{post.title}
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
												{post.summary}
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
