<script lang="ts">
  import { postsByTopic, readingTime } from '$lib/posts';
  import MetaTags from '$lib/components/MetaTags.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const topicPosts = $derived(postsByTopic(data.topic.slug));

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
</script>

<MetaTags path="/topics/{data.topic.slug}" />

<main class="mx-auto max-w-2xl px-6 py-16">
  <header class="mb-12">
    <a href="/" class="text-xs mb-4 block" style="color: var(--color-text-muted);">← all writing</a>
    <h1 class="text-2xl font-semibold tracking-tight" style="color: {data.topic.color};">
      {data.topic.label}
    </h1>
    <p class="mt-2 text-sm" style="color: var(--color-text-muted);">
      {topicPosts.length} post{topicPosts.length !== 1 ? 's' : ''}
      · <a href="/topics/{data.topic.slug}/feed.xml" style="color: var(--color-accent);">RSS</a>
    </p>
  </header>

  {#if topicPosts.length === 0}
    <p style="color: var(--color-text-muted);" class="italic">No posts in this topic yet.</p>
  {:else}
    <ul class="space-y-10">
      {#each topicPosts as post (post.slug)}
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
