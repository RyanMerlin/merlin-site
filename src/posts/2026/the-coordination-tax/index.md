<script context="module">
  export const metadata = {
    title: "The Coordination Tax",
    created: "2026-04-28",
    status: "published",
    tags: ["agents", "edgeplane", "coordination", "multi-agent", "architecture"],
    summary: "Multi-agent systems don't fail because the agents are stupid. They fail because the coordination cost wasn't budgeted for. Identity, overlap, governance, and audit are taxes that compound silently until you get an incident."
  };
</script>

Multi-agent systems don't fail because the agents are stupid.  The models are good.  The tools work.  The individual agent, given a well-scoped task and clean context, will produce reasonable output most of the time.

They fail because the *coordination cost* wasn't budgeted for.

> Specifically: nobody planned for identity, overlap, governance, or audit. These aren't features you add later. They're taxes that compound silently until you get an incident, and then you pay them retroactively and expensively.

---

## The swarm failure mode

Five agents, all with write access to the same repository.  No shared state about who's working on what.  Each agent gets a task from the coordinator, picks a file, starts editing.

Two agents pick the same file.  They both complete their edits.  One commits first; the other's diff applies on top of a state it was never written against.  If you're lucky, the merge fails noisily.  If you're not, both changes land and one silently overwrites context the other was relying on.

Meanwhile, agents three and four are working on adjacent modules.  Neither knows the interface they're coding to has just changed in a commit they haven't seen yet.  The build breaks an hour later.  The coordinator asks each agent what it changed.  Each one reports its own work as complete and correct.  None of them are wrong, from their own context window.

**This is the swarm failure mode, and it is a systems failure, not a model failure.**  It is the absence of *coordination primitives* that prevent concurrent agents from stepping on each other.

---

## The four taxes

**Identity tax: every action must be attributable to a stable principal.**  Not a session UUID that changes on restart, not an anonymous caller that your database quietly filters as an empty result set.  In [EdgePlane](https://github.com/RyanMerlin/edgeplane), every agent carries a `public_id` of the form `{name}-{8hex}`, readable, stable, and preserved across crashes and restarts.  When an agent creates a task or publishes an artifact, the ownership record survives the session that created it.  This sounds obvious until you've debugged a ghost-row problem caused by re-registration creating a new identity instead of updating the existing one.

**Overlap tax: before creating a task or artifact, check whether it already exists.**  Fuzzy matching catches identical intent with different wording.  Vector search catches semantic overlap across different domains.  Return the results to the agent before the creation completes.  The agent decides: proceed, merge, or discard.  This check costs ~40ms.  Not running it costs the time of two agents completing duplicate work and a human reconciling the results.[^overlap]

**Governance tax: sensitive mutations need an approval path.**  Not every mutation: creating a task doesn't need a sign-off, but publishing an artifact to the Git record of record should.  The governance model is versioned (`draft → active → rollback`), mission-scoped (different missions can have different approval requirements), and enforced at the API boundary with HMAC-signed approval tokens.  The point is not bureaucracy.  *"The agent requested it, it was approved by this principal at this timestamp, and here is the cryptographic token proving it"* is an audit trail.  "The agent did it" is not.

**Audit tax: record every significant mutation.**  The *artifact ledger* records in Postgres what changed, who changed it, which session, which mission, which kluster.  When a mutation is approved and published, it commits to Git with provenance metadata: repo, branch, path, commit hash, back-referenced in Postgres.  The full chain of custody is preserved at every layer.  **This is not optional infrastructure for AI-driven systems.**  It is the minimum bar for operating agents in any context where the mutations have real consequences.

---

## The temptation to skip each of these

Identity: "we'll just use session IDs, it's fine."  It's fine until you have ghost rows in your agent table and you don't know which ones represent real running agents and which are dead sessions from three days ago.

Overlap: "the agents are smart enough to check for existing work."  They're not.  Not without being explicitly given a tool that returns existing state and prompted to use it before creating new work.  Even then, the check needs to be fast and structural, not "ask the model to remember what it's seen."

Governance: "we trust the agents."  You trust the agents to do what they're instructed to do.  You don't trust the instructions to be correct in every edge case, the context to be complete, or the model to not hallucinate a detail about an artifact it's publishing.  *The approval gate is for the cases where the agent is confidently wrong.*

Audit: "we can see what happened from the Git history."  You can see what was committed.  You can't see who instructed which agent to make which change, in which session, with what context, approved by whom.  The Git history is the outcome.  *The audit trail is the causal record.*

---

## The protocol context

This isn't an isolated problem.  The agentic AI ecosystem has spent the last year building out the communication layer, and it's impressive work.  *[MCP](https://modelcontextprotocol.io)* (Model Context Protocol, [now under the Agentic AI Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)) crossed [97 million monthly SDK downloads](https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/) and became the de facto standard for connecting agents to tools and data.  Google's *[A2A](https://a2a-protocol.org/latest/announcing-1.0/)* (Agent-to-Agent protocol, [v1.0 released March 2026](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)) handles cross-agent task delegation.  IBM's *[ACP](https://research.ibm.com/projects/agent-communication-protocol)* (Agent Communication Protocol) tackled async agent messaging.  *[AGNTCY](https://agntcy.org/)* built out the Internet of Agents infrastructure stack.  [Microsoft's Agent Framework 1.0](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/) shipped production-grade multi-agent orchestration with first-class MCP and A2A support.

> All of this handles how agents communicate. None of it handles what happens when the thing they're communicating about is shared mutable state.

That gap is the coordination tax.  The protocols define the wire format.  They don't define who owns the file, whether two agents are working on the same thing, who approved the publish, or where to look when something goes wrong.

---

## Why this isn't enterprise-grade paint

The framing I want to avoid: "you need governance for enterprise deployments."  That makes it sound like small teams don't need this, which is wrong.

**You need these primitives the moment you have more than one agent touching shared state.**  That threshold is lower than you think:

- Two agents writing to the same codebase need overlap detection
- A single agent with the ability to publish artifacts needs an approval path
- Any system that runs agents on a schedule needs a stable identity model so you can tell which run produced which output

The coordination tax doesn't scale with organization size.  It scales with the number of agents touching shared state and the consequence of errors.  A solo developer running six persistent agents against shared infrastructure hits all four of these requirements (identity, overlap, governance, audit) because the infrastructure is real and the mutations have real effects.

---

Building agent systems without coordination primitives is like building a database without transactions.  You can do it.  Things will appear to work.  Until two concurrent writes corrupt state you can't recover, and you spend a week figuring out which "commit" to trust.

The next piece in this series: [Persistent sessions are the unit of agent work, not requests](https://ryanmerlin.com/posts/2026-05-05-persistent-sessions-unit-of-agent-work).  Why treating a model call as an RPC is the wrong abstraction for long-running agents, and what the supervisor loop actually looks like.

---

## References

[^overlap]: Recent benchmarking on multi-agent coordination overhead documents that token duplication and duplicate work create inefficiencies of 53–86% across major multi-agent frameworks when coordination primitives are absent. See [Silo-Bench: A Scalable Environment for Evaluating Distributed Coordination in Multi-Agent LLM Systems](https://arxiv.org/pdf/2603.01045) (2026) and [When Coordination Is Avoidable: A Monotonicity Analysis of Organizational Tasks](https://arxiv.org/pdf/2602.18673) (2026).

1. [Introducing the Model Context Protocol (Anthropic)](https://www.anthropic.com/news/model-context-protocol)
2. [MCP joins the Agentic AI Foundation (Model Context Protocol Blog)](https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/)
3. [Linux Foundation Announces the Formation of the Agentic AI Foundation (AAIF)](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)
4. [Announcing Version 1.0 (A2A Protocol)](https://a2a-protocol.org/latest/announcing-1.0/)
5. [A2A: A New Era of Agent Interoperability (Google Developers Blog)](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)
6. [Agent Communication Protocol (IBM Research)](https://research.ibm.com/projects/agent-communication-protocol)
7. [AGNTCY: Internet of Agents](https://agntcy.org/)
8. [Agent Connect Protocol Specification (AGNTCY)](https://spec.acp.agntcy.org/)
9. [Microsoft Agent Framework Version 1.0](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/)
10. [Silo-Bench: Evaluating Distributed Coordination in Multi-Agent LLM Systems](https://arxiv.org/pdf/2603.01045) (arXiv 2026)
11. [When Coordination Is Avoidable: A Monotonicity Analysis of Organizational Tasks](https://arxiv.org/pdf/2602.18673) (arXiv 2026)
