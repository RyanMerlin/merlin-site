import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { getPosts, findHeroImagePath, hasRealHero, type PostMeta } from '../../lib/posts';
import { OG_WIDTH, OG_HEIGHT } from './[slug].png';

// Only posts with real colocated hero art get a route here — hasRealHero() is
// the single source of truth postThumbnail() also reads, so the URL a page
// links to and the URL this file actually serves can never disagree.
export async function getStaticPaths() {
	const posts = await getPosts();
	return posts.filter((post) => hasRealHero(post.slug)).map((post) => ({ params: { slug: post.slug }, props: { post } }));
}

export const GET: APIRoute = async ({ props }) => {
	const post = props.post as PostMeta;
	// Non-null: getStaticPaths already filtered to findHeroImagePath() !== null
	// via hasRealHero(), and both read the exact same function, not a duplicated
	// search — they cannot disagree.
	const hero = readFileSync(findHeroImagePath(post.slug)!);

	// JPEG, not PNG: this is painterly/photographic art (lots of unique colors,
	// no transparency needed), and PNG's lossless compression is the wrong tool
	// for that content — it barely shrinks (2.3MB source stays ~1.2MB resized).
	// JPEG at high quality is visually indistinguishable here at a fraction of
	// the size (~100KB), which is why this is its own .jpg route rather than
	// reusing the .png URL with a mismatched Content-Type.
	const resized = await sharp(hero)
		.resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'top' })
		.jpeg({ quality: 85, mozjpeg: true })
		.toBuffer();

	return new Response(new Uint8Array(resized), {
		headers: {
			'Content-Type': 'image/jpeg',
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
