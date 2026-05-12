<script context="module">
  export const metadata = {
    title: "The coordination tax: what we got wrong about multi-agent systems",
    created: "2026-04-28",
    status: "published",
    tags: ["agents", "architecture", "missioncontrol"],
    summary: "Multi-agent systems don't fail because the agents are stupid. They fail because the coordination cost wasn't budgeted for."
  };
</script>

Multi-agent systems don't fail because the agents are stupid. The models are good. The tools work. The individual agent, given a well-scoped task and clean context, will produce reasonable output most of the time.

They fail because the coordination cost wasn't budgeted for.

Specifically: nobody planned for identity, overlap, governance, or audit. These aren't features you add later. They're taxes that compound silently until you get an incident, and then you pay them retroactively and expensively.

---

## The swarm failure mode

Five agents, all with write access to the same repository. No shared state about who's working on what. Each agent gets a task from the coordinator, picks a file, starts editing.

Two agents pick the same file. They both complete their edits. One commits first; the other's diff applies on top of a state it was never written against. If you're lucky, the merge fails noisily. If you're not, both changes land and one silently overwrites context the other was relying on.

Meanwhile, agents three and four are working on adjacent modules. Neither knows the interface they're coding to has just changed in a commit they haven't seen yet. The build breaks an hour later. The coordinator asks each agent what it changed. Each one reports its own work as complete and correct. None of them are wrong, from their own context window.

This is the swarm failure mode. It's not a model failure. It's a systems failure — the absence of coordination primitives that prevent concurrent agents from stepping on each other.

---

## The four taxes

**Identity.** Every action needs to be attributable to a stable principal — not a session UUID that changes on restart, not an anonymous caller that your database quietly filters as an empty result set. In MissionControl, every agent carries a `public_id` of the form `{name}-{8hex}` — readable, stable, and preserved across crashes and restarts. When an agent creates a task or publishes an artifact, the ownership record survives the session that created it. This sounds obvious until you've debugged a ghost-row problem caused by re-registration creating a new identity instead of updating the existing one.

**Overlap.** Before a task or artifact is created, run a similarity check against existing state. Fuzzy matching catches identical intent with different wording. Vector search catches semantic overlap across different domains. Return the results to the agent before the creation completes. The agent decides — proceed, merge, discard. This check costs ~40ms. Not running it costs the time of two agents completing duplicate work and a human reconciling the results.

**Governance.** Sensitive mutations need an approval path. Not every mutation — creating a task doesn't need a sign-off, but publishing an artifact to the Git record of record should. The governance model is versioned (`draft → active → rollback`), mission-scoped (different missions can have different approval requirements), and enforced at the API boundary with HMAC-signed approval tokens. The point is not bureaucracy. The point is that "the agent did it" is not an audit trail. "The agent requested it, it was approved by this principal at this timestamp, and here is the cryptographic token proving it" is an audit trail.

**Audit.** The artifact ledger records every significant mutation in Postgres — what changed, who changed it, which session, which mission, which kluster. When a mutation is approved and published, it commits to Git with provenance metadata: repo, branch, path, commit hash, back-referenced in Postgres. The full chain of custody is preserved at every layer. This is not optional infrastructure for AI-driven systems. It is the minimum bar for operating agents in any context where the mutations have real consequences.

---

## The temptation to skip each of these

Identity: "we'll just use session IDs, it's fine." It's fine until you have ghost rows in your agent table and you don't know which ones represent real running agents and which are dead sessions from three days ago.

Overlap: "the agents are smart enough to check for existing work." They're not. Not without being explicitly given a tool that returns existing state and prompted to use it before creating new work. Even then, the check needs to be fast and structural, not "ask the model to remember what it's seen."

Governance: "we trust the agents." You trust the agents to do what they're instructed to do. You don't trust the instructions to be correct in every edge case, the context to be complete, or the model to not hallucinate a detail about an artifact it's publishing. The approval gate is for the cases where the agent is confidently wrong.

Audit: "we can see what happened from the Git history." You can see what was committed. You can't see who instructed which agent to make which change, in which session, with what context, approved by whom. The Git history is the outcome. The audit trail is the causal record.

---

## Why this isn't enterprise-grade paint

The framing I want to avoid: "you need governance for enterprise deployments." That makes it sound like small teams don't need this, which is wrong.

You need these primitives the moment you have more than one agent touching shared state. That threshold is lower than you think. Two agents writing to the same codebase need overlap detection. A single agent with the ability to publish artifacts needs an approval path. Any system that runs agents on a schedule needs a stable identity model so you can tell which run produced which output.

The coordination tax doesn't scale with organization size. It scales with the number of agents touching shared state and the consequence of errors. A solo developer running six persistent agents against shared infrastructure hits all four of these requirements — identity, overlap, governance, audit — because the infrastructure is real and the mutations have real effects.

---

Building agent systems without coordination primitives is like building a database without transactions. You can do it. Things will appear to work. Until two concurrent writes corrupt state you can't recover, and you spend a week figuring out which "commit" to trust.

The next piece in this series: [Persistent sessions are the unit of agent work, not requests](/posts/2026-05-05-persistent-sessions-unit-of-agent-work) — why treating a model call as an RPC is the wrong abstraction for long-running agents, and what the supervisor loop actually looks like.
