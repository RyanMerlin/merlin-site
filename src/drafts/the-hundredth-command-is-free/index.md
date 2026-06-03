---
title: "The Hundredth Command Is Free"
created: "2026-06-02"
status: "draft"
tags: ["agents","cli","mcp","tooling","infrastructure"]
summary: "MCP front-loads tool schemas into context and the bill comes due at scale. The benchmarks now favor a CLI you own with rolling discovery. Here is the mechanism, the numbers, and how the surface compounds."
---

An expired token comes back as a 404.  A missing secret also comes back as a 404.  So when your agent's credential fetch fails, it spends ten minutes debugging the wrong layer, because the five-line auth dance you pasted into nine different scripts cannot tell the two apart.

That is the real texture of wiring agents into systems you already run.  The bottleneck is almost never the model.  It is the seam between the model and everything else.  And the industry's default answer for that seam, a Model Context Protocol server in front of every tool, carries a cost that demos never reach and production hits immediately.

## The bill MCP runs up

The cost is context.  An MCP server has to advertise its tools to the model before the model can call them: names, descriptions, schemas, argument shapes, usage notes.  At ten tools that is invisible.  At an operational surface it is the dominant line item, and the numbers are not subtle.

When Cloudflare measured it, exposing a large API through MCP burned [1.17 million tokens; the same surface reached through generated code against a typed SDK used about a thousand](https://blog.cloudflare.com/code-mode-mcp/).  Anthropic's own engineering team hit the same wall and moved tool calls into code, taking one workflow [from 150,000 tokens to 2,000](https://www.anthropic.com/engineering/code-execution-with-mcp).  Those are not efficiencies at the margin.  They are two and three orders of magnitude.

It is not only tokens.  When Arize ran a controlled [eval of MCP against plain command-line tools](https://arize.com/blog/mcp-vs-cli-skills-for-agents-what-our-eval-found-and-which-you-should-use/) in May 2026, correctness was a statistical tie, 0.834 against 0.833.  But on complex tasks MCP cost roughly six times more, ran about five times slower, and its tool-call fidelity fell to 0.33, meaning the agent abandoned the MCP path and shelled out to bash two times in three.  Jannik Reinhard's [February 2026 benchmark](https://jannikreinhard.com/2026/02/22/why-cli-tools-are-beating-mcp-for-ai-agents/) is sharper still: up to 35 times fewer tokens for the CLI approach, with reliability moving from about 72 percent to 100 percent on the same work.

There is a reason the command line keeps winning these tests, and it is not nostalgia.  The model was trained on billions of lines of terminal interaction: shell sessions, man pages, Stack Overflow answers, READMEs.  A clean command sits inside that training distribution.  A bespoke MCP schema sits outside it.  You are not teaching the model a new interface.  You are handing it the one it already knows cold.

## Rolling discovery, not upfront loading

The expensive thing MCP does is front-load discovery.  The server announces everything it can do at initialization, and that announcement occupies context whether or not the agent ever touches those tools.

The fix the whole field is converging on is rolling discovery: find capabilities on demand, and only drill in where you are actually going.  Anthropic shipped exactly this for MCP itself in Claude Code 2.1.7 with [tool search and deferred loading](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool), which keeps tool definitions out of context until a lightweight index says they are relevant.  It cut a fifty-tool setup by roughly 85 percent and pushed tool-selection accuracy from 79.5 to 88.1 percent on Opus 4.5.  Progressive disclosure is now the default, not the workaround.

![Rolling discovery: the agent lists the catalog, drills into one domain, then loads the full schema for only the verb it is about to run](/diagrams/aria-rolling-discovery.svg)

A command-line tool does this natively, because it is how command-line tools have always worked.  The agent does not need every verb in context.  It needs three cheap calls, each pulling only what the next step requires:

```bash
mytool capabilities                 # the catalog: every domain, one line each
mytool capabilities --tag secrets   # drill into one domain
mytool secrets resolve --help       # full schema for the one verb it is about to run
```

The catalog is a few hundred tokens.  The schema for a single verb is a few hundred more.  The agent never pays for the two hundred operations it is not using on this task.  That is the same move as MCP tool search, except you did not need a protocol, an index server, or a context-budget heuristic to get it.  You needed a binary that prints its own help.

## One verb, every caller

Here is the credential fetch, before and after, because it is the example everyone recognizes.

Before, in every script that needs a secret:

```bash
source .env
TOKEN=$(curl -s -X POST "$AUTH_URL" -d "$AUTH_BODY" | jq -r .access_token)
curl -s "$VAULT_URL/secret/$SECRET_PATH" -H "Authorization: Bearer $TOKEN" | jq -r .data.value
```

Three commands of ceremony, copied everywhere, wrong about half the time, with the 404 failure mode that sends you debugging the wrong layer.

After:

```bash
mytool secrets resolve providers/openai/api-key
```

The auth, the token refresh, the retry on a stale token, the parsing, all of it moved inside the binary once and never came back out.  The win is not the line count.  The win is the output contract: the command returns JSON on stdout.

That is the one shape a human at a terminal, an agent through its shell, a cron job, and a background service all read natively.  Most tools are built for exactly one of those callers.  A GUI is for a person.  An SDK is for code.  A webhook is for a service.  Pick a capability and you usually end up building it two or three times in two or three shapes.  A JSON-speaking CLI is written once and is simultaneously a human command, an agent tool, a cron task, and a service primitive.  That single property, one verb every caller invokes identically, is what lets an agent operate a system end to end with no hand-built adapter for each piece.

![One command surface, every caller: a human at a terminal, an agent through its shell, a cron job, and a background service all invoke the same JSON-speaking verb](/diagrams/aria-rs-command-surface.svg)

## Why the hundredth command is free

The expensive part is the chassis, and you build it exactly once: argument parsing, config loading, secret resolution, a consistent JSON envelope, and error handling that does not return the same 404 for two different failures.

After that, adding a capability is not "build a tool."  It is "describe a verb."  Four steps: declare the verb and its flags, write a handler that calls the underlying API or shell, return the JSON envelope every other command already uses, rebuild and ship the one binary.  A thin wrapper over an API you already hold keys for is minutes.  A genuinely new integration is an afternoon.  The moment it compiles it is callable by everything, you and the agent and the timer and the service, with no per-caller integration step, ever.

That is the compounding.  The first command is expensive because you are paying for the frame.  The hundredth is nearly free because you are adding a seat to a frame that already holds.  The marginal cost of a new capability falls as the surface grows, which is the exact inverse of a folder of one-off scripts, where the tenth script makes the eleventh harder to find and the whole drawer slowly rots.

## The catch, stated honestly

This is not free advice.  You have to be able to build the binary, and the chassis is real work before any leverage shows up.  Discovery is a real weakness too: a vendor tool announces itself, and yours does not, until you give it the `capabilities` verb to announce itself.  So you build that, and the discovery cost does not vanish, it moves to where you control it and where it stays cheap.

This is also not the platform-engineering argument in disguise.  When a platform team standardizes tooling across a few hundred engineers, buying the managed thing is often correct.  This is the other end of the spectrum: one operator, one surface, tuned to the exact friction a vendor cannot see, because a vendor optimizes for the average user's average task.  That asymmetry is the whole point.  A vendor cannot build for your Tuesday.  You can.

## Where it goes

The protocol layer is moving the same direction.  MCP's own [2026 roadmap](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/) prioritizes a stateless core and on-demand discovery, which is the spec quietly conceding that front-loading does not scale.  The convergence is real, and it is recent: Anthropic, Cloudflare, and the eval data all point at the same conclusion, generate calls against a stable typed interface instead of stuffing schemas into context.

A CLI you own is the most boring and most durable version of that interface.  And once every capability is a uniform verb that anything can invoke the same way, one agent was never the natural endpoint.  A fleet is, because they all reach for the same surface and nothing gets rebuilt per agent.

But you do not need a fleet to start, and you should not wait for one.  You need one command you call more than once.  Wrap it.  Add the next one tomorrow.  In a year you will own the most valuable tool you have, and the only way to get it was to build it.
