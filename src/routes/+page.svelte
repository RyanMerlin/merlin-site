<script lang="ts">
  import { posts, readingTime } from '$lib/posts';
  import MetaTags from '$lib/components/MetaTags.svelte';

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
</script>

<MetaTags path="/" />

<main class="mx-auto max-w-2xl px-6 py-16">
  <header class="mb-16">
    <h1 class="text-3xl font-semibold tracking-tight" style="color: var(--color-text);">Ryan Merlin</h1>
    <p class="mt-3 text-base leading-relaxed" style="color: var(--color-text-muted);">
      Enterprise AI, agentic systems, and the gap between what AI promises and what it delivers.<br />
      Principal FDE at Alteryx. Building MissionControl.
    </p>
  </header>

  {#if posts.length === 0}
    <p style="color: var(--color-text-muted);" class="italic">No posts yet.</p>
  {:else}
    <ul class="space-y-10">
      {#each posts as post (post.slug)}
        <li>
          <article>
            <a href="/posts/{post.slug}" class="group block">
              <h2 class="text-lg font-medium transition-colors" style="color: var(--color-text);">
                {post.title}
              </h2>
              <div class="mt-1.5 flex items-center gap-2.5 text-xs" style="color: var(--color-text-muted);">
                <time datetime={post.created}>{formatDate(post.created)}</time>
                <span>·</span>
                <span>{readingTime(post.wordCount)}</span>
                {#if post.tags.length}
                  <span>·</span>
                  <span>{post.tags.slice(0, 3).join(', ')}</span>
                {/if}
              </div>
              {#if post.summary}
                <p class="mt-2 text-sm leading-relaxed" style="color: var(--color-text-muted);">{post.summary}</p>
              {/if}
            </a>
          </article>
        </li>
      {/each}
    </ul>
  {/if}
</main>
