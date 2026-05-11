<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	function formatDate(iso: string) {
		const d = new Date(iso);
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	}
</script>

<svelte:head>
	<title>{data.meta.title} — Merlin</title>
	{#if data.meta.summary}
		<meta name="description" content={data.meta.summary} />
	{/if}
</svelte:head>

<main class="mx-auto max-w-2xl px-6 py-16">
	<nav class="mb-12 text-sm">
		<a href="/" class="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">← Back</a>
	</nav>

	<header class="mb-10">
		<h1 class="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
			{data.meta.title}
		</h1>
		<div class="mt-2 flex items-center gap-3 text-xs text-zinc-500">
			<time datetime={data.meta.created}>{formatDate(data.meta.created)}</time>
			{#if data.meta.tags.length}
				<span>·</span>
				<span>{data.meta.tags.join(', ')}</span>
			{/if}
		</div>
	</header>

	<article class="prose prose-zinc dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight max-w-none">
		<data.Component />
	</article>
</main>
