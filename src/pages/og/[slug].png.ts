import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getPosts, hasRealHero, postTopic, topicColorHex, type PostMeta } from '../../lib/posts';
import { SITE_AUTHOR } from '../../lib/config';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// Only posts WITHOUT real hero art get a route here — the ones with real art
// are served by [slug].jpg.ts instead (see hasRealHero() in lib/posts.ts,
// the single source of truth postThumbnail() also reads).
export async function getStaticPaths() {
	const posts = await getPosts();
	return posts.filter((post) => !hasRealHero(post.slug)).map((post) => ({ params: { slug: post.slug }, props: { post } }));
}

const fontRegular = readFileSync(resolve('src/lib/fonts/Geist-Regular.ttf'));
const fontBold = readFileSync(resolve('src/lib/fonts/Geist-SemiBold.ttf'));

function readingTime(wordCount: number): string {
	return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

const GRADIENT_BASE = '#17130f';
const GRADIENT_END = '#0d0a07';

export function mixHex(a: string, b: string, t: number): string {
	const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
	const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
	const mixed = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
	return '#' + mixed.map((v) => v.toString(16).padStart(2, '0')).join('');
}

// Tagged posts get a gradient tinted toward their topic accent; untagged posts
// keep the original flat charcoal gradient unchanged.
export function cardGradient(post: PostMeta): string {
	const topic = postTopic(post);
	const hex = topic ? topicColorHex[topic.slug] : undefined;
	const start = hex ? mixHex(GRADIENT_BASE, hex, 0.55) : GRADIENT_BASE;
	return `linear-gradient(145deg, ${start} 0%, ${GRADIENT_END} 100%)`;
}

export const GET: APIRoute = async ({ props }) => {
	const post = props.post as PostMeta;

	const date = new Date(post.created).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});

	// satori takes a JSX-like POJO tree (not real React elements), which doesn't
	// structurally satisfy React's ReactNode type — cast at the boundary.
	const tree: any = {
		type: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				width: '100%',
				height: '100%',
				background: cardGradient(post),
				padding: '60px 64px',
				fontFamily: 'Geist'
			},
			children: [
				{
					type: 'div',
					props: {
						style: { display: 'flex', flexDirection: 'column', gap: '16px' },
						children: [
							{
								type: 'div',
								props: {
									style: {
										fontSize: '44px',
										fontWeight: 600,
										color: '#f6efe2',
										lineHeight: 1.2,
										letterSpacing: '-0.02em'
									},
									children: post.title
								}
							},
							...(post.summary
								? [
										{
											type: 'div',
											props: {
												style: {
													fontSize: '22px',
													color: '#a99c8a',
													lineHeight: 1.4,
													maxHeight: '90px',
													overflow: 'hidden'
												},
												children: post.summary
											}
										}
									]
								: [])
						]
					}
				},
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-end'
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										gap: '16px',
										fontSize: '18px',
										color: '#7c7160'
									},
									children: [
										{ type: 'span', props: { children: date } },
										{ type: 'span', props: { children: '·' } },
										{ type: 'span', props: { children: readingTime(post.wordCount) } }
									]
								}
							},
							{
								type: 'div',
								props: {
									style: {
										fontSize: '20px',
										fontWeight: 500,
										color: '#e75b2a'
									},
									children: SITE_AUTHOR
								}
							}
						]
					}
				}
			]
		}
	};

	const svg = await satori(tree, {
		width: OG_WIDTH,
		height: OG_HEIGHT,
		fonts: [
			{ name: 'Geist', data: fontRegular, weight: 400, style: 'normal' },
			{ name: 'Geist', data: fontBold, weight: 600, style: 'normal' }
		]
	});

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
	const png = resvg.render().asPng();

	return new Response(new Uint8Array(png), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
