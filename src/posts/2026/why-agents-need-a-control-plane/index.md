---
title: "Why Agents Need a Control Plane, Not a Pipeline"
created: "2026-04-07"
status: "published"
tags: ["agents","architecture","edgeplane","orchestration","control-plane"]
summary: "Every serious attempt to build a multi-agent system converges on the same shape. Then you try to run two workers in parallel, and everything breaks."
---

![A figure stands on a platform beside a control plane tower labeled Governance, Coordination, Control, with panels for Identity, Permissions, Policies, Routing, Observability, and Audit, an Agent Overview graph, System Health at 98%, and a checklist of Outcomes That Matter, overlooking a chasm where dozens of small robots wander a fractured field marked Duplicate Work, Lost Context, Conflicts, Policy Drift, Unused Tools, and No Visibility](./og.png)

Every serious attempt to build a multi-agent system converges on the same shape.  You have a coordinator agent that breaks down work, a set of worker agents that execute it, and a reviewer agent that checks the output.  The coordinator hands off to a worker, the worker hands off to the reviewer, the reviewer hands back corrections.  It looks clean on a diagram.

Then you try to run two workers in parallel.  And everything breaks.

---

## The pipeline trap

The *pipeline model* (agent A produces, agent B consumes, agent C reviews) has an implicit assumption baked into it: work is sequential.  Each agent takes a turn.  The artifact passes down the line like a baton.  If you believe that, the pipeline is the right abstraction.

But real work isn't sequential.  Two agents writing code for different modules of the same codebase need to agree on shared interfaces.  Two research agents covering different angles of the same question will duplicate findings and contradict each other.  A reviewer agent that approves a change while another agent is mid-flight on the same file creates a conflict that neither agent sees coming.

> The pipeline breaks not because the agents are bad, but because the pipeline gave them no shared system of record.

There's nowhere to register intent before starting work.  There's no ownership model for artifacts.  There's no way to detect that two agents are about to collide until after the collision.

Most teams respond by making the pipeline more elaborate: adding a lock step, a coordinator checkpoint, a "wait for all workers to finish" gate.  This works until it doesn't, usually when you add a third parallel workstream and realize you've hand-rolled a distributed mutex.

The [n8n](https://n8n.io)/[Airflow](https://airflow.apache.org/)-with-LLMs shape, for all its appeal, is fundamentally an *execution graph*.  It models what runs in what order.  It doesn't model who owns what, what state looks like across the whole system, or how to recover when a node in the graph fails mid-flight.

---

## A different analogy

In 2014, [container orchestration had the same problem](https://cloud.google.com/blog/products/containers-kubernetes/from-google-to-the-world-the-kubernetes-origin-story).  Containers were powerful and composable.  What they lacked was a layer that said: this container is running on this node, these are its resource claims, this is its desired state, this is what happens when it crashes.  [Kubernetes](https://kubernetes.io) solved this by introducing a *control plane*, a layer that owns the declarative model of what should be running and continuously works to make reality match it.

> "The control plane's components make global decisions about the cluster (for example, scheduling), as well as detecting and responding to cluster events."
>
> [Kubernetes Cluster Architecture](https://kubernetes.io/docs/concepts/architecture/)

*The control plane is not the execution environment.*  It doesn't run your containers.  It provides the coordination substrate: identity, scheduling, desired state, health tracking, policy enforcement.

**AI agents need the same thing.**  Not a workflow engine that coordinates the order of LLM calls, but a coordination layer that owns agent identity, task ownership, access to shared state, and the governance rules that determine who can approve what.

The term itself has now gone mainstream.  At [Google Cloud Next 2026](https://siliconangle.com/2026/04/22/agent-control-plane-race-hits-overdrive-next-2026-googlecloudnext/) the "agent control plane" became the explicit battleground, with Google, Microsoft, and Salesforce all racing to own it.  Read the announcements closely, though, and most of what they are shipping is a router: a nerve center that moves data between agents and calls that coordination.  That is the pipeline trap with a nicer dashboard.  Naming a layer the control plane is not the same as giving it the one job a control plane exists to do, which is owning state and deciding who touches what.

This distinction matters more now than it did a year ago.  The protocol layer has matured rapidly:

- *[MCP (Model Context Protocol)](https://modelcontextprotocol.io)*: Anthropic's open standard for connecting agents to tools and data, now with [over 10,000 published servers and 97 million monthly SDK downloads](https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/), donated to the [Agentic AI Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation) under the Linux Foundation in December 2025
- *[A2A (Agent2Agent Protocol)](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)*: Google's open protocol for agent-to-agent communication across frameworks and vendors, launched April 2025 with 50+ technology partners
- *[ACP (Agent Communication Protocol)](https://agentcommunicationprotocol.dev/introduction/welcome)*: the BeeAI/IBM open standard for RESTful agent interoperability, now converging with A2A under Linux Foundation governance
- *[AGNTCY](https://agntcy.org)*: the Cisco-led open coalition building the "Internet of Agents" infrastructure layer

*What none of these protocols define is what a persistent agent is at the infrastructure layer.*  They define how agents talk.  They don't define who owns what, how ownership survives a crash, or how to detect that two agents are about to clobber the same artifact.

That gap is what a control plane fills.

In EdgePlane, the split maps precisely to the Kubernetes analogy:

- `edgeplane` is kubectl: the CLI surface for humans and agents, the tool you use to inspect and interact with the system
- `edgeplaned` is kubelet: the node daemon running on every machine, managing every agent process on that machine, reporting back to the control plane
- *Missions* are namespaces: scoped coordination boundaries that define knowledge domains, toolsets, permission tiers, and governance policy
- *Klusters* are the work-coordination unit within a mission, where agents and humans focus together on a targeted outcome
- *Tasks* are the unit of completion; missions persist indefinitely, tasks finish

That last point is worth stating plainly.  *Missions don't complete, tasks do.*  A mission is a perpetual coordination scope.  It's not a run.  It's not a workflow instance.  It doesn't end when the current sprint ends.  The mission for "product development" exists as long as your team is developing a product.  Tasks finish; missions accumulate context.

---

## What the control plane buys

**Overlap detection prevents duplicate work before it starts.**  Before a task or artifact is created in EdgePlane, a fuzzy similarity check and a vector search run against the existing state of the mission.  The agent sees the results and decides whether to proceed, merge intent with an existing task, or discard.  No two agents racing to fix the same bug, no two researchers duplicating the same literature review.  The collision is detected before it happens.

**Durable ownership means crashes don't lose work.**  Every task and artifact has an explicit owner, a stable agent identity, not a session UUID that evaporates when the process restarts.  When an agent crashes and its supervisor restarts it, ownership is preserved.  The task is still assigned.  The artifact is still pending.  The new session picks up exactly where the previous one left off.

**A governed publication path creates an audit trail.**  Work products move through a defined lifecycle: created in S3 as working state, recorded in Postgres as operational state, committed to Git as the memory of record when approved.  The full chain of custody (who produced it, which agent, which session, approved by whom, committed where) is preserved at every layer.  This isn't audit theater; it's the minimum bar for running multiple agents against shared state without losing track of what happened.

This is the same pattern that [Microsoft's Agent Framework v1.0](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/) ships in April 2026: multi-agent orchestration patterns (sequential, concurrent, handoff, group chat) built on top of A2A and MCP as interoperability layers.  The frameworks are converging on the same insight: the protocol layer handles communication; something else has to handle coordination.

---

## What it costs

More upfront design than wiring a model to a Celery task.  You need to define your missions before agents can join them.  You need to think about overlap detection policies before you run agents in parallel.  You need to decide which mutations require approval before you grant agents write access.

This is not overhead.  It's the work you were going to do anyway, moved earlier.  Every multi-agent system that skips this step eventually rebuilds it after an incident: two agents clobbered each other's output, an artifact was published without review, a task was completed by three agents simultaneously because nobody was tracking ownership.

> The pipeline model defers these problems. The control plane forces you to solve them up front.

If you have one agent running sequential tasks, you don't need a control plane.  If you have three agents writing to shared state simultaneously, you do.  *The threshold is lower than most people expect.*

---

The code is at [github.com/RyanMerlin/edgeplane](https://github.com/RyanMerlin/edgeplane).  The philosophy doc in the root has the longer version of this argument.  Subsequent posts will go deeper into specific pieces of the architecture: persistent sessions, the coordination tax, what "agent identity" actually means in a system with shared state.