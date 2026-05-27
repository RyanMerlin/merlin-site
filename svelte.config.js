import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import remarkGfm from 'remark-gfm';
import { remarkColocatedImages } from './src/lib/remark-images.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: { adapter: adapter() },
	preprocess: [mdsvex({ extensions: ['.svx', '.md'], remarkPlugins: [remarkGfm, remarkColocatedImages] })],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
