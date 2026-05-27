<script lang="ts">
  import './layout.css';
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="alternate" type="application/rss+xml" title="Ryan Merlin" href="/feed.xml" />
</svelte:head>

<Nav />
<div class="flex-1 overflow-y-auto">
{@render children()}
<Footer />
</div>
