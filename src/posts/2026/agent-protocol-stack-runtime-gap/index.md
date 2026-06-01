---
title: "The Agent Protocol Stack Has a Runtime Gap"
created: "2026-05-23"
status: "published"
tags: ["agents","edgeplane","mcp","a2a","acp","infrastructure","architecture"]
summary: "2026 is the year the agent protocol stack started to look real. MCP, A2A, ACP, and AGNTCY define how agents communicate. None of them define what a persistent agent is at the infrastructure layer."
---

2026 is the year the agent protocol stack started to look real.

*MCP* has become the connective layer between models, tools, data, and applications.  Anthropic [moved MCP into the Linux Foundation's Agentic AI Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation), reporting [more than 97 million monthly SDK downloads and 10,000 active servers](https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/).  [Microsoft Agent Framework 1.0](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/) went generally available with support for multi-agent orchestration and interoperability through MCP and A2A.  [A2A has matured](https://a2a-protocol.org/latest/announcing-1.0/) into a serious protocol for agent-to-agent task exchange, including streaming, asynchronous updates, push notifications, and long-running task handling.  [AGNTCY](https://agntcy.org) is pushing even further into discovery, identity, messaging, observability, and trust across agent ecosystems.

The direction is clear: the industry is standardizing how agents communicate.

That is necessary.  *It is not sufficient.*

The missing layer is not another communication protocol.  **The missing layer is the runtime contract underneath the protocols: the node-local primitive that defines how a long-lived agent is launched, named, supervised, interrupted, resumed, signaled, attached to, and audited.**

We have protocols for how agents talk.

We do not yet have a common infrastructure contract for what a persistent agent *is*.

## What the new protocols solve

*MCP* solves one class of problem: how models and agents connect to tools, data, APIs, and application context.

*A2A* solves another: how agents [discover each other, exchange tasks, stream progress, and coordinate](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/) across organizational or vendor boundaries.

*[ACP](https://agentcommunicationprotocol.dev)* and *[BeeAI](https://beeai.dev)* explored structured, auditable inter-agent collaboration, with particular emphasis on asynchronous workflows and enterprise control surfaces.

*[AGNTCY](https://agntcy.org)* moves closer to the infrastructure layer, targeting discovery, identity, messaging, observability, security, and trust for an open "Internet of Agents."  The Linux Foundation describes AGNTCY as common infrastructure for secure agent identity, reliable messaging, and end-to-end observability.

These efforts are important.  They are not competitors in the simplistic sense.  They are converging around different parts of the same stack.

But all of them eventually meet the same boundary: somewhere, an agent has to exist as an executable thing.

Something has to start it.  Something has to name it.  Something has to keep it alive.  Something has to route messages into it.  Something has to decide whether a mid-task human instruction, a peer-agent message, a cron-triggered directive, or retrieved web content should be treated as authoritative.  Something has to preserve enough state that "the same agent" can be resumed, inspected, or audited later.

That "something" is still mostly implementation-specific.

## The gap is below agent communication

It is tempting to describe the missing piece as "identity."  That is too vague.

A2A has agent cards and discovery.  AGNTCY explicitly addresses identity and trust.  Enterprise frameworks can register agents, route work, and monitor workflows.

The unresolved problem is lower and more operational:

> What is the standard runtime primitive for a persistent AI agent?

Containers had to answer a similar question.

Before the container ecosystem stabilized, "run this workload" meant many different things depending on the host, process manager, packaging format, filesystem layout, isolation boundary, and deployment tool.  The industry eventually converged on primitives: images, containers, runtimes, lifecycle hooks, resource boundaries, registries, schedulers, and node agents.

Docker, containerd, runc, OCI, and Kubernetes did not merely make processes easier to launch.  **They gave infrastructure a shared contract for packaging, running, supervising, and scheduling software.**

Agents do not yet have an equivalent.

Today, the gap between "process running on an OS" and "agent with durable identity, structured session state, live control, provenance-aware messaging, replayable logs, and recoverable lifecycle" is bridged by framework code, orchestration glue, workflow engines, shell sessions, notebooks, queues, containers, and conventions.

That may be fine for early systems.

It will not be fine for fleets of long-running agents.

## Persistent agents are not just long-running tasks

[A2A supports long-running tasks](https://a2a-protocol.org/latest/announcing-1.0/).  That matters.  But a long-running task is not the same thing as a persistent agent.

A task has an ID, a status, and a result.

**A persistent agent has an operational identity.**

It can be addressed before, during, and after a task.  It can receive steering while already working.  It can maintain a live session.  It can accumulate domain context.  It can expose an attachable control surface.  It can be restarted without pretending the prior execution never existed.  It can participate in a fleet where peer agents and human operators both need to reach it by name.

That distinction matters.

The infrastructure question is not:

> Can an agent protocol represent a task that lasts hours?

The infrastructure question is:

> **What owns the agent process while that task is running, and what contract does that owner expose to the rest of the system?**

In Kubernetes terms, this is the difference between defining an API object and defining the node-level machinery that makes that object real.

## The agent process primitive

The primitive I think we need looks something like this:

> A persistent agent is a named, supervised, addressable execution unit with durable session state, explicit lifecycle transitions, attach/detach semantics, typed inbound channels, provenance-bearing message envelopes, restart recovery, resource boundaries, and replayable audit logs.

That definition separates several identities that are often collapsed:

- *Process identity*: what executable is running, where, under what supervisor
- *Session identity*: what live conversational or operational context is attached to the process
- *Network identity*: how other agents or systems reach it
- *Principal identity*: who or what the agent is authorized to act as
- *Memory identity*: what state survives beyond a single invocation
- *Authority identity*: which instructions are trusted, delegated, external, advisory, or untrusted
- *Audit identity*: what happened, when, through which channel, and under whose authority

Most agent systems implement some of these.  Few expose all of them as a coherent runtime contract.

*That is the gap.*

## EdgePlane as one implementation

EdgePlane is my attempt to build that missing layer.

At the center is `edgeplaned`, a node daemon analogous in spirit to kubelet.  It runs on each node, registers local agents with the control plane, manages their lifecycle, launches them, keeps them alive across failures, and routes messages into running sessions.

The key design choice is that agents are not treated as disposable function calls.  They are treated as **persistent named execution units**.

A peer agent, cron timer, operator, workflow engine, or control-plane event can signal a running agent directly:

```bash
edgeplane signal <agent-id> --content "Run /briefing"
```

The receiving agent does not see a raw undifferentiated prompt.  It sees a typed inbound message with provenance:

```text
[PEER MESSAGE from edgeplane-signal-excalibur on signal]
Run /briefing
```

That prefix is not security by itself.  It is not a substitute for authentication, signed envelopes, policy enforcement, or sandboxing.

But it represents an important architectural principle: **provenance belongs in the session layer, before the model processes content.**

The agent should know whether an instruction came from a trusted operator, a peer agent, a scheduler, a tool result, a retrieved document, a browser page, or untrusted external content.  Those should not all collapse into the same text channel.

Prompt injection is fundamentally a confusion problem: untrusted content attempts to masquerade as trusted instruction.  Authentication tells you who sent a message.  It does not, by itself, tell the model how to treat instructions *embedded inside* that message.

A runtime substrate for agents needs typed channels and provenance-bearing message envelopes as first-class primitives.

## Why the session substrate matters

A persistent agent needs somewhere to live.

For EdgePlane, the local session substrate is currently [Zellij](https://zellij.dev).  The point is not that Zellij is the only possible answer.  The point is the primitive it provides: named, resumable, attachable, multiplexed sessions with declarative layouts and machine-addressable control surfaces.

In Aria, the agent stack running on EdgePlane, profiles like `research`, `publisher`, and `engineer` map to persistent named sessions owned by `edgeplaned`.  The daemon can create them, signal them, recover them, and attach operators to them.

The same architecture could be built on tmux, systemd services, containers, or a custom runtime.  But each substrate exposes different native semantics.  If named sessions, restoration, attach/detach, and structured control are conventions rather than primitives, the daemon has to maintain that convention layer itself.

This is why the substrate is not incidental.  The host runtime determines which lifecycle guarantees are native and which are glue.

The broader claim is not "agents should run in Zellij."

The broader claim is:

> Agents need a runtime primitive with native support for named, resumable, inspectable, controllable sessions.

Zellij is one implementation path.  The missing standard is the runtime contract.

## What existing protocols do not standardize

| Layer | Existing work | What it solves | What remains underspecified |
|---|---|---|---|
| Tool and context access | [MCP](https://modelcontextprotocol.io) | Tool, API, data, and application connectivity | Agent process lifecycle |
| Agent task exchange | [A2A](https://a2a-protocol.org) | Discovery, task submission, streaming, async updates, push notifications | Node-local execution ownership |
| Structured collaboration | [ACP](https://agentcommunicationprotocol.dev) / [BeeAI](https://beeai.dev) lineage | Auditable agent collaboration and async workflows | Host/session supervision |
| Internet-of-agents infrastructure | [AGNTCY](https://agntcy.org) | Discovery, identity, messaging, observability, trust | Local executable/session substrate |
| Application frameworks | [Microsoft Agent Framework](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/), LangGraph, AutoGen, CrewAI, others | Agent orchestration and developer ergonomics | Common runtime primitive across frameworks |
| **Runtime substrate** | **EdgePlane-style daemon** | **Named persistent agents, lifecycle, signaling, provenance-aware sessions** | **Needs specification, benchmarks, and broader validation** |

The missing piece is not another API endpoint.

It is the equivalent of a runtime contract for persistent agents.

## How this should be tested

This claim should be falsifiable.

If persistent agent runtimes are a real missing layer, they should outperform ephemeral task agents plus external checkpointing under specific operational conditions.

A useful evaluation suite would test at least four things.

**First: long-horizon continuity.**  Run the same multi-hour tasks under ephemeral task agents and persistent supervised agents.  Introduce restarts, operator steering, model failures, tool failures, and partial context loss.  Measure task completion rate, recovery time, number of human interventions, lost intermediate artifacts, and context reconstruction cost.

**Second: provenance-aware instruction handling.**  Deliver adversarial content through different channels: trusted operator directive, peer-agent signal, scheduler event, tool result, retrieved document, and untrusted web page.  Measure whether the agent correctly distinguishes authoritative instructions from untrusted embedded instructions.

**Third: runtime recovery.**  Kill the model process, the session process, the node daemon, and the control-plane connection independently.  Measure what survives, what is replayed, what requires human intervention, and whether the same agent can be reattached by name.

**Fourth: substrate complexity.**  Implement the same persistent-agent lifecycle on Zellij, tmux, containers, and systemd.  Compare glue code, failure modes, session restoration correctness, attach/detach behavior, log replay, and operator ergonomics.

The falsifier is straightforward: if existing frameworks and protocols already satisfy these runtime guarantees with ordinary services, queues, and checkpoints, then EdgePlane is unnecessary.

But if they do not, then the missing layer is real.

## Why this matters now

The industry is moving toward multi-agent systems before it has settled the runtime substrate those systems will depend on.

That is not unusual.  Communication protocols often stabilize before execution models do.  But once agents become long-lived, collaborative, steerable, and operationally accountable, the infrastructure assumptions become harder to ignore.

A fleet of agents needs more than tool access and task exchange.

- It needs lifecycle ownership
- It needs live control
- It needs inspectable state
- It needs restart semantics
- It needs provenance-aware messaging
- It needs replay
- It needs a way for operators and peer agents to address the same running entity by name

Without that layer, every framework rebuilds the same substrate differently.  Every deployment invents its own conventions.  Every agent's identity becomes a mixture of process ID, container name, queue topic, database row, framework object, memory key, and hope.

That is not a foundation for reliable agent infrastructure.

## The next standardization question

The protocol stack is crystallizing around communication.

The next question is execution.

Not "which agent framework wins?"

Not "which messaging protocol wins?"

Not "which tool protocol wins?"

The better question is:

> **What is the OCI-like runtime contract for persistent AI agents?**

That contract does not need to replace *MCP*, *A2A*, *ACP*, *AGNTCY*, or application frameworks.  It should sit *beneath* them.

- *MCP* can connect agents to tools
- *A2A* can let agents exchange tasks
- *AGNTCY* can help agents discover and trust each other
- Frameworks can define application logic

But something still has to make an agent real on a node.

That is the layer I am building with EdgePlane.

The agent ecosystem has made major progress on how agents communicate.  The next frontier is defining how agents *exist*.
