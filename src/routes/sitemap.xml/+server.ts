import { posts } from '$lib/posts';
import { SITE_URL } from '$lib/config';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
  const staticPaths = ['', '/about', '/now'];
  const postPaths = posts.map((p) => `/posts/${p.slug}`);
  const allPaths = [...staticPaths, ...postPaths];

  const urls = allPaths
    .map(
      (path) => `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>${path === '' ? 'weekly' : 'monthly'}</changefreq>
  </url>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
