<script lang="ts">
  import MetaTags from '$lib/components/MetaTags.svelte';
</script>

<MetaTags
  title="Now"
  description="What I'm currently focused on."
  path="/now"
/>

<main class="mx-auto max-w-2xl px-6 py-16">
  <header class="mb-4">
    <h1 class="text-3xl font-semibold tracking-tight" style="color: var(--color-text);">Now</h1>
    <p class="mt-2 text-sm" style="color: var(--color-text-muted);">Updated May 2026 · Boulder, CO</p>
  </header>

  <div class="mt-10 space-y-8 text-base leading-relaxed" style="color: var(--color-text);">
    <section>
      <h2 class="text-sm font-semibold uppercase tracking-widest mb-3" style="color: var(--color-text-muted);">Research</h2>
      <ul class="space-y-3 list-none">
        <li>
          <strong>MissionControl</strong> — designing a production-grade multi-agent orchestration
          framework. The core question: what does it take to run a fleet of AI agents with the same
          operational discipline you'd apply to a distributed microservices system? Task durability,
          mesh-based inter-agent coordination, tiered memory, and real observability — not demos.
        </li>
        <li>
          <strong>Agent memory architecture</strong> — building and operating a hybrid memory system
          (knowledge graph + structured vault) for Aria, my personal AI system. The practical
          constraints of running this at production fidelity inform how I think about memory in
          enterprise agent deployments.
        </li>
      </ul>
    </section>

    <section>
      <h2 class="text-sm font-semibold uppercase tracking-widest mb-3" style="color: var(--color-text-muted);">Client Work</h2>
      <ul class="space-y-3 list-none">
        <li>
          Principal Forward Deployed Engineer at <strong>Alteryx</strong>. Current focus is helping
          enterprises move from isolated AI pilots to agent-native workflows that integrate with
          production data infrastructure. The gap between proof-of-concept and operational
          deployment is where most enterprise AI value gets stranded.
        </li>
      </ul>
    </section>

    <section>
      <h2 class="text-sm font-semibold uppercase tracking-widest mb-3" style="color: var(--color-text-muted);">Thinking About</h2>
      <ul class="space-y-3 list-none">
        <li>
          What the right abstraction layer for enterprise agent orchestration actually looks like —
          and why most current frameworks are either too low-level for adoption or too opinionated
          to survive contact with real enterprise architecture.
        </li>
        <li>
          The organizational conditions that determine whether enterprise AI deployments compound
          over time or decay. This is fundamentally a people and process question, not a model one.
        </li>
        <li>
          How frontier model capability improvements are reshaping the economics of agentic
          systems — and what that means for the infrastructure layer being built on top of them.
        </li>
      </ul>
    </section>

    <section>
      <h2 class="text-sm font-semibold uppercase tracking-widest mb-3" style="color: var(--color-text-muted);">Writing</h2>
      <ul class="space-y-3 list-none">
        <li>
          Getting the writing habit back. Aria drafts; I edit; we ship. The goal is to turn
          the research and client pattern-matching into writing that's useful to people building
          and deploying AI systems.
        </li>
      </ul>
    </section>
  </div>

  <p class="mt-12 text-sm" style="color: var(--color-text-muted);">
    Inspired by <a href="https://nownownow.com" target="_blank" rel="noopener noreferrer" class="underline decoration-1 underline-offset-2" style="color: var(--color-accent);">nownownow.com</a>.
  </p>
</main>
