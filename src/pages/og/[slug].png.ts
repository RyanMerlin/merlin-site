import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getPosts, type PostMeta } from '../../lib/posts';
import { SITE_AUTHOR } from '../../lib/config';

export async function getStaticPaths() {
	const posts = await getPosts();
	return posts.map((post) => ({ params: { slug: post.slug }, props: { post } }));
}

const fontRegular = readFileSync(resolve('src/lib/fonts/Geist-Regular.ttf'));
const fontBold = readFileSync(resolve('src/lib/fonts/Geist-SemiBold.ttf'));

function readingTime(wordCount: number): string {
	return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

function findHeroImage(slug: string): Buffer | null {
	// Check for og.png first, then hero.png, in src/posts/**/<slug>/
	for (const year of ['2025', '2026', '2027']) {
		for (const name of ['og.png', 'hero.png']) {
			const p = resolve(`src/posts/${year}/${slug}/${name}`);
			if (existsSync(p)) return readFileSync(p);
		}
	}
	return null;
}

export const GET: APIRoute = async ({ props }) => {
	const post = props.post as PostMeta;

	const hero = findHeroImage(post.slug);
	if (hero) {
		return new Response(hero, {
			headers: {
				'Content-Type': 'image/png',
				'Cache-Control': 'public, max-age=31536000, immutable'
			}
		});
	}

	const date = new Date(post.created).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});

	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					width: '100%',
					height: '100%',
					background: 'linear-gradient(145deg, #17130f 0%, #0d0a07 100%)',
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
		},
		{
			width: 1200,
			height: 630,
			fonts: [
				{ name: 'Geist', data: fontRegular, weight: 400, style: 'normal' },
				{ name: 'Geist', data: fontBold, weight: 600, style: 'normal' }
			]
		}
	);

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
	const png = resvg.render().asPng();

	return new Response(new Uint8Array(png), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
