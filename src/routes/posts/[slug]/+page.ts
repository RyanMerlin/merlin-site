import { error } from '@sveltejs/kit';
import { loadPost, posts } from '$lib/posts';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => posts.map((p) => ({ slug: p.slug }));

export const load: PageLoad = async ({ params }) => {
	try {
		return await loadPost(params.slug);
	} catch {
		throw error(404, `Post not found: ${params.slug}`);
	}
};
