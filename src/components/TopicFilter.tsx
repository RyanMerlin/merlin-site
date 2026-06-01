import { useState } from 'react';

type Topic = { slug: string; label: string; color: string; matchTags: string[] };

export type FilterItem = {
	slug: string;
	title: string;
	created: string;
	summary?: string;
	wordCount: number;
	topicSlug: string | null;
	topicLabel: string | null;
	topicColor: string | null;
};

function formatDate(iso: string): string {
	const d = new Date(iso);
	return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function readingTime(wordCount: number): string {
	return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

export default function TopicFilter({ items, topics }: { items: FilterItem[]; topics: Topic[] }) {
	const [activeTopic, setActiveTopic] = useState<string | null>(null);

	const filtered = activeTopic ? items.filter((p) => p.topicSlug === activeTopic) : items;

	return (
		<>
			<div className="mb-8 flex gap-0 border-b" style={{ borderColor: 'var(--color-border)' }}>
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
			</div>

			{filtered.length === 0 ? (
				<p style={{ color: 'var(--color-text-muted)' }} className="italic">
					No posts in this topic yet.
				</p>
			) : (
				<ul className="space-y-10">
					{filtered.map((post) => (
						<li key={post.slug}>
							<article>
								<a href={`/posts/${post.slug}`} className="group block">
									{post.topicLabel && (
										<span
											className="topic-badge"
											style={{ ['--badge-color' as string]: post.topicColor } as React.CSSProperties}
										>
											{post.topicLabel}
										</span>
									)}
									<h2
										className="text-lg font-medium transition-colors"
										style={{ color: 'var(--color-text)' }}
									>
										{post.title}
									</h2>
									<div
										className="mt-1.5 flex items-center gap-2.5 text-xs"
										style={{ color: 'var(--color-text-muted)' }}
									>
										<time dateTime={post.created}>{formatDate(post.created)}</time>
										<span>·</span>
										<span>{readingTime(post.wordCount)}</span>
									</div>
									{post.summary && (
										<p
											className="mt-2 text-sm leading-relaxed"
											style={{ color: 'var(--color-text-muted)' }}
										>
											{post.summary}
										</p>
									)}
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
