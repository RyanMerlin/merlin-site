<script lang="ts">
  import MetaTags from '$lib/components/MetaTags.svelte';
</script>

<MetaTags
  title="About"
  description="Enterprise AI leader, multi-agent systems architect, and writer. Principal Forward Deployed Engineer at Alteryx."
  path="/about"
/>

<main class="mx-auto max-w-2xl px-6 py-16">
  <header class="mb-12">
    <h1 class="text-3xl font-semibold tracking-tight" style="color: var(--color-text);">About</h1>
  </header>

  <div class="space-y-6 text-base leading-relaxed" style="color: var(--color-text);">
    <p>
      I'm Ryan — an AI leader with 17+ years at the intersection of enterprise strategy and
      engineering execution. I work on the problems that emerge when organizations try to move
      from AI experimentation to AI operations at scale.
    </p>

    <p>
      Currently Principal Forward Deployed Engineer at Alteryx, I work directly with enterprise
      customers on their most complex AI and data platform challenges — the kind where the
      technical problem is solvable but the path to production requires navigating organizational
      complexity, legacy infrastructure, and competing priorities simultaneously. Before this role
      I led Alteryx's Worldwide Cloud & AI Professional Services practice, building the delivery
      capability and technical playbooks that the field runs on today.
    </p>

    <p>
      My background spans the full stack of enterprise AI: early career in data science and
      engineering at AT&T, DIRECTV, TransUnion, and Comcast gave me fluency with what
      large-scale AI deployment actually requires. My PhD and MA in Economics and Organizational
      Psychology from Claremont Graduate University shaped how I diagnose why AI initiatives
      fail — it's rarely the model.
    </p>

    <p>
      My independent research focus is <strong>agentic systems</strong> — specifically, what it
      takes to build AI agents that are reliable enough to trust with consequential work.
      I'm developing <strong>MissionControl</strong>, a multi-agent orchestration framework
      designed around production-grade concerns: task durability, inter-agent coordination,
      persistent memory, and observability. The research informs both my writing and my
      client work.
    </p>

    <p>
      I also run <strong>Aria</strong>, a personal AI system that manages my research,
      publishing, and analysis workflows. Building and operating Aria is how I stay honest
      about the gap between what agentic AI systems promise and what they actually deliver
      today.
    </p>

    <p>
      I write about enterprise AI strategy, agent architecture, and the operational realities
      of deploying AI in production. Longer pieces go to
      <a href="https://substack.com/@ryanmerlin" target="_blank" rel="noopener noreferrer"
         class="underline decoration-1 underline-offset-2 transition-colors"
         style="color: var(--color-accent);">Substack</a>.
      This site is where the shorter, faster thinking lands.
    </p>
  </div>
</main>
