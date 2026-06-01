import type { APIRoute } from 'astro';
import { getPosts, postsByTopic, topics } from '../../../lib/posts';
import { SITE_URL, SITE_TITLE } from '../../../lib/config';

export async function getStaticPaths() {
	return topics.map((t) => ({ params: { topic: t.slug } }));
}

export const GET: APIRoute = async ({ params }) => {
	const topic = topics.find((t) => t.slug === params.topic);
	if (!topic) return new Response('Not found', { status: 404 });

	const allPosts = await getPosts();
	const topicPosts = postsByTopic(allPosts, topic.slug);

	const items = topicPosts
		.map(
			(post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/posts/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.created).toUTCString()}</pubDate>
      ${post.summary ? `<description><![CDATA[${post.summary}]]></description>` : ''}
    </item>`
		)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE} — ${topic.label}</title>
    <link>${SITE_URL}/topics/${topic.slug}</link>
    <description>${topic.label} posts from ${SITE_TITLE}</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/topics/${topic.slug}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
};
