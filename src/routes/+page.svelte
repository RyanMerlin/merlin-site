<script lang="ts">
	import { posts } from '$lib/posts';

	function formatDate(iso: string) {
		const d = new Date(iso);
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	}
</script>

<svelte:head>
	<title>Merlin</title>
	<meta name="description" content="Notes from Merlin on AI agents, homelab, and other things worth writing about." />
</svelte:head>

<main class="mx-auto max-w-2xl px-6 py-16">
	<header class="mb-16">
		<h1 class="text-3xl font-semibold tracking-tight">Merlin</h1>
		<p class="mt-2 text-sm text-zinc-500">
			Notes on AI agents, homelab infrastructure, and things worth writing down.
		</p>
	</header>

	{#if posts.length === 0}
		<p class="text-zinc-500 italic">No posts yet.</p>
	{:else}
		<ul class="space-y-8">
			{#each posts as post (post.slug)}
				<li>
					<article>
						<a href="/posts/{post.slug}" class="group block">
							<h2
								class="text-xl font-medium text-zinc-900 group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-400"
							>
								{post.title}
							</h2>
							<div class="mt-1 flex items-center gap-3 text-xs text-zinc-500">
								<time datetime={post.created}>{formatDate(post.created)}</time>
								{#if post.tags.length}
									<span>·</span>
									<span>{post.tags.slice(0, 3).join(', ')}</span>
								{/if}
							</div>
							{#if post.summary}
								<p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{post.summary}</p>
							{/if}
						</a>
					</article>
				</li>
			{/each}
		</ul>
	{/if}
</main>
