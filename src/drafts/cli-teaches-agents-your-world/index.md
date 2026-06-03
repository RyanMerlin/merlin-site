---
title: "MCP connects agents to the world. Your CLI teaches them your world"
created: "2026-06-02"
status: "draft"
tags: ["agents","cli","mcp","tooling","infrastructure"]
summary: "The fight over MCP versus the command line is the wrong fight. MCP is how capabilities reach an agent; a CLI you own is where your operating knowledge compounds. As agents get personal, the leverage moves to the toolchain that encodes your world."
---

The fight over whether an agent should use MCP or the command line is the wrong fight.  The answer is both, and it is not close.

Use **MCP** when the work is remote: a hosted tool, an OAuth handshake, enterprise governance, user consent, a capability you are shipping to software you do not control.  Use the **command line** when the work is local, composable, already authenticated, and shaped by the way you actually operate.  The protocol debate keeps flattening that distinction into a team sport.

The more useful question is not which interface an agent can call.

> **It is which layer owns the operation.**

Because AI is going to get more personal, not less.  The generic assistant is the boot screen.  The useful one knows your projects, your infrastructure, your repo layout, your secrets flow, your naming conventions, the report shape you actually use, and the exact command you run every time some brittle service lies to you.

A vendor cannot build that.  It can build the average user's average workflow, because that is who it sells to.  Your toolchain is how you build yours.

> MCP is the socket.  Your CLI is the workshop.

## The seam is the product

An expired token comes back as a 404.  A missing secret also comes back as a 404.  So when your agent's credential fetch fails, it spends ten minutes debugging the wrong layer, because the five-line auth dance you pasted into nine scripts cannot tell the two apart.

That is the real texture of agentic tooling.  The model is rarely the bottleneck.  **The seam is.**

Before, every script carries its own little ceremony:

```bash
source .env
TOKEN=$(curl -s -X POST "$AUTH_URL" -d "$AUTH_BODY" | jq -r .access_token)
curl -s "$VAULT_URL/secret/$SECRET_PATH" -H "Authorization: Bearer $TOKEN" | jq -r .data.value
```

There is no contract there.  There is folklore.  Maybe it retries.  Maybe it tells a stale credential apart from missing data.  Maybe the next script copied the fixed version.  Probably not.

After:

```bash
mytool secrets resolve providers/openai/api-key --json
```

That command does the auth, refreshes the token, separates failure classes, returns a stable JSON envelope, and leaves a receipt.  (That secrets layer is its own small build, which I wrote up in [Building first-class secrets management into an AI agent](/posts/building-first-class-secrets-management-into-an-ai-agent).)  The win is not that it is shorter.  **The win is that the operation now exists.**  A human can call it.  An agent can call it.  A cron job can call it.  An MCP wrapper can call it later if that helps.  The operation is no longer trapped in a prompt, a notebook cell, or a vendor connector.  It is part of your surface.

## The discourse already moved

The first wave of MCP enthusiasm was right.  [MCP](https://modelcontextprotocol.io) gave agents a common way to connect at the moment every integration was turning into bespoke glue.  I argued the limit of that wave last week in [The MCP Explosion Has a Scaling Problem](/posts/mcp-explosion-scaling-problem): MCP won the tool layer, but it should not become the default substrate for every operation.  This piece is the other half of that argument, what to build instead.  Then everyone hit the same wall: tool definitions cost context.

[Cloudflare's Code Mode](https://blog.cloudflare.com/code-mode-mcp/) is the cleanest production example.  Their API has more than 2,500 endpoints.  Exposed as native MCP tools, that surface costs 1.17 million tokens.  Code Mode exposes two tools, `search()` and `execute()`, and holds the footprint near a thousand tokens while keeping the whole API reachable.  [Anthropic's engineering team](https://www.anthropic.com/engineering/code-execution-with-mcp) hit it from another angle: present tools as code the agent inspects on demand, and one workflow dropped from 150,000 tokens to 2,000.  Anthropic's own [tool search](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) formalizes the move: defer loading, search the catalog, expand only the three to five tools you need.  Their docs note a multi-server setup can burn roughly 55,000 tokens on definitions before any work happens, and tool search usually cuts that by more than 85 percent.

Notice what that is.  It is not MCP losing.  It is the whole field converging on one move.

> Do not load the world.  Find the next handle.

That move has a name: **progressive discovery.**

![Rolling discovery: the agent lists the catalog, drills into one domain, then loads the full schema for only the verb it is about to run](/diagrams/aria-rolling-discovery.svg)

## The command line already knew this trick

A good CLI does progressive discovery by default, because that is how command-line tools have always worked.

```bash
mytool discover                                          # the top-level domains
mytool discover secrets                                  # drill into one
mytool secrets resolve --help                            # the schema for one verb
mytool secrets resolve providers/openai/api-key --json   # run it
```

The agent never needed the whole surface.  It needed the next breadcrumb.

This is why the command line keeps showing up in the evals.  [Arize ran 500 evaluations](https://arize.com/blog/mcp-vs-cli-skills-for-agents-what-our-eval-found-and-which-you-should-use/) across GitHub tasks using MCP, CLI skills, and bare shell.  Correctness landed in a tight band: MCP at 0.834, the CLI skill at 0.833, a bare-shell baseline at 0.845.  But on the hardest tier, MCP cost more than six times what the skills cost, took about five times longer, and frequently escaped into bash anyway, its tool fidelity falling to 0.33.

That does not make MCP bad.  It means a fixed API surface is often the wrong *shape* for open-ended work.

> An endpoint is a door.  A shell is a workshop.

When the task maps cleanly to an endpoint, MCP wins.  Arize's own run shows branch-and-PR creation going faster through MCP, eight tool calls in thirty-three seconds, because `create_branch` and `create_pull_request` existed as direct tools.  When the task needed composition, grouping, filtering, and computing across messy intermediate data, the agent reached for bash, because bash could express the operation MCP did not have.

The lesson is not to pick a side.  It is to give the agent both, and make the workbench yours.

## A personal agent needs personal tools

The industry is already moving toward personal operating context.  Anthropic's [Agent Skills](https://claude.com/blog/skills), updated in December 2025 as an open standard, package procedural knowledge: build a skill once and use it across Claude apps, Claude Code, and the API, with organization-wide management and a partner directory.

Skills matter because they capture *how* to do a kind of work.  But a skill is not the operation itself.

A skill can say "when resolving a secret, check the provider, refresh the credential, tell an expired token apart from a missing path, and return structured JSON."  That helps.  But if the behavior still lives in prose, the agent reconstructs the operation every time.  A CLI turns the procedure into an executable affordance.

> The skill is the map.  The CLI is the machine.

This is the same reason a house accumulates tools.  You do not buy a drill, a socket set, a pipe wrench, a multimeter, clamps, and labeled bins because you are recreating the hardware store in your garage.  You accumulate them because your house has recurring problems, and each tool preserves a little learned friction.  The odd wrench for the one sink that always leaks is not generic capability.  **It is encoded experience.**  A personal CLI is that, for software.

## The owned surface

The right unit is not an MCP server for every service.  It is an owned command surface over the systems you actually touch.

```bash
mytool infra audit --json
mytool secrets resolve providers/openai/api-key --json
mytool browser capture https://example.com --summary --json
mytool work status --since yesterday --json
mytool report weekly --project aria --json
```

Each command is boring.  That is the point.  The interesting part is what sits behind them: auth policy, retries, rate limits, local conventions, output shape, audit receipts, and the difference between "this failed because you are not logged in" and "this failed because the thing does not exist."

Most people scatter that knowledge across prompts, shell history, notebooks, and READMEs, then ask an agent to infer all of it from context.

> Do not make the model rediscover your operating system every morning.  Wrap the friction.

![One command surface, every caller: a human at a terminal, an agent through its shell, a cron job, and a background service all invoke the same JSON-speaking verb](/diagrams/aria-rs-command-surface.svg)

## The chassis

The upfront work is real.  You need the chassis before the leverage shows up: argument parsing, config loading, secret resolution, structured JSON, a stable error taxonomy, audit receipts, idempotency where actions are destructive, a `--help` that serves humans and agents alike, and `discover` commands that expose the surface a layer at a time.

That is not free.  The first useful command costs more than it feels like it should.  But the chassis changes the economics of every command after it.  Adding a capability stops being "build an integration" and becomes "describe a verb."  A thin wrapper over an API you already use is minutes.  A real new integration is an afternoon.  Once it compiles, it is callable by you, your agent, a timer, a workflow runner, a service, or an MCP bridge.

I used to call this "the hundredth command is free."  That framing is too narrow.

> The hundredth command is not free.  It is prepaid.

You paid for it with the first ninety-nine decisions: one output envelope, one error shape, one discovery pattern, one auth strategy, one audit trail, one binary every caller knows how to invoke.  The compounding is not in the line count.  It is in the surface becoming coherent.

## Where MCP belongs

None of this is anti-MCP.  MCP earns its place for remote tools, for OAuth, for anything you ship to people who should not have to install a binary, mint a token, and wire up shell access.  [Arize](https://arize.com/blog/mcp-vs-cli-skills-for-agents-what-our-eval-found-and-which-you-should-use/) draws the line directly: use the CLI when the work is local, pre-authenticated, and composable; reach for MCP when the tool is remote, proprietary, stateful, or shipped to customers.  [Cloudflare](https://blog.cloudflare.com/code-mode-mcp/) adds the security cut, noting that a shell "introduces a much broader attack surface than a sandboxed isolate," which is a real argument for keeping hosted execution behind a sandbox rather than an open shell.

So the clean architecture is layered, not tribal.  It is the same separation-of-layers instinct behind [The Agent Protocol Stack Has a Runtime Gap](/posts/agent-protocol-stack-runtime-gap), applied one level down, to your own operations.

> The CLI is the owned operations plane.  Skills and docs are the instruction layer.  MCP is the protocol, auth, and distribution plane.

Build the operation once.  Expose it through whatever interface fits the caller: a shell command for your local agent, an MCP server for a hosted one, a scheduled job for a runner, muscle memory for you.  **The source of truth is the operation, not the wrapper.**

## The vendor cannot build your Tuesday

A vendor can connect Jira, GitHub, and Drive, and expose the generic verbs: list, create, search, update, delete.  That is useful.  The leverage in a personal agent lives in the non-average parts:

- Find the deployment that failed after the Ceph rebalance.
- Summarize only the receipts that matter for this project.
- Resolve the secret with the local rule, not the cloud default.
- Audit the node, but include the host and the switch port.
- Write the weekly report in the format I actually use.

Those are not marketplace integrations.  They are operating habits.  The agent does not just need access.  It needs handles shaped like your work.

> Your repeated friction is an asset, and assets should not live in chat history.

## Start with the command you call twice

Do not start by designing an agent platform.  Start with one operation you already repeat.

Wrap it.  Make it emit JSON.  Give it honest errors.  Add `--help`.  Add a receipt if it changes state.  Add it to `discover`.  Teach the agent that `discover` is the first move when it needs a capability.  Then do the next one.

At some point the tool stops being a pile of wrappers and becomes an interface to your machinery.  The agent gets less generic, because the world it can act on is less generic.  It stops guessing how you work and starts using the tools you made out of the work itself.

The strongest personal agent will not be the one with the biggest catalog of connectors.

> It will be the one standing in your workshop.
