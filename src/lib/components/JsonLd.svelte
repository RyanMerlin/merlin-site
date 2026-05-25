<script lang="ts">
  import { SITE_URL, SITE_AUTHOR } from '$lib/config';

  let {
    title,
    description = '',
    slug,
    created,
    tags = [],
    wordCount = 0,
  }: {
    title: string;
    description?: string;
    slug: string;
    created: string;
    tags?: string[];
    wordCount?: number;
  } = $props();

  const jsonLd = $derived(JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${SITE_URL}/posts/${slug}`,
    datePublished: created,
    dateModified: created,
    author: {
      '@type': 'Person',
      name: SITE_AUTHOR,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: SITE_AUTHOR,
      url: SITE_URL,
    },
    keywords: tags,
    wordCount,
  }));
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>
