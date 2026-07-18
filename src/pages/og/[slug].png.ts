import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getPosts, hasRealHero, postTopic, topicColorHex, type PostMeta } from '../../lib/posts';

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

// Brand mark embedded as a data URI so satori can draw it (satori resolves no
// external hosts). Single source: src/lib/brand/falcon-mark.png, generated from
// public/brand/merlin-falcon.svg.
const falconMark = readFileSync(resolve('src/lib/brand/falcon-mark.png'));
const falconUri = `data:image/png;base64,${falconMark.toString('base64')}`;

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

	const topic = postTopic(post);
	const topicHex = topic ? topicColorHex[topic.slug] : '#e75b2a';
	const kicker = topic ? topic.label.toUpperCase() : null;

	// Topic-coloured dark field so cards are colour-coded and legible at the
	// 128–256px thumbnail size the writing list renders them at.
	const bg = `linear-gradient(135deg, ${mixHex(topicHex, '#000000', 0.28)} 0%, #0b0906 80%)`;

	// The title is the load-bearing element at thumbnail scale, so it must be
	// large; shrink it for longer titles so it never wraps into mush.
	const len = post.title.length;
	const titleSize = len <= 20 ? 112 : len <= 30 ? 92 : len <= 42 ? 74 : len <= 56 ? 62 : 52;

	// satori takes a JSX-like POJO tree (not real React elements), which doesn't
	// structurally satisfy React's ReactNode type — cast at the boundary.
	const tree: any = {
		type: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				position: 'relative',
				overflow: 'hidden',
				width: '100%',
				height: '100%',
				background: bg,
				padding: '60px 64px',
				fontFamily: 'Geist'
			},
			children: [
				// Supporting brand mark — large enough to still read as a falcon in
				// a 128px thumbnail, offset right so the title owns the left.
				{
					type: 'img',
					props: {
						src: falconUri,
						width: 440,
						height: 436,
						style: { position: 'absolute', right: '-28px', top: '150px', opacity: 0.9 }
					}
				},
				// Header: wordmark + topic label.
				{
					type: 'div',
					props: {
						style: { display: 'flex', alignItems: 'center', gap: '14px' },
						children: [
							{
								type: 'div',
								props: {
									style: { fontSize: '26px', fontWeight: 600, letterSpacing: '0.14em', color: '#f6efe2' },
									children: 'RYAN MERLIN'
								}
							},
							...(kicker
								? [
										{ type: 'div', props: { style: { width: '2px', height: '26px', background: topicHex } } },
										{
											type: 'div',
											props: {
												style: { fontSize: '22px', fontWeight: 600, letterSpacing: '0.14em', color: topicHex },
												children: kicker
											}
										}
									]
								: [])
						]
					}
				},
				// Title — huge and high-contrast; clamped so long titles can't overflow.
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							fontSize: `${titleSize}px`,
							fontWeight: 600,
							color: '#f6efe2',
							lineHeight: 1.0,
							letterSpacing: '-0.03em',
							maxWidth: '840px',
							maxHeight: '400px',
							overflow: 'hidden'
						},
						children: post.title
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
