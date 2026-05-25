<script lang="ts">
  import { page } from '$app/state';

  const links = [
    { href: '/', label: 'writing' },
    { href: '/topics/ai', label: 'topics' },
    { href: '/about', label: 'about' },
    { href: '/now', label: 'now' },
    { href: '/connect', label: 'connect' },
  ];
</script>

<nav
  class="sticky top-0 z-10 border-b"
  style="border-color: var(--color-border); background-color: color-mix(in srgb, var(--color-bg) 90%, transparent); backdrop-filter: blur(8px);"
>
  <div class="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
    <a
      href="/"
      class="text-sm font-semibold tracking-tight"
      style="color: var(--color-accent);"
    >
      Ryan Merlin
    </a>
    <div class="flex items-center gap-6">
      {#each links as link}
        <a
          href={link.href}
          class="text-sm transition-colors"
          style="color: {(page.url.pathname === link.href || (link.href.startsWith('/topics') && page.url.pathname.startsWith('/topics'))) ? 'var(--color-accent)' : 'var(--color-text-muted)'};"
          aria-current={(page.url.pathname === link.href || (link.href.startsWith('/topics') && page.url.pathname.startsWith('/topics'))) ? 'page' : undefined}
        >
          {link.label}
        </a>
      {/each}
    </div>
  </div>
</nav>
