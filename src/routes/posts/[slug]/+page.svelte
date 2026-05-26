<script lang="ts">
  import type { PageProps } from './$types';
  import MetaTags from '$lib/components/MetaTags.svelte';
  import JsonLd from '$lib/components/JsonLd.svelte';
  import { posts, readingTime } from '$lib/posts';

  let { data }: PageProps = $props();

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  const otherPosts = posts.filter(p => p.slug !== data.meta.slug).slice(0, 2);
</script>

<MetaTags
  title={data.meta.title}
  description={data.meta.summary ?? ''}
  path="/posts/{data.meta.slug}"
  type="article"
/>

<JsonLd
  title={data.meta.title}
  description={data.meta.summary ?? ''}
  slug={data.meta.slug}
  created={data.meta.created}
  tags={data.meta.tags}
  wordCount={data.meta.wordCount}
/>

<main class="mx-auto max-w-3xl px-6 py-16">
  <nav class="mb-12">
    <a href="/" class="text-sm transition-colors" style="color: var(--color-text-muted);">← writing</a>
  </nav>

  <header class="mb-10" style="border-bottom: 1px solid var(--color-border); padding-bottom: 2rem;">
    <h1 class="text-3xl font-semibold tracking-tight" style="color: var(--color-text);">
      {data.meta.title}
    </h1>
    <div class="mt-3 flex items-center gap-2.5 text-xs" style="color: var(--color-text-muted);">
      <time datetime={data.meta.created}>{formatDate(data.meta.created)}</time>
      <span>·</span>
      <span>{readingTime(data.meta.wordCount)}</span>
      {#if data.meta.tags.length}
        <span>·</span>
        <span>{data.meta.tags.join(', ')}</span>
      {/if}
    </div>
  </header>

  <article class="prose prose-zinc dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight max-w-none prose-lg prose-p:leading-relaxed" style="font-family: var(--font-sans); --tw-prose-body: var(--color-text); --tw-prose-headings: var(--tw-prose-invert-headings, #dedad5);">
    <data.Component />
  </article>

  {#if otherPosts.length}
    <div class="mt-16 pt-8" style="border-top: 1px solid var(--color-border);">
      <p class="text-xs font-medium uppercase tracking-widest mb-6" style="color: var(--color-text-muted);">More</p>
      <ul class="space-y-4">
        {#each otherPosts as post}
          <li>
            <a href="/posts/{post.slug}" class="text-sm" style="color: var(--color-text);">
              {post.title}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</main>
