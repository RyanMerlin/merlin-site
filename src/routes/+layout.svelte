<script lang="ts">
  import './layout.css';
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="alternate" type="application/rss+xml" title="Ryan Merlin" href="/feed.xml" />
</svelte:head>

<Nav />
{@render children()}
<Footer />
