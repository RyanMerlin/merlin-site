<script context="module">
  export const metadata = {
    title: "Why agents need a control plane, not a pipeline",
    created: "2026-04-07",
    status: "published",
    tags: ["agents", "architecture", "edgeplane"],
    summary: "The dominant model for agent orchestration is the linear pipeline. It breaks down the moment two agents need to touch the same artifact. Here's what the alternative looks like."
  };
</script>

<img src="/images/mc-hero.png" alt="EdgePlane" style="width: 50%; display: block; margin: 0 auto 2rem;" />

Every serious attempt to build a multi-agent system converges on the same shape. You have a coordinator agent that breaks down work, a set of worker agents that execute it, and a reviewer agent that checks the output. The coordinator hands off to a worker, the worker hands off to the reviewer, the reviewer hands back corrections. It looks clean on a diagram.

Then you try to run two workers in parallel. And everything breaks.

---

## The pipeline trap

The pipeline model — agent A produces, agent B consumes, agent C reviews — has an implicit assumption baked into it: work is sequential. Each agent takes a turn. The artifact passes down the line like a baton. If you believe that, the pipeline is the right abstraction.

But real work isn't sequential. Two agents writing code for different modules of the same codebase need to agree on shared interfaces. Two research agents covering different angles of the same question will duplicate findings and contradict each other. A reviewer agent that approves a change while another agent is mid-flight on the same file creates a conflict that neither agent sees coming.

The pipeline breaks not because the agents are bad, but because the pipeline gave them no shared system of record. There's nowhere to register intent before starting work. There's no ownership model for artifacts. There's no way to detect that two agents are about to collide until after the collision.

Most teams respond by making the pipeline more elaborate: adding a lock step, a coordinator checkpoint, a "wait for all workers to finish" gate. This works until it doesn't — usually when you add a third parallel workstream and realize you've hand-rolled a distributed mutex.

The N8N/Airflow-with-LLMs shape, for all its appeal, is fundamentally an execution graph. It models what runs in what order. It doesn't model who owns what, what state looks like across the whole system, or how to recover when a node in the graph fails mid-flight.

---

## A different analogy

In 2014, container orchestration had the same problem. Containers were powerful and composable. What they lacked was a layer that said: this container is running on this node, these are its resource claims, this is its desired state, this is what happens when it crashes. Kubernetes solved this by introducing a control plane — a layer that owns the declarative model of what should be running and continuously works to make reality match it.

The control plane is not the execution environment. It doesn't run your containers. It provides the coordination substrate: identity, scheduling, desired state, health tracking, policy enforcement.

AI agents need the same thing. Not a workflow engine that coordinates the order of LLM calls, but a control plane that coordinates the agents themselves: their identity, their task ownership, their access to shared state, and the governance rules that determine who can approve what.

In EdgePlane, the split maps precisely:

- `edgeplane` is kubectl — the CLI surface for humans and agents, the tool you use to inspect and interact with the system
- `edgeplaned` is kubelet — the node daemon running on every machine, managing every agent process on that machine, reporting back to the control plane
- Missions are namespaces — scoped coordination boundaries that define knowledge domains, toolsets, permission tiers, and governance policy
- Klusters are the work-coordination unit within a mission — where agents and humans focus together on a targeted outcome
- Tasks are the unit of completion — missions persist indefinitely, tasks finish

That last point is worth stating plainly. **Missions don't complete — tasks do.** A mission is a perpetual coordination scope. It's not a run. It's not a workflow instance. It doesn't end when the current sprint ends. The mission for "product development" exists as long as your team is developing a product. Tasks finish; missions accumulate context.

---

## What the control plane buys

Overlap detection before creation. Before a task or artifact is created in EdgePlane, a fuzzy similarity check and a vector search run against the existing state of the mission. The agent sees the results and decides whether to proceed, merge intent with an existing task, or discard. No two agents racing to fix the same bug, no two researchers duplicating the same literature review. The collision is detected before it happens.

Durable ownership. Every task and artifact has an explicit owner — a stable agent identity, not a session UUID that evaporates when the process restarts. When an agent crashes and its supervisor restarts it, ownership is preserved. The task is still assigned. The artifact is still pending. The new session picks up exactly where the previous one left off.

A governed publication path. Work products move through a defined lifecycle: created in S3 as working state, recorded in Postgres as operational state, committed to Git as the memory of record when approved. The full chain of custody — who produced it, which agent, which session, approved by whom, committed where — is preserved at every layer. This isn't audit theater; it's the minimum bar for running multiple agents against shared state without losing track of what happened.

---

## What it costs

More upfront design than wiring a model to a Celery task. You need to define your missions before agents can join them. You need to think about overlap detection policies before you run agents in parallel. You need to decide which mutations require approval before you grant agents write access.

This is not overhead. It's the work you were going to do anyway, moved earlier. Every multi-agent system that skips this step eventually rebuilds it after an incident — two agents clobbered each other's output, an artifact was published without review, a task was completed by three agents simultaneously because nobody was tracking ownership.

The pipeline model defers these problems. The control plane forces you to solve them up front.

If you have one agent running sequential tasks, you don't need a control plane. If you have three agents writing to shared state simultaneously, you do. The threshold is lower than most people expect.

---

The code is at [github.com/RyanMerlin/edgeplane](https://github.com/RyanMerlin/edgeplane). The philosophy doc in the root has the longer version of this argument. Subsequent posts will go deeper into specific pieces of the architecture — persistent sessions, the coordination tax, what "agent identity" actually means in a system with shared state.
