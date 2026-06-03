import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

/** Rehype plugin: wrap every markdown content <img> in an <a> that opens the
 *  full-size src in a new tab. Zero dependencies — hand-walks the hast tree.
 *  Only applies to markdown-body images; layout/nav images are Astro components
 *  and are never processed by the markdown pipeline. */
function rehypeImageLinks() {
	return (tree) => {
		const walk = (node) => {
			if (!node.children) return;
			node.children = node.children.map((child) => {
				if (
					child.type === 'element' &&
					child.tagName === 'img' &&
					child.properties?.src
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
