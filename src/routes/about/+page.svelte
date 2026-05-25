<script lang="ts">
  import MetaTags from '$lib/components/MetaTags.svelte';
</script>

<MetaTags
  title="About"
  description="Forward Deployed Engineer and applied AI researcher focused on production agent systems and enterprise AI adoption. Based in Boulder, CO."
  path="/about"
/>

<main class="mx-auto max-w-3xl px-6 py-16">
  <header class="mb-12">
    <h1 class="text-3xl font-semibold tracking-tight" style="color: var(--color-text);">About</h1>
  </header>

  <div class="space-y-6 text-base leading-relaxed" style="color: var(--color-text);">
    <p>
      I'm Ryan — a Forward Deployed Engineer and applied AI researcher based in Boulder, Colorado.
      I work at the intersection of frontier AI capabilities and enterprise production systems,
      with a focus on building agentic applications that solve real business problems.
    </p>

    <p>
      I embed directly with enterprise clients to drive AI adoption — moving organizations from
      isolated experiments to production workflows that compound over time. I deliver technical
      artifacts: agent systems, integration architectures, and deployment patterns that run in
      production. I've built the delivery playbooks and codified the repeatable patterns that
      field organizations run on. The job is part engineer, part translator, part operator.
    </p>

    <p>
      Earlier in my career I worked across data science and engineering at Comcast, TransUnion,
      DIRECTV, and AT&T — enterprise environments spanning media, financial services, and
      telecommunications. That background gives me fluency with the organizational dynamics,
      legacy infrastructure, and competing priorities that determine whether AI deployments
      succeed or stall. Most failures aren't technical.
    </p>

    <p>
      My independent research focus is <strong>production agentic systems</strong>. I'm developing
      <strong><a href="https://github.com/RyanMerlin/edgeplane">EdgePlane</a></strong>, a multi-agent orchestration control plane built around the
      concerns that matter in production deployment: persistent agent identity, lifecycle ownership,
      inter-agent coordination, and operational observability. The goal is a system where you can run a fleet
      of AI agents with the same operational rigor you'd apply to production infrastructure.
      I'm also building and operating <strong>Aria</strong>, a personal AI system that handles
      research, publishing, and analysis workflows — a living testbed for the agent architectures
      I write about.
    </p>

    <p>
      PhD trained in Economics and Organizational Psychology from Claremont Graduate
      University, and a BS in Business Management from CU Boulder. The social science training
      shapes how I think about AI adoption: the hard problems in enterprise AI are almost
      always about people and process, not models.
    </p>

    <p>
      I care about advancing AI that is genuinely useful and responsibly deployed. The writing
      here is my attempt to make the gap between AI capability and AI production narrower —
      for practitioners who are doing the actual work. Follow along on
      <a href="https://x.com/rmerlin" target="_blank" rel="noopener noreferrer"
         class="underline decoration-1 underline-offset-2 transition-colors"
         style="color: var(--color-accent);">Twitter / X</a>
      for shorter takes, or
      <a href="https://substack.com/@ryanmerlin" target="_blank" rel="noopener noreferrer"
         class="underline decoration-1 underline-offset-2 transition-colors"
         style="color: var(--color-accent);">subscribe via Substack</a>
      to get posts by email.
    </p>
  </div>
</main>
