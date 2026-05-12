<script context="module">
  export const metadata = {
    title: "Persistent sessions are the unit of agent work, not requests",
    created: "2026-05-05",
    status: "published",
    tags: ["agents", "architecture", "missioncontrol", "rust"],
    summary: "Every agent platform shipping today treats a model call as a request — short-lived, stateless, RPC. Real agents have memory, in-flight tool calls, and partial plans. The request model makes you rebuild context on every call. Sessions are the unit."
  };
</script>

Every agent platform shipping today treats a model call as a request. You send a prompt, you get a response, the interaction is over. The platform might maintain conversation history across calls, but the agent itself is stateless — it doesn't exist between calls. There's no process running. There's no session. There's a function that gets invoked.

This works for simple use cases. It's the wrong model for agents that do real work.

---

## The request model and its tax

An agent handling a multi-step engineering task needs working context: what files it's already read, what plan it's executing, what tool calls are in flight, what it's learned about the codebase so far. In the request model, all of this has to be rebuilt on every call — either by loading it from external storage, summarizing previous turns into the context window, or re-running the tools that produced the original findings.

The tax compounds at fleet scale. Six agents, each making multiple tool calls per turn, each reconstructing context at the start of each invocation, each writing intermediate state somewhere and reading it back. The overhead is not just latency — it's brittleness. Any state that has to be serialized, transmitted, and deserialized is state that can be lost, corrupted, or desynchronized.

The alternative is to keep the agent process alive. One process, one session, one continuous stream of context. Tool call results accumulate in the agent's native memory. Plans persist across turns without serialization. The agent's working state exists in the process, not in a database table that gets reconstructed on every invocation.

---

## What a persistent session lets you do

Live attach. You open a browser tab, navigate to the agent's conversation pane, and you're watching the session that's been running for six hours. Not a replay. Not a log tail. The actual live stream of what the agent is doing right now — which assistant turn is in progress, which tool call just completed, what the current output looks like.

Steering mid-flight. The agent is in the middle of a research pass. You notice it's heading toward a dead end. You type a prompt into the conversation pane. The prompt is injected into the running session — the agent receives it as a `session/prompt` ACP call, processes it, and adjusts course. You didn't kill and restart the process. You didn't lose the working context. You steered.

Crash recovery without context loss. The agent process dies — hardware issue, OOM, model timeout. The supervisor restarts it. The session resumes from the last checkpoint the ACP protocol recorded. You lose at most the current in-progress turn, not the entire working context of the session.

Permission flow without polling. The agent hits a tool call that requires your approval. In the request model, your only option is to poll an endpoint until the approval state changes. In a persistent session, the supervisor surfaces the permission request as a typed event in the conversation stream — you see it in the web UI, click approve or deny, and the agent receives the result and continues.

---

## The supervisor

In MissionControl's `mc-mesh`, the persistent session supervisor lives in `acp_session_supervisor.rs`. The outer loop is straightforward:

```rust
pub async fn run_for_agent(cfg: AcpSupervisorConfig, registry: Arc<AttachRegistry>) {
    let mut backoff = BACKOFF_MIN;  // 1 second
    loop {
        let started = Instant::now();
        match run_one_session(&cfg, &registry).await {
            Ok(()) => { /* clean exit */ }
            Err(e) => { /* log crash */ }
        }
        if started.elapsed() >= STABLE_THRESHOLD {  // 30 seconds
            backoff = BACKOFF_MIN;  // reset on stable run
        }
        tokio::time::sleep(backoff).await;
        backoff = (backoff * 2).min(BACKOFF_MAX);  // 1s → 2s → 4s → ... → 60s ceiling
    }
}
```

Crash restart with exponential backoff: 1 second, doubling to a 60-second ceiling. A session that runs for at least 30 seconds before crashing resets the backoff — the assumption being that something about the current state is triggering the crash, and the backoff prevents a tight restart loop from hammering the model API while the supervisor is catching fire.

The child process is `claude-code-acp` — the ACP-speaking variant of Claude Code. One important runtime detail: `CLAUDECODE` and `CLAUDE_CODE_*` env vars must be stripped from the child environment before spawning. If they're present, the child auto-detects the parent process and changes its behavior in ways that conflict with the ACP protocol. The supervisor handles this in `SpawnOpts`.

Signals arrive at the supervisor via an mpsc channel and get translated to ACP calls:

- `AgentSignal::UserInput` → `session/prompt`
- `AgentSignal::PeerMessage` → `session/prompt` with a `[PEER MESSAGE from {agent_id}]` prefix
- `AgentSignal::Cancel` → `session/cancel`

This is how `mc signal <agent-id> --content "..."` works. The CLI creates an `AgentSignal::UserInput`, pushes it to the agent's signal channel, and the supervisor renders it as a `session/prompt` call into the running ACP session. The old approach was `tmux send-keys` — writing bytes into a terminal session and hoping the process interpreted them correctly. The signal path is typed and explicit.

---

## The attach problem

When a new viewer connects to a running session, they should see recent context and the live stream — but never the same frame twice.

The naive solutions both fail. Subscribe first, then snapshot: you miss any events that arrived between subscribe and snapshot. Snapshot first, then subscribe: you duplicate any events that arrived between snapshot and subscribe.

`ReplayBroadcast<T>` in `replay_broadcast.rs` solves this with a 174-line primitive: a bounded ring buffer fronting a `tokio::sync::broadcast::Sender`, where `send` and `subscribe_with_replay` both take the same lock. The guarantee is that a notification is either in the snapshot a viewer just received, or delivered live on the broadcast channel after they subscribed — never both.

```rust
pub fn subscribe_with_replay(&self) -> (Vec<T>, broadcast::Receiver<T>) {
    let inner = self.inner.lock().expect("replay_broadcast lock");
    let rx = inner.tx.subscribe();
    let snapshot: Vec<T> = inner.buf.iter().cloned().collect();
    (snapshot, rx)
}
```

The supervisor holds a `ReplayBroadcast<SessionNotification>` with a capacity of 200 events. A viewer that attaches mid-session gets those 200 events as backscroll, then the live stream. The 200-event buffer is tuned to "enough to make a refresh look continuous at human-typing cadence" — not a complete session transcript. Full history from session start requires ACP session resume on the agent side, which is a separate concern.

---

## The relay

The supervisor runs on the node where the agent process lives. The viewer might be connecting from a different machine entirely. The relay path is:

```
Browser (Boulder)
  ↕ WebSocket (JSON-RPC frames)
mc-controlplane
  GET /runtime/nodes/{node_id}/agents/{agent_id}/attach
  → upgrades to WebSocket → forwards frames to the node
  ↕
mc-mesh (excalibur)
  attach_ws server
  ↕ ACP client handle held by the supervisor
```

Because ACP is JSON-RPC over text frames — not a binary terminal stream — the controlplane relay is a straightforward frame pump. No SIGWINCH, no terminal geometry, no escape-sequence handling. The decision to use ACP instead of raw PTY output eliminates the hardest parts of the remote attach problem. `xterm.js` was explicitly considered and rejected: it would have made the relay work but turned the web UI into a terminal emulator instead of a structured conversation pane. The web UI renders typed events — assistant turns as text, tool calls as cards with status indicators, permission requests as inline approve/deny affordances.

---

## When requests are still right

One-shot codegen. Single-tool retrieval. Batch classification runs where you want stateless, parallelizable, restartable invocations. The request model is correct for these. Both modes exist in MissionControl — `session_mode: task` runs the current `claude -p` headless path, `session_mode: persistent` runs the ACP supervisor. They coexist in the same `mc-mesh.yaml` config; routing is per agent.

The distinction is not about whether the model is capable. It's about what the agent is doing. If it's completing a discrete task in a single turn and moving on, use a request. If it's doing extended work with memory, tool state, and a human who might want to steer it mid-flight, use a session.

---

The session supervisor code is at `integrations/mc-mesh/crates/mc-mesh/src/acp_session_supervisor.rs` and `replay_broadcast.rs` in the [MissionControl repo](https://github.com/RyanMerlin/missioncontrol). The next piece in this series goes into the authentication architecture — specifically, what "anonymous is not a principal" means and the failure mode it was built to prevent.
