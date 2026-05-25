import { topics } from '$lib/posts';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = ({ params }) => {
	const topic = topics.find((t) => t.slug === params.topic);
	if (!topic) throw error(404, `Topic not found: ${params.topic}`);
	return { topic };
};

export const entries = () => topics.map((t) => ({ topic: t.slug }));
