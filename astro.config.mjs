import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import rehypeExternalLinks from 'rehype-external-links';

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
	markdown: {
		rehypePlugins: [
			[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]
		]
	},
	integrations: [react()],
vite: { plugins: [tailwindcss()] }
});
