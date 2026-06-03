import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

/** Rehype plugin: wrap markdown content <img> with an ABSOLUTE src (e.g. a
 *  /diagrams/x.svg asset in public/) in an <a> that opens the full-size file in a
 *  new tab for native zoom. Zero dependencies — hand-walks the hast tree.
 *  GOTCHA: we only wrap absolute srcs. Colocated/optimized images (./x.png) have
 *  their src rewritten to /_astro/<hash> by Astro AFTER this plugin runs, so
 *  wrapping them here captures the unresolved relative path and yields a 404 link.
 *  Those are skipped (the <img> still renders, it just isn't click-to-zoom). */
function rehypeImageLinks() {
	return (tree) => {
		const walk = (node) => {
			if (!node.children) return;
			node.children = node.children.map((child) => {
				const src = child.type === 'element' ? child.properties?.src : undefined;
				if (
					child.tagName === 'img' &&
					typeof src === 'string' &&
					(src.startsWith('/') || src.startsWith('http'))
				) {
					return {
						type: 'element',
						tagName: 'a',
						properties: {
							href: child.properties.src,
							target: '_blank',
							rel: ['noopener', 'noreferrer'],
							className: ['img-zoom'],
						},
						children: [child],
					};
				}
				walk(child);
				return child;
			});
		};
		walk(tree);
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://ryanmerlin.com',
	trailingSlash: 'never',
	// inlineStylesheets: 'always' embeds the site CSS into each page's HTML instead
	// of linking one external content-hashed /_astro/<hash>.css. That external file's
	// hash changes every deploy, and during Cloudflare Pages' post-deploy propagation
	// a browser can request a hash the serving edge doesn't have yet. Because unmatched
	// paths return 200 + HTML (not 404), the browser silently applies HTML as a
	// stylesheet and the page renders completely unstyled (~50% right after a deploy).
	// Inlining removes the external request entirely, so styling is atomic with the
	// must-revalidate HTML and can never race. ~47KB raw / ~8KB gzipped per page.
	build: { format: 'file', inlineStylesheets: 'always' },
	integrations: [react()],
	markdown: { rehypePlugins: [rehypeImageLinks] },
	vite: { plugins: [tailwindcss()] }
});
