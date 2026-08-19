import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import rehypeExternalLinks from 'rehype-external-links';
import { visit } from 'unist-util-visit';
import { unified } from '@astrojs/markdown-remark';

// The first image in a post is almost always the hero art and the page's LCP
// (Largest Contentful Paint) element. Astro's default markdown image pipeline
// lazy-loads every image uniformly, which actively delays the LCP element's
// fetch. Mark only the first <img> per document eager + high priority; every
// image after it keeps the default lazy behavior.
function rehypeEagerFirstImage() {
	return (tree) => {
		let found = false;
		visit(tree, 'element', (node) => {
			if (found || node.tagName !== 'img') return;
			found = true;
			node.properties.loading = 'eager';
			node.properties.fetchpriority = 'high';
		});
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
	// Open every external link in a new tab so readers never navigate away from the
	// site. Internal links (root-relative "/..." and anchors) are left untouched, so
	// on-site navigation stays in the same tab. rel adds noopener/noreferrer for safety.
	// v7 default markdown pipeline (Sätteri) doesn't run remark/rehype plugins —
	// explicit unified() processor restores it. Top-level markdown.rehypePlugins is
	// deprecated now that a processor is set; pass plugins into unified() instead.
	markdown: {
		processor: unified({
			rehypePlugins: [
				[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
				rehypeEagerFirstImage
			]
		})
	},
	// Prefetch a page's HTML when the reader hovers its link, so the click lands on
	// an already-fetched document. This is the one place the site ships JS to pages
	// that otherwise ship none (~1KB, deferred, on any page with an internal link).
	// The trade is deliberate: navigation between posts is the main interaction on
	// a blog, and prefetch is the cheapest way to make it instant. 'hover' (Astro's
	// default) fetches on intent rather than eagerly, so it never speculatively
	// pulls all 20 posts on the home page.
	prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
	integrations: [react()],
vite: { plugins: [tailwindcss()] }
});
