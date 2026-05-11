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
    <p class="mt-2 text-sm" style="color: var(--color-text-muted);">Updated May 2026 · Aurora, CO</p>
  </header>

  <div class="mt-10 space-y-8 text-base leading-relaxed" style="color: var(--color-text);">
    <section>
      <h2 class="text-sm font-semibold uppercase tracking-widest mb-3" style="color: var(--color-text-muted);">Building</h2>
      <ul class="space-y-2 list-none">
        <li><strong>MissionControl</strong> — a multi-agent fleet orchestration system. Building toward a world where you can run a team of AI agents the way you'd run a distributed system: tasks, mesh networking, persistent memory, health monitoring.</li>
        <li><strong>Aria</strong> — my personal AI orchestrator. She handles my briefings, monitors my investments, manages my publishing pipeline, and runs on my homelab. This site is part of her output.</li>
        <li><strong>This site</strong> — getting the writing habit back. The Aria publisher profile drafts; I edit; we ship.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-sm font-semibold uppercase tracking-widest mb-3" style="color: var(--color-text-muted);">Working</h2>
      <ul class="space-y-2 list-none">
        <li>Principal Forward Deployed Engineer at <strong>Alteryx</strong>, helping enterprise teams get real value from AI deployments. A lot of my work right now is agent-native workflows in organizations that didn't grow up building agents.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-sm font-semibold uppercase tracking-widest mb-3" style="color: var(--color-text-muted);">Reading / Thinking About</h2>
      <ul class="space-y-2 list-none">
        <li>Agent coordination protocols — how do you build reliable multi-agent systems without just making a distributed monolith?</li>
        <li>The gap between what enterprise AI projects promise and what they deliver, and what actually closes it.</li>
        <li>Whether self-hosted LLM inference will ever be cost-competitive with frontier APIs for production agentic workloads.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-sm font-semibold uppercase tracking-widest mb-3" style="color: var(--color-text-muted);">Homelab</h2>
      <ul class="space-y-2 list-none">
        <li>RKE2 cluster running my full self-hosted stack — Kubernetes, ArgoCD, self-hosted LLM inference via LiteLLM, Weaviate, FalkorDB, and about 30 other services.</li>
        <li>Tuning Aria's memory system — Graphiti knowledge graph + Obsidian vault as a hybrid L2/L3.</li>
      </ul>
    </section>
  </div>

  <p class="mt-12 text-sm" style="color: var(--color-text-muted);">
    Inspired by <a href="https://nownownow.com" target="_blank" rel="noopener noreferrer" class="underline decoration-1 underline-offset-2" style="color: var(--color-accent);">nownownow.com</a>.
  </p>
</main>
