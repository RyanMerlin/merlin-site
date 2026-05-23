<script context="module">
  export const metadata = {
    title: "The MCP Explosion Has a Scaling Problem",
    created: "2026-05-23",
    status: "published",
    tags: ["mcp", "cli", "edgeplane", "agents", "architecture", "infrastructure"],
    summary: "MCP won the tool protocol layer. That doesn't mean it should become the universal agent substrate. The scaling problem isn't that MCP failed — it's that it succeeded so fast people started using it for everything."
  };
</script>

MCP won.

In roughly a year, Model Context Protocol went from a clever interoperability idea to the default tool-connectivity layer for AI agents. Anthropic donated MCP to the Linux Foundation's Agentic AI Foundation. The project reported more than 97 million monthly SDK downloads, 10,000 active servers, and first-class support across major AI platforms.

That is an extraordinary adoption curve.

It also makes this a strange time to argue that many agent systems should use MCP less.

The case is not against MCP. MCP solved a real problem: standardized tool access across models, clients, frameworks, and applications. The case is against treating MCP as the default answer to every integration problem.

As agents move from demos into persistent production fleets, the distinction matters.

MCP is excellent when a model needs in-context tool discovery and invocation.

It is not always the right substrate for operational control.

## The protocol stack is getting layered

For most of 2024, the agent ecosystem argued about frameworks. LangChain, AutoGen, CrewAI, Semantic Kernel, custom orchestration, graph runtimes, tool routers, workflow engines. Everyone wanted to know which framework would win.

That was the wrong abstraction.

What emerged instead is a protocol stack.

MCP handles tool connectivity: agent to tool, model to API, assistant to application context.

A2A handles agent-to-agent task exchange across vendors and organizational boundaries. Google launched A2A with more than 50 technology partners, including Salesforce, SAP, Atlassian, ServiceNow, and others.

ACP and BeeAI explored structured inter-agent collaboration, especially for asynchronous, auditable workflows.

Microsoft Agent Framework 1.0 went generally available with enterprise-grade multi-agent orchestration, multi-provider model support, and interoperability through A2A and MCP.

This is the right direction. The future is not one framework. It is layered interoperability.

But layering only works when each layer is used for the right job.

MCP connects agents to tools.

That does not mean every agent operation should become an MCP tool.

## MCP's hidden cost model

MCP's design is elegant for its intended purpose.

A server advertises capabilities. The client loads tool definitions. The model can decide which tool to call. The interface is standardized. The same server can work across many hosts.

That is a major win.

The cost is that tool availability usually has to be represented to the model before the model can use the tool. Descriptions, schemas, argument shapes, names, annotations, and usage guidance all compete for context. Wire twenty MCP servers into a fleet agent with five tools each and you are paying 10,000–30,000 tokens of schema overhead before the agent has done anything.

At small scale, this is invisible.

At fleet scale, it becomes architectural.

The official MCP client documentation is explicit about the problem: loading every tool definition into the model context upfront wastes tokens, increases latency, and degrades model performance. It recommends progressive discovery and programmatic tool calling as mitigation patterns.

That recommendation is important because it reveals the real issue.

The ecosystem is now building machinery to avoid the cost of exposing too many tools through MCP at once.

Tool retrieval. Dynamic tool loading. RAG over tool definitions. Capability filtering. Router tools. Namespaces. Progressive discovery. Programmatic tool calls.

These are useful techniques. They are also evidence that MCP's naive scaling model does not survive contact with large operational surfaces.

The more MCP succeeds, the more important this becomes.

A world with 50 tools is manageable.

A world with 500 tools needs routing.

A world with 5,000 possible integrations needs a different default assumption.

## The mistake: using MCP as the operational substrate

The mistake is subtle.

MCP should be the model-facing tool protocol.

It should not automatically become the control plane for every operation an agent might perform.

There is a difference between:

> "The model should reason over this tool and decide when to call it."

And:

> "The agent needs a deterministic operational interface to the system it already manages."

Those are not the same problem.

If an agent is operating a Kubernetes cluster, restarting a local service, checking fleet health, sending a signal to a sibling agent, reading a known status file, or invoking a specific workflow, the model may not need a full schema in context every turn.

It may need a stable command surface.

This is especially true for persistent agents with defined roles.

A research agent does not need every infrastructure operation in its prompt.

An infrastructure agent does not need every publishing workflow loaded as a tool.

A publisher agent does not need the whole control plane schema sitting in context before it writes a post.

Production agents usually have jobs. Jobs imply bounded interfaces.

MCP is strongest when the model needs flexible discovery across an uncertain toolset.

It is weaker when the operational surface is known, deterministic, and better kept below the context window.

## The alternative: CLI as agent substrate

There is an older design pattern that maps surprisingly well to agents: a CLI binary as the primary operational substrate.

In EdgePlane, the primary interface is `edgeplane`, a compiled Rust binary. Agents call it through subprocess execution. Humans call it from a terminal. Timers call it from automation. System services call it from scripts.

Same artifact. Same behavior. Same permissions model. Same output contract.

```bash
edgeplane capabilities --tag infra
edgeplane exec kubectl.get-pods --json
edgeplane signal research-agent --content "run /briefing"
```

The context cost model inverts.

With MCP, the agent often pays upfront by loading tool definitions before it knows which tool it needs.

With a CLI substrate, the agent pays only when it calls the command.

No global schema warmup. No context-window tax for tools that will not be used. No requirement that the host runtime support MCP initialization. No special dependency on one agent framework.

And every runtime can use it. Claude Code, Gemini CLI, OpenAI Agents SDK, Microsoft Agent Framework, shell scripts, cron, systemd, and human operators all know how to execute a subprocess. That universality means you never write a host-specific integration — the same binary works everywhere, with the same behavior, regardless of which agent framework is calling it.

A CLI binary is not glamorous. But infrastructure usually converges around boring interfaces for good reasons.

They are inspectable.

They are scriptable.

They are testable.

They are composable.

They survive framework churn.

## MCP still belongs in the system

This is not an anti-MCP argument.

EdgePlane ships an MCP server for the cases where MCP is the right interface.

That distinction is the point.

`edgeplane serve` can expose EdgePlane operations as MCP tools when an agent genuinely benefits from in-context tool discovery and model-mediated selection.

But that should be a deliberate choice, not the default integration path.

The CLI is the operational substrate.

MCP is the model-facing tool surface.

Those are different layers.

When the model needs to discover and reason over tools, use MCP.

When the agent already knows the operation it needs to perform, call the substrate directly.

## The capability discovery tradeoff

The honest weakness of the CLI model is discovery.

MCP front-loads discovery. The server tells the client what tools exist. The model gets names, descriptions, schemas, and argument contracts. For open-ended agents operating in unfamiliar environments, that is powerful.

A CLI does not magically solve that.

An agent has to know the command exists, or it has to discover capabilities explicitly:

```bash
edgeplane capabilities
edgeplane capabilities --tag infra
edgeplane capabilities --agent research
```

That means the CLI substrate needs a capability catalog. It needs structured output. It needs stable naming. It needs documentation that agents can consume. It needs role-scoped discovery.

The difference is when discovery happens.

MCP often discovers at initialization.

A CLI substrate can discover on demand.

That is a better fit for agents with bounded operational roles.

Most production agents are not infinitely open-ended. They are not wandering an arbitrary universe of tools. They are assigned responsibilities: monitor this fleet, publish this briefing, triage this queue, operate this namespace, reconcile this state.

For those agents, the right interface is usually not "load every possible operation into context."

The right interface is "give me the small capability surface relevant to this role, and let me inspect more when needed."

## The scaling problem nobody wants to say out loud

MCP's success created a new default:

> If an agent needs to do something, expose it as an MCP server.

That default will not scale indefinitely.

Not because MCP is bad.

Because context is not free.

Every tool definition competes with task context, memory, retrieved evidence, user instructions, intermediate reasoning, and output quality.

Every extra tool increases the search space the model has to navigate.

Every server added to a runtime increases initialization, policy, trust, and observability complexity.

The official guidance already points toward selective exposure and progressive discovery.

But the deeper architectural move is to stop assuming every operation belongs in the context-facing layer at all.

Some operations should be exposed to the model.

Some should be available to the agent runtime.

Some should be hidden behind deterministic workflows.

Some should be policy-gated.

Some should be callable only by operators or peer agents.

Some should never enter the context window.

That is not a tooling distinction. It is an infrastructure distinction.

## A better layering model

The mature agent stack should look something like this:

| Layer | Best fit | Failure mode when overused |
|---|---|---|
| MCP | In-context tool discovery and model-mediated tool use | Tool overload, context bloat, latency, degraded selection |
| A2A | Cross-agent task exchange across boundaries | Overkill for local deterministic operations |
| ACP-style workflows | Structured, auditable collaboration | Too heavyweight for simple local calls |
| CLI substrate | Deterministic operational control | Weak discovery unless capabilities are cataloged |
| Runtime daemon | Lifecycle, identity, supervision, signaling | Framework lock-in if not standardized |
| Policy layer | Authorization, trust, provenance, constraints | Unsafe execution if bypassed |

This is the distinction EdgePlane is trying to make concrete.

MCP is not the substrate.

A2A is not the substrate.

The framework is not the substrate.

The substrate is the thing that lets agents, humans, services, and automation operate the same system through a stable, deterministic interface.

For EdgePlane, that substrate begins with a CLI binary and a node daemon.

## Why this matters for persistent agent fleets

Short-lived demo agents can tolerate sloppy layering.

Persistent agents cannot.

A persistent agent accumulates role context. It receives steering. It coordinates with peers. It survives restarts. It gets audited. It may run for days or weeks. It needs a stable operational surface that does not depend on stuffing every possible tool schema into its context window.

At fleet scale, the question changes from:

> "Can my agent call this tool?"

To:

> "Which layer should own this operation?"

That is the question MCP's popularity has made urgent.

If the operation requires model reasoning over an unknown tool, MCP is a good fit.

If the operation is deterministic control of a known system, a CLI or runtime API may be better.

If the operation crosses organizational boundaries, A2A may be right.

If the operation needs structured audit semantics, ACP-style workflows may be right.

If the operation concerns lifecycle, supervision, identity, or signaling, it belongs below all of them.

## Use the right layer

MCP won the tool protocol layer.

That does not mean MCP should become the universal agent substrate.

The next stage of agent infrastructure is not about exposing more tools to the model. It is about deciding which operations belong in the model's context, which belong in the runtime, and which belong in the control plane.

The agent ecosystem needs MCP.

It also needs restraint.

Use MCP when the model needs tool awareness.

Use a substrate when the agent needs operational control.

The scaling problem is not that MCP failed.

The scaling problem is that MCP succeeded so quickly that people started using it for everything.
