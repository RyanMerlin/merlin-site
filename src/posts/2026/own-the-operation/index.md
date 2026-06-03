---
title: "Own the Operation"
created: "2026-06-02"
status: "published"
tags: ["agents","cli","mcp","tooling","infrastructure","operations"]
summary: "MCP is how agent capabilities travel. It should not be where your operating knowledge lives. For personal agents, the durable leverage is an owned operations layer: CLI verbs with stable contracts, progressive discovery, honest errors, and one interface every caller can reuse."
---

MCP connects agents to tools.  Workflows coordinate tools.  Skills teach models how to use tools.

None of those automatically owns the operation.

An operation is the durable unit of work: resolve this secret, explain this failed deploy, audit this cloud account, prepare this release, reconcile these receipts, summarize this incident.  It includes the auth path, retries, local conventions, failure taxonomy, output contract, safety policy, and receipt.  If that knowledge lives in a prompt, a notebook cell, a workflow node, or a thin MCP wrapper, the agent has to rediscover it every time.

The useful question is not whether agents should use MCP or the command line.  The answer is obviously both.

The useful question is:

> **Where does the operation live?**

My claim: for repeated, composition-heavy, personally shaped work, the operation should often live behind an owned command surface.  MCP can expose it.  A workflow can schedule it.  A skill can explain it.  But the operation itself should compile into something deterministic, inspectable, reusable, and honest about failure.

That is what a good CLI gives you.  Not a pile of scripts.  Not an MCP server for every API.  Not terminal nostalgia.  A stable, discoverable, JSON-speaking operations layer over the systems you actually touch.

## The layer mistake

MCP solved a real problem.  Before MCP, every agent integration was bespoke glue.  [Anthropic describes MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) as an open standard for connecting agents to external systems, replacing custom pairings between every agent and every tool.

That win is real.  It is also easy to overextend, which is the argument I made last week in [The MCP Explosion Has a Scaling Problem](/posts/mcp-explosion-scaling-problem): MCP won the tool layer, but a protocol boundary is not an operational boundary.

| Layer | Owns | Should not own |
|---|---|---|
| Skills and docs | Instructions, examples, policies, procedural context | The only copy of critical behavior |
| CLI verbs | Executable operations, contracts, local conventions, error taxonomy | Remote distribution, OAuth consent, multi-tenant governance |
| Workflows | Scheduling, orchestration, state, retries across steps, approvals | The only definition of an operation other callers need |
| MCP | Protocol, auth, discovery, consent, hosted distribution | Your private operating knowledge by default |

MCP answers: how does the agent reach a capability, what schema describes the call, who is allowed to invoke it, and how does the result come back?

An operation answers: what should actually happen, which local rule applies, what failure class is this, is it retryable, what should be redacted, what receipt proves it ran, and what output can every caller depend on?

Those are different questions.  When they collapse into the same artifact, agent systems get brittle.  Tool catalogs grow.  Error modes blur.  Prompts accumulate folklore.  Agents spend tokens rediscovering facts the environment already knows.  This is the same separation-of-layers point behind [The Agent Protocol Stack Has a Runtime Gap](/posts/agent-protocol-stack-runtime-gap), applied one level down, to your own operations.

The operation should live in the narrowest deterministic interface that can do the work correctly.  For personal agents, that interface is often a CLI.

## Progressive discovery won

The first scaling failure in agent tooling was not model quality.  It was context pressure.

[Cloudflare's Code Mode](https://blog.cloudflare.com/code-mode-mcp/) is the cleanest production example.  The Cloudflare API has more than 2,500 endpoints.  Exposing every endpoint as a separate MCP tool would consume 1.17 million tokens.  Code Mode exposes two tools, `search()` and `execute()`, keeps the footprint around 1,000 tokens, and still reaches the full API surface.  The important part is not the token reduction.  It is the shape: search first, inspect only what matters, then execute.

[Anthropic reached the same conclusion](https://www.anthropic.com/engineering/code-execution-with-mcp) from the client side.  Loading every MCP tool definition up front and routing large intermediate results through the model makes agents slower and more expensive.  Presenting MCP servers as code APIs lets the agent inspect only the tool files it needs and process intermediate data inside the execution environment.  Their example workflow dropped from 150,000 tokens to 2,000, a 98.7 percent reduction.

[Claude's Tool Search](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) makes the pattern explicit: defer loading, search the catalog, and expand only the few tools needed for the request.  Anthropic's docs say a typical multi-server setup can spend roughly 55,000 tokens on tool definitions before useful work starts, and tool search usually cuts that by more than 85 percent.

The honest conclusion is not "MCP failed." It is sharper:

> **Progressive discovery won.  Do not load the world.  Find the next handle.**

A good CLI already works that way.

```bash
mytool discover                                          # top-level domains
mytool discover secrets                                  # one domain
mytool secrets resolve --help                            # one verb
mytool secrets resolve providers/openai/api-key --json   # one operation
```

The agent does not need the whole surface.  It needs a catalog, a drill-down path, and the schema for the verb it is about to run.

![Rolling discovery: the agent lists the catalog, drills into one domain, then loads the full schema for only the verb it is about to run](/diagrams/aria-rolling-discovery.svg)

This is also why the CLI keeps showing up in evaluations.  [Arize ran 500 GitHub-task evaluations](https://arize.com/blog/mcp-vs-cli-skills-for-agents-what-our-eval-found-and-which-you-should-use/) across MCP, CLI skills, and bare shell.  Correctness landed in a tight band: MCP at 0.834, the shorter CLI skill at 0.833, and bare shell at 0.845.  But on the hardest tasks, MCP **cost more than 6X** what the skills cost, took five times longer, and averaged more tool calls.  Tool fidelity fell to 0.33 because the MCP agent escaped into bash when the API surface could not express the composition it needed.

The same eval also shows where MCP wins.  Creating a branch and opening a pull request went better through MCP because `create_branch` and `create_pull_request` existed as direct endpoint-shaped tools.  That gives us the rule:

> **Endpoint-shaped tasks favor endpoint-shaped tools.  Composition-shaped tasks favor executable surfaces.**

Use the protocol when the task is a clean remote capability.  Use an executable surface when the task requires filtering, joining, computing, redacting, retrying, or applying local judgment across messy intermediate state.

## The seam is where systems fail

An expired token comes back as a 404.  A missing secret also comes back as a 404.

So when your agent's credential fetch fails, it spends ten minutes debugging the wrong layer, because the five-line auth dance copied into nine scripts cannot tell the two apart.

Before:

```bash
source .env
TOKEN=$(curl -s -X POST "$AUTH_URL" -d "$AUTH_BODY" | jq -r .access_token)
curl -s "$VAULT_URL/secret/$SECRET_PATH" -H "Authorization: Bearer $TOKEN" | jq -r .data.value
```

That is not an operation.  It is ceremony.  Maybe it retries.  Maybe it refreshes.  Maybe it distinguishes auth failure from missing data.  Maybe the next script copied the fixed version.  Probably not.

After:

```bash
mytool secrets resolve providers/openai/api-key --json
```

Now the operation exists.  It owns the auth flow, token refresh, retry policy, error taxonomy, output shape, and receipt.  The agent does not need to infer the difference between an expired credential and a missing path.  The command tells it.  (That secrets layer is its own small build, which I wrote up in [Building first-class secrets management into an AI agent](/posts/building-first-class-secrets-management-into-an-ai-agent).)

A useful command should not just return bytes.  It should return a contract.

```json
{
  "ok": false,
  "error": {
    "code": "AUTH_TOKEN_EXPIRED",
    "class": "auth",
    "retryable": true,
    "message": "Credential expired before vault lookup.",
    "remediation": "Run `mytool auth refresh` or allow automatic refresh."
  },
  "receipt": {
    "id": "sec_20260602_184211",
    "operation": "secrets.resolve",
    "target": "providers/openai/api-key"
  }
}
```

That is the difference between a model guessing and a system reporting.

The win is not that the command is shorter.  The win is that the operation is executable, inspectable, reusable, and honest about failure.  A human can call it.  An agent can call it.  A cron job can call it.  A service can call it.  An MCP wrapper can call it later.  The operation is no longer trapped in a prompt, workflow node, notebook cell, shell history, or vendor connector.  It is part of your surface.

![One command surface, every caller: a human at a terminal, an agent through its shell, a cron job, and a background service all invoke the same JSON-speaking verb](/diagrams/aria-rs-command-surface.svg)

## Why not workflows?

Use workflows.  Just do not confuse orchestration with ownership.

Workflow systems are excellent when the process is known in advance: CI/CD, scheduled maintenance, long-running state machines, approvals, retries across services, human-in-the-loop review, and audit trails for a business process.  [GitHub Actions](https://docs.github.com/en/actions) automates software workflows inside a repository.  [Temporal](https://docs.temporal.io/tags/durable-execution) is built around durable execution, where workflow state survives failures and resumes reliably.  Tools like n8n, Zapier, Dagster, and Airflow exist because orchestration is a real need.

They are not the same layer as the operation.  A workflow should decide **when** and **in what order** work happens.  A command should define **what the work is**.

Bad layering puts the substance inside the orchestrator:

- the workflow node contains the auth logic
- it contains the provider-specific retries
- it contains the jq filters and the local naming conventions
- it contains the only error handling anyone trusts

Good layering keeps the workflow thin and the operations owned:

```bash
workflow trigger
  -> mytool cloud drift --stack payments-prod --json
  -> mytool deploy explain --service api --env prod --since 30m --json
  -> mytool incident snapshot --service checkout --include logs,metrics,traces --json
```

The workflow owns scheduling, approvals, fan-out, retries between steps, and escalation.  The CLI owns the operation contract.  If an agent needs the same capability interactively, it calls the same command.  If a service needs it, it calls the same command.  If you later expose it through MCP, the wrapper calls the same command.  That is the reuse workflows do not give you by themselves.

The honest exception: if the work is inherently a long-running process with durable state, use a workflow engine as the source of truth.  Do not force Temporal into a CLI-shaped box, replace CI/CD with a local binary, or rebuild Zapier because you need to move a row between two SaaS apps.  But if a workflow node becomes the only place that knows how to interpret a failed deploy, classify an IAM error, or join logs with metrics and traces, promote that logic into an operation and let the workflow call it.

> Workflows are control planes.  Commands are operational primitives.

## Skills are maps.  Commands are machines.

The ecosystem is also converging on reusable procedural context.  Anthropic describes [Skills](https://claude.com/blog/organization-skills-and-directory) as repeatable workflows tailored to how you work, with organization-wide management, partner-built skills, and an open standard meant to work across AI platforms.

Skills are part of the stack.  But a skill is not the operation itself.  A skill can say: "when resolving a secret, check the provider, refresh credentials, distinguish expired tokens from missing paths, emit structured JSON, and leave a receipt."  That helps the model behave.  It does not guarantee the operation.

If the behavior lives only in prose, the agent reconstructs it every time.  Sometimes correctly.  Sometimes it skips a check, pastes stale shell from a previous run, or interprets the same 404 in the wrong layer.  A command turns the procedure into an executable affordance.

> The skill tells the agent when and why to use it.  The CLI does the work.

## Build by osmosis

You do not have to start from a blank file.

One thing MCP gives us, beyond runtime connectivity, is a corpus of tool-design prior art.  An MCP server is a compact expression of how a domain exposes itself to agents: tool names, descriptions, schemas, auth assumptions, pagination, failure modes, and handler logic.  The [MCP tools spec](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) makes this explicit: each tool carries a name plus metadata describing its schema.  When the server is open source, the agent can read the implementation.  When it is not, it can still inspect the exposed contract.

So MCP is useful even when MCP is not the final interface.  The move is toolchain osmosis:

- study the generic MCP surface
- extract the operational primitives
- preserve useful auth, pagination, retry, and rate-limit behavior
- collapse repeated work into personal verbs, and discard what you do not use
- harden the result as CLI commands
- expose those commands back through MCP only if distribution requires it

The anti-pattern is a direct port:

```bash
mytool github list-issues --json
mytool github get-issue --id 123 --json
mytool github list-pull-requests --json
mytool github create-branch --json
```

That is endpoint sprawl wearing a terminal costume.  The target is compression:

```bash
mytool work triage --project aria --since 7d --json
mytool ci explain-failure --repo aria --run latest --json
mytool release prepare --repo aria --base main --dry-run --json
```

Those commands know which accounts matter, which regions are production, which labels identify a release, which alarms are noisy, and what "rollback candidate" means.  A good agent can help with that transformation, not by inventing tools from vibes, but by reading the existing implementation and proposing a smaller, sharper surface:

```text
Study the MCP server in ./vendor/mcp-servers/github and its tools/list schemas.
Do not port tools one-for-one. Extract reusable operational primitives and propose
CLI verbs for my actual workflow. Constraints: collapse repeated multi-step
workflows; keep generic CRUD out unless called by more than one actor; every
command returns a stable JSON envelope, defines exit codes and error classes,
supports --dry-run for writes, and leaves a receipt for destructive actions;
keep secrets out of prompts and logs; note which MCP tools informed each verb.
Output: candidate verbs, rejected tools and why, JSON schemas, error taxonomy,
implementation plan, open questions.
```

The output you want is not a bigger catalog.  It is a smaller one.

> MCP can be the scaffolding.  The CLI is what remains after the scaffolding comes down.

## What earns a command

This is where the argument needs discipline.  "Build your own toolchain" can decay into aesthetic DIY.  That is not the claim.  A command earns its place when at least one of these is true:

- it is called by more than one actor: human, agent, workflow, service
- it encodes a local convention a vendor cannot know
- it joins multiple systems behind one stable contract
- it has ambiguous failure modes that need honest errors
- it handles sensitive data that should not pass through model context
- it is repeated often enough that prompt reconstruction is waste
- it is dangerous enough to require dry-run, receipts, or guardrails

If none of those are true, do not wrap it.  Use MCP, the vendor connector, the workflow tool, or the API directly.  Use the shell once and move on.

The test is not whether a command feels elegant.  It is whether it reduces repeated reasoning, repeated glue, repeated tokens, repeated ambiguity, or repeated risk.

## The chassis is the investment

The upfront work is real.  You need the chassis before the leverage shows up: argument parsing, config loading, secret resolution, structured JSON output, stable exit codes, stable error classes, audit receipts, dry-run support, idempotency for writes, a useful `--help`, and machine-readable discovery.

That is not free.  The first useful command costs more than it feels like it should.  But the chassis changes the economics of every command after it.  Adding a capability stops being "build an integration" and becomes "describe a verb." A thin wrapper over an API you already use is minutes.  A real integration is an afternoon.

I used to describe this as "the hundredth command is free." That was too cute.

> The hundredth command is not free.  It is prepaid.

You paid for it with the first ninety-nine decisions: one output envelope, one error taxonomy, one discovery model, one auth strategy, one audit trail, one binary every caller knows how to invoke.  The compounding is not that commands become magically cheap.  The compounding is that the surface becomes coherent.

## Put MCP behind it when distribution matters

None of this requires being anti-MCP.  In many systems the cleanest architecture is to put the owned operation behind MCP:

```text
agent
  -> MCP server
      -> owned CLI verb
          -> operation
              -> APIs, files, secrets, infrastructure
```

That gives you the protocol benefits without making the wrapper the source of operational truth.  MCP handles remote access, OAuth, consent, governance, and hosted distribution.  The CLI owns the operation.  The skill explains when to use it.  The workflow schedules it.

This split is also safer.  [Cloudflare](https://blog.cloudflare.com/code-mode-mcp/) notes that a shell introduces a much broader attack surface than a sandboxed isolate, and Code Mode keeps progressive discovery while executing inside that sandbox.  Do not hand every hosted agent an unrestricted shell.  Do not pretend `bash` is a permissions system.  But also do not bury your operating knowledge in a remote schema wrapper when what you need is a deterministic operation with a contract.

## The vendor cannot build your Tuesday

A vendor can connect GitHub, Jira, Slack, Drive, Salesforce, Kubernetes, AWS, GCP, and Azure, and expose the generic verbs: list, search, create, update, delete, summarize.  That is useful.  It is not enough.

The leverage in a personal agent lives in the local verbs:

- explain the deploy that failed after the autoscaling event
- audit the production account, but include IAM drift and recent security-group changes
- resolve the secret using the local fallback rule, not the cloud default
- summarize only the receipts attached to this client project
- prepare the weekly report in the format I actually use

Those are not marketplace integrations.  They are operating habits.  A vendor cannot know them because they are not product features.  They are the accumulated shape of your work.

That is why the personal toolchain matters.  Not because command lines are noble, not because protocols are bad, and not because every developer should LARP as a platform team of one.

> Because repeated friction is operational knowledge, and operational knowledge should compile.

## Falsify it on your own system

This argument should be testable.  Take ten recurring tasks from your own work, and for each, run four versions: prompt and docs only; MCP or a vendor connector; workflow automation; an owned CLI verb with JSON output.  Then measure the things that actually matter: wall-clock time, tool calls, tokens, manual interventions, wrong-layer debugging, failure-class clarity, whether sensitive data entered model context, and whether a second caller could reuse the result unchanged.

The claim is not that the CLI wins every row.  It should not.  For clean remote CRUD with OAuth and consent, MCP should win.  For scheduled long-running processes with durable state, workflows should win.  For one-off work, raw shell or a vendor UI may win.  For common public tools like `gh`, the model may already know enough that a wrapper adds little.

The claim is narrower and stronger:

> **For repeated, composition-heavy, personally shaped operations, an owned command surface should reduce ambiguity, reduce repeated context, improve reuse across callers, and produce more inspectable failures than prompt-level procedure, thin remote tool wrappers, or workflow nodes that hide the operation.**

What would make this wrong?  If your MCP server, workflow tool, or vendor connector already gives you the same failure contracts, progressive discovery, local-convention handling, cross-caller reuse, data-minimization boundary, testability, and token profile, keep it.  Do not build tools to satisfy an identity.  Build them where the measurements say the operation deserves to exist.

## Start with one operation

Do not start by designing an agent platform.  Start with one operation you already repeat.

Wrap it.  Make it emit JSON.  Give it stable exit codes and honest errors.  Add `--help`.  Add `--dry-run` if it changes state.  Leave a receipt.  Add it to `discover`, and teach the agent that discovery is the first move when it needs a capability.  Then do the next one.

At some point the tool stops being a pile of wrappers and becomes an interface to your machinery.  The agent gets less generic, because the world it can act on is less generic.  It stops guessing how you work and starts using the tools you made from the work itself.

The strongest personal agent will not be the one with the biggest catalog of connectors.  It will be the one with the clearest operations layer.

Own that layer.
