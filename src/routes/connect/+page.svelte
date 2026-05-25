<script lang="ts">
  import MetaTags from '$lib/components/MetaTags.svelte';

  const links = [
    {
      platform: 'Twitter / X',
      handle: '@rmerlin',
      url: 'https://x.com/rmerlin',
      description:
        'Short takes on AI agents, enterprise deployment, and what I\'m building. Where the conversation happens.',
      cta: 'Follow',
      icon: 'twitter',
    },
    {
      platform: 'GitHub',
      handle: 'RyanMerlin',
      url: 'https://github.com/RyanMerlin',
      description:
        'Open source work with applied AI, multi-agent orchestration, enterprise scaling, and supporting tooling.',
      cta: 'View repos',
      icon: 'github',
    },
    {
      platform: 'LinkedIn',
      handle: 'ryanmerlin',
      url: 'https://linkedin.com/in/ryanmerlin',
      description:
        'Professional background, career updates, and shorter takes on enterprise AI and the field.',
      cta: 'Connect',
      icon: 'linkedin',
    },
    {
      platform: 'Substack',
      handle: '@ryanmerlin',
      url: 'https://substack.com/@ryanmerlin',
      description:
        'Get posts by email. Same writing as the blog, delivered to your inbox.',
      cta: 'Subscribe',
      icon: 'substack',
    },
    {
      platform: 'YouTube',
      handle: '@ryanmerlin',
      url: 'https://youtube.com/@ryanmerlin',
      description:
        'Video content on building agentic systems, AI infrastructure, and forward deployed engineering in enterprise environments.',
      cta: 'Watch',
      icon: 'youtube',
    },
  ];
</script>

<MetaTags
  title="Connect"
  description="Find Ryan Merlin on Twitter/X, GitHub, LinkedIn, Substack, and YouTube."
  path="/connect"
/>

<main class="mx-auto max-w-3xl px-6 py-16">
  <header class="mb-12">
    <h1 class="text-3xl font-semibold tracking-tight" style="color: var(--color-text);">Connect</h1>
    <p class="mt-3 text-base" style="color: var(--color-text-muted);">
      Where the work lives.
    </p>
  </header>

  <ul class="space-y-0" role="list">
    {#each links as link, i}
      <li>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-start justify-between gap-6 py-7 transition-colors"
          style="border-top: 1px solid var(--color-border); {i === links.length - 1 ? 'border-bottom: 1px solid var(--color-border);' : ''}"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-3 mb-1.5">
              <span class="text-lg font-medium" style="color: var(--color-text);">
                {link.platform}
              </span>
              <span class="text-sm" style="color: var(--color-text-muted);">{link.handle}</span>
            </div>
            <p class="text-sm leading-relaxed" style="color: var(--color-text-muted);">
              {link.description}
            </p>
          </div>
          <span
            class="shrink-0 text-sm font-medium mt-0.5 transition-colors"
            style="color: var(--color-accent);"
          >
            {link.cta} →
          </span>
        </a>
      </li>
    {/each}
  </ul>

  <div class="mt-16 pt-8" style="border-top: 1px solid var(--color-border);">
    <p class="text-sm" style="color: var(--color-text-muted);">
      For professional enquiries, reach me via
      <a
        href="https://linkedin.com/in/ryanmerlin"
        target="_blank"
        rel="noopener noreferrer"
        class="underline decoration-1 underline-offset-2"
        style="color: var(--color-accent);"
      >LinkedIn</a>.
    </p>
  </div>
</main>
