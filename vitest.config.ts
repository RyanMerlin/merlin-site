import { getViteConfig } from 'astro/config';

// getViteConfig wires up the same plugins astro.config.mjs uses (react, tailwind,
// and — critically — the content-collections virtual module resolver), so files
// under test can `import { ... } from 'astro:content'` without a separate mock.
export default getViteConfig({
	// @ts-expect-error — astro/config's ViteUserConfigFn type doesn't know about
	// vitest's `test` field; it's still passed through to Vitest correctly at runtime.
	test: {
		environment: 'node'
	}
});
