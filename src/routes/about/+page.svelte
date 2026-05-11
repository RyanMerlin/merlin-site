<script lang="ts">
  import MetaTags from '$lib/components/MetaTags.svelte';
</script>

<MetaTags
  title="About"
  description="AI engineer, infrastructure builder, and occasional writer. Based in Aurora, Colorado."
  path="/about"
/>

<main class="mx-auto max-w-2xl px-6 py-16">
  <header class="mb-12">
    <h1 class="text-3xl font-semibold tracking-tight" style="color: var(--color-text);">About</h1>
  </header>

  <div class="space-y-6 text-base leading-relaxed" style="color: var(--color-text);">
    <p>
      I'm Ryan — an AI and data engineer based in Aurora, Colorado. I spend my days helping enterprises
      deploy AI in ways that actually work, and my nights building the systems I wish existed.
    </p>

    <p>
      My day job is Principal Forward Deployed Engineer at Alteryx, where I work directly with customers
      on their hardest AI and data platform problems. Before that I was their Worldwide Lead for Cloud & AI
      Professional Services — same mission, more airports. Earlier in my career I worked in data science and
      engineering at Comcast, TransUnion, DIRECTV, and AT&T, which gave me a healthy appreciation for what
      it takes to make AI work at scale in organizations that have been around longer than the internet.
    </p>

    <p>
      Academically I have a PhD and MA in Economics and Organizational Psychology from Claremont Graduate
      University, and a BS in Business Management from CU Boulder. The social science background shapes how
      I think about AI systems — the technical problems are usually tractable; the human and organizational
      ones are where things get interesting.
    </p>

    <p>
      Outside of work I'm building <strong>MissionControl</strong>, a multi-agent orchestration system, and
      <strong>Aria</strong>, my personal AI orchestrator that runs on my homelab. The homelab itself is an
      RKE2 Kubernetes cluster with self-hosted LLM inference — I prefer to own my compute where I can.
      I also do a fair amount of investing research, which has become an interesting testbed for AI-assisted
      analysis.
    </p>

    <p>
      I have two dogs, Dexter and Grace, who have strong opinions about my work schedule.
    </p>

    <p>
      If you want longer-form thinking, I publish on
      <a href="https://substack.com/@ryanmerlin" target="_blank" rel="noopener noreferrer"
         class="underline decoration-1 underline-offset-2 transition-colors"
         style="color: var(--color-accent);">Substack</a>.
      This site is where shorter pieces land.
    </p>
  </div>
</main>
