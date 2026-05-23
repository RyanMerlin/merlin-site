<script context="module">
  export const metadata = {
    title: "The Aria fleet: six agents, one operator",
    created: "2026-04-21",
    status: "published",
    tags: ["agents", "edgeplane", "infrastructure", "aria"],
    summary: "Six persistent Claude Code sessions, scoped to different domains, coordinating through EdgePlane. Here's what it looks like in practice."
  };
</script>

The most common question I get about EdgePlane isn't about the architecture. It's "what does it actually look like to run it?" Fair question. So here's the concrete answer: what I'm running, how it's wired, what it replaced, and what the migration to a proper control plane looks like from the inside.

---

## The cast

Six agents, each a persistent Claude Code session, each scoped to a specific domain:

**aria-operator** — the meta-orchestrator. Routes incoming requests to the right profile, manages cross-agent coordination, runs the morning briefing workflow. The one agent that needs to know what all the others are doing.

**aria-research** — market research, sector analysis, technical investigation. When operator gets a question that needs deep search and synthesis, it delegates here.

**aria-work** — client engagements, professional deliverables, anything touching active project work. Scoped deliberately so it can't accidentally reach infrastructure it shouldn't touch.

**aria-merlinlabs** — homelab and Kubernetes infrastructure. Knows about the RKE2 cluster, ArgoCD app state, Helm values, the Tailscale mesh. The only profile with kubectl access.

**aria-engineer** — EdgePlane itself. Writes the code, reviews the architecture, runs tests. The agent currently responsible for most of what you're reading about.

**aria-publisher** — this profile. Handles the writing, research, editorial pipeline, and social distribution. Published this post.

Each profile lives at `profiles/<name>/` in the Aria repo, with its own `CLAUDE.md` defining identity and operational context, its own skills directory, and its own memory layout. The profiles are distinct operating contexts — not just different system prompts, but different tool access, different MCP server connections, and different knowledge domains loaded at startup.

---

## How they're wired

Every agent registers with EdgePlane on startup. The control plane at `edgeplane:8008` is the shared system of record: tasks, artifacts, cross-agent messages, governance state.

Agents interact with EdgePlane through the `edgeplane` CLI and MCP tool calls — `search_tasks`, `create_task`, `send_mesh_message`, `get_overlap_suggestions`.

Cross-profile coordination flows through the agentmessage table. If aria-operator needs aria-research to investigate something, it sends a mesh message with the prompt. The research agent picks it up on its next inbox poll, runs the work, and responds. Operator sees the response without polling anything — the response lands as an inbound message it can query.

For time-triggered work, systemd timers fire into the fleet. The morning briefing runs at 6am: `aria-briefing.timer` fires, the current dispatch calls into the operator profile with a structured prompt, and the operator runs the `/briefing` skill. This is the same pattern for weekly analysis runs and scheduled maintenance checks.

---

## What it's running on

One machine: excalibur, an AMD Ryzen workstation running Ubuntu. One PostgreSQL instance (with pgvector). One EdgePlane control plane container. Tailscale for remote access and inter-service mesh. RustFS for S3-compatible object storage.

The agents run as systemd user services, each with a dedicated tmux session keeping the Claude process alive across SSH disconnects. Each profile has a `launch.sh` that does the obvious thing: a `while true` loop that starts the Claude process, catches the exit, and restarts after a short backoff.

That last paragraph is temporary. The `launch.sh` files are exactly what `edgeplaned` is designed to replace — and the replacement is underway.

---

## The migration

Today: each Aria profile runs as a Claude process inside a named tmux session. Merlin can `tmux attach -t aria-operator` to see what the operator is doing. Time-triggered prompts arrive via `aria-trigger.sh`, which sends keys into the tmux session. It works. It's also the wrong layer.

tmux is a session multiplexer. It's not a process supervisor, it has no structured event stream, it can't relay a conversation over an authenticated network connection, and "see what the agent is doing" means attaching a terminal and reading raw output. There's no structured representation of the conversation — which assistant turn is in progress, which tool call just ran, what the current pending permission request is.

`edgeplaned` owns what tmux is doing today, but properly. The node daemon runs on excalibur, registers all six profiles from the fleet profile config, and manages their lifecycle. Each agent becomes a `claude-code-acp` child process — spawned by the supervisor, with the `CLAUDECODE` and `CLAUDE_CODE_*` env vars stripped (they trigger auto-detection behavior in the child that conflicts with the ACP protocol), restarted on crash with exponential backoff (1 second, doubling to 60 second ceiling, reset after 30 seconds of stability).

ACP (Agent Client Protocol) is the transport. Instead of raw stdout bytes, the agent emits structured JSON-RPC events: `session/update` with typed payloads for assistant turns, tool calls, tool results, permission requests. The supervisor fans these out to a replay broadcast channel — any viewer that attaches mid-session gets the last 200 events as backscroll, then the live stream. No duplicate frames, no missed frames. The web UI renders these as a structured conversation, not a terminal emulator.

Prompting into a running session — what `aria-trigger.sh` does today with tmux send-keys — becomes `edgeplane signal <agent-id> --content "..."`. The signal arrives at the supervisor, which renders it as `session/prompt` into the ACP session. The agent responds. The response streams back to any attached viewers and lands in the replay buffer for future viewers.

When the migration is complete: `tmux list-sessions` returns nothing that `edgeplaned` didn't put there. `launch.sh` files are inert. The morning briefing fires from a cron job into `edgeplane signal aria-operator --content "..."`, the same as it did before but through a proper supervisor instead of a shell script with a sleep loop.

---

## What this actually gives you

Agents that survive infrastructure events without human intervention. If excalibur reboots, mc-mesh comes back up as a systemd service and restarts all six profiles automatically. No SSH session, no manual tmux attach, no checking which ones came back and which ones need a nudge.

A unified inbox. Any agent can query the agentmessage table for its inbound messages. Cross-profile coordination doesn't require operator to maintain a mental model of which terminal window belongs to which agent.

State that's searchable. Every task, every artifact, every cross-agent message is in Postgres — vector-indexed and queryable. "What was aria-research working on last Tuesday" is a query, not a session archaeology problem.

Remote access that doesn't require SSH. The EdgePlane control plane web UI at `edgeplane:8008` connects to whichever node is running the agent and renders the live conversation. From Boulder, you can watch an agent running on a machine in another location, send it a steering prompt, and close the tab without interrupting the session.

---

## The honest part

This is one machine, six agents, one human operator. The architecture is designed for much larger deployments — multiple nodes, multiple operators, mission-scoped governance for teams. The current deployment doesn't need most of that.

What it does need is exactly what's running: durable task ownership, overlap detection before parallel work, persistent sessions that survive crashes, and a structured way to move work between profiles. Those primitives are what the fleet runs on today, and they'd be the same primitives at ten times the scale.

The next piece in this series goes into the persistent session architecture directly — the supervisor loop, the ACP relay design, and why treating agent sessions as requests (as every other platform does today) is the wrong model.
