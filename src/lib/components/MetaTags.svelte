<script lang="ts">
  import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION, TWITTER_HANDLE } from '$lib/config';

  let {
    title = '',
    description = SITE_DESCRIPTION,
    path = '/',
    type = 'website',
    image = `${SITE_URL}/og-default.png`,
    publishedTime = '',
  }: {
    title?: string;
    description?: string;
    path?: string;
    type?: string;
    image?: string;
    publishedTime?: string;
  } = $props();

  const fullTitle = $derived(title ? `${title} — ${SITE_TITLE}` : SITE_TITLE);
  const url = $derived(`${SITE_URL}${path}`);
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={url} />
  <meta property="og:type" content={type} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  <meta property="og:image" content={image} />
  <meta property="og:site_name" content={SITE_TITLE} />
  {#if publishedTime}
    <meta property="article:published_time" content={publishedTime} />
  {/if}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content={TWITTER_HANDLE} />
  <meta name="twitter:creator" content={TWITTER_HANDLE} />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
</svelte:head>
