import type { APIRoute } from 'astro';
import { getPosts } from '../lib/posts';
import { SITE_URL } from '../lib/config';

export const GET: APIRoute = async () => {
	const posts = await getPosts();
	const today = new Date().toISOString().split('T')[0];
	const latestPostDate = posts.length ? posts[0].created.split('T')[0] : today;

	const staticUrls = [
		{ path: '', changefreq: 'weekly', lastmod: latestPostDate },
		{ path: '/about', changefreq: 'monthly', lastmod: today },
		{ path: '/now', changefreq: 'weekly', lastmod: today }
	];

	const postUrls = posts.map((p) => ({
		path: `/posts/${p.slug}`,
		changefreq: 'monthly' as const,
		lastmod: p.created.split('T')[0]
	}));

	const urls = [...staticUrls, ...postUrls]
		.map(
			(u) => `
  <url>
    <loc>${SITE_URL}${u.path}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <lastmod>${u.lastmod}</lastmod>
  </url>`
		)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
};
