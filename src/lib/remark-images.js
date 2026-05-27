import { visit } from 'unist-util-visit';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';

export function remarkColocatedImages() {
	return (tree, file) => {
		const mdPath = file.filename;
		if (!mdPath) return;

		const mdDir = dirname(mdPath);
		const slug = basename(mdDir);

		visit(tree, 'image', (node) => {
			if (!node.url || !node.url.startsWith('./')) return;

			const filename = basename(node.url);
			const srcFile = join(mdDir, filename);
			const destDir = resolve('static/images', slug);

			if (existsSync(srcFile)) {
				mkdirSync(destDir, { recursive: true });
				cpSync(srcFile, join(destDir, filename));
				node.url = `/images/${slug}/${filename}`;
			}
		});
	};
}
