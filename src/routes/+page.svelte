<script lang="ts">
  import { posts, topics, postTopic, readingTime } from '$lib/posts';
  import MetaTags from '$lib/components/MetaTags.svelte';

  let activeTopic = $state<string | null>(null);

  const filtered = $derived(
    activeTopic
      ? posts.filter((p) => {
          const topic = postTopic(p);
          return topic?.slug === activeTopic;
        })
      : posts
  );

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
</script>

<MetaTags path="/" />

<main class="mx-auto max-w-3xl px-6 py-16">
  <header class="mb-16">
    <h1 class="text-3xl font-semibold tracking-tight" style="color: var(--color-text);">Ryan Merlin</h1>
    <p class="mt-3 text-base leading-relaxed" style="color: var(--color-text-muted);">
      PhD foundation in economics and psychology. 16 years building data systems inside enterprises.<br />
      Now focused on agentic AI, the gap between what AI promises and what it delivers, and the organizational systems that determine which side of that gap you land on.
    </p>
  </header>

  <div class="mb-8 flex gap-0 border-b" style="border-color: var(--color-border);">
    <button
      class="tab"
      class:active={activeTopic === null}
      onclick={() => (activeTopic = null)}
    >
      All writing
    </button>
    {#each topics as topic (topic.slug)}
      <button
        class="tab"
        class:active={activeTopic === topic.slug}
        style="--topic-color: {topic.color};"
        onclick={() => (activeTopic = activeTopic === topic.slug ? null : topic.slug)}
      >
        {topic.label}
      </button>
    {/each}
  </div>

  {#if filtered.length === 0}
    <p style="color: var(--color-text-muted);" class="italic">No posts in this topic yet.</p>
  {:else}
    <ul class="space-y-10">
      {#each filtered as post (post.slug)}
        {@const topic = postTopic(post)}
        <li>
          <article>
            <a href="/posts/{post.slug}" class="group block">
              {#if topic}
                <span class="topic-badge" style="--badge-color: {topic.color};">{topic.label}</span>
              {/if}
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

  {#if activeTopic}
    <p class="mt-8 text-xs" style="color: var(--color-text-muted);">
      📡 <a href="/topics/{activeTopic}/feed.xml" style="color: var(--color-accent);">RSS feed for this topic</a>
    </p>
  {/if}
</main>

<style>
  .tab {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    color: var(--color-text-muted);
    border-bottom: 2px solid transparent;
    background: none;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }
  .tab:hover { color: var(--color-text); }
  .tab.active {
    color: var(--topic-color, var(--color-accent));
    border-bottom-color: var(--topic-color, var(--color-accent));
  }
  .topic-badge {
    display: inline-block;
    padding: 1px 8px;
    border-radius: 3px;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    margin-bottom: 0.25rem;
    background: color-mix(in srgb, var(--badge-color) 15%, transparent);
    color: var(--badge-color);
  }
</style>
