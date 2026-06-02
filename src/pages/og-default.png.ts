import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_AUTHOR } from '../lib/config';

const fontRegular = readFileSync(resolve('src/lib/fonts/Geist-Regular.ttf'));
const fontBold = readFileSync(resolve('src/lib/fonts/Geist-SemiBold.ttf'));

export const GET: APIRoute = async () => {
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
					background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)',
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
											fontSize: '56px',
											fontWeight: 600,
											color: '#e8e4df',
											lineHeight: 1.2,
											letterSpacing: '-0.02em'
										},
										children: SITE_TITLE
									}
								},
								{
									type: 'div',
									props: {
										style: {
											fontSize: '26px',
											color: '#9a9590',
											lineHeight: 1.4
										},
										children: SITE_DESCRIPTION
									}
								}
							]
						}
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								justifyContent: 'flex-end',
								alignItems: 'flex-end'
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											fontSize: '20px',
											fontWeight: 500,
											color: '#7c9cf8'
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
