---
title: "Evidence — MCP Dropped Sessions"
created: "2026-06-22"
type: evidence
slug: "mcp-dropped-sessions"
---

# Evidence / Provenance — "MCP Dropped Sessions"

## Decision log
- Origin: drafted first as a LinkedIn timely-take during the 2026-06-22 weekly social slate. Merlin reviewed, asked whether it should also be a blog post. Decision: promote to canonical blog post (depth warrants 900+ words); demote LinkedIn to a hook linking the canonical URL.
- Angle fork: the obvious read is "MCP removing sessions contradicts the persistent-sessions thesis." Rejected the obvious read; the sharper, defensible angle is the transport-session vs agent-session distinction, where stateless MCP *confirms* the thesis. This is the non-obvious framing that earns the post.
- Metaphor choice: web-tier "went stateless 20 years ago / sticky LB was debt / push state to a dedicated store." Chosen because it is structurally accurate (transport affinity vs durable state store maps cleanly onto tool-transport vs agent-runtime) and lands with a practitioner audience. Rejected softer human-relationship metaphors as less precise.
- Citation style: inline hyperlinks only, no bottom Sources section (per Merlin's 2026-06-22 instruction + standing citations rule). LinkedIn hook carries one canonical link to this post.

## Research subagents launched (2026-06-22)
1. **HN / discourse scout** (general-purpose) — mandate: this week's AI-infra discourse from HN front page + Algolia. Key relevant finding for this post: the recurring "MCP context cost / is MCP dead" debate and the individual-vs-enterprise schism; confirmed MCP remains the dominant tool-connectivity layer. Verdict: useful context, not the spine.
2. **MCP / framework release scout** (general-purpose) — mandate: recent MCP/agent-framework/runtime releases, primary sources. PRIMARY SOURCE for this post: the 2026-07-28 MCP release candidate (stateless core, removed initialize handshake + Mcp-Session-Id, inline _meta, tasks extension promoted) and the Python SDK v2.0.0a2 / v1.28.0 releases dated June 16, 2026. Verdict: spine of the post.
3. **X / nitter voices scout** (general-purpose) — mandate: key practitioner takes this week. Relevant: swyx reviving the MCP debate at AI Engineer World's Fair (confirms the protocol's design is live-contested). Verdict: supporting color, not cited inline to keep the piece tight.

## Validated sources
| Source | What it supports | Date | Note |
|--------|------------------|------|------|
| MCP 2026-07-28 release candidate — blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/ | Stateless core, removed handshake + Mcp-Session-Id, inline capabilities, tasks extension | RC announced 2026-05-21 | Primary spec source; "largest revision since launch" |
| MCP Python SDK releases — github.com/modelcontextprotocol/python-sdk/releases | SDK shipped tracking the RC | 2026-06-16 (v2.0.0a2 / v1.28.0) | Confirms direction is real, not theoretical |
| Persistent sessions are the unit of agent work — ryanmerlin.com/posts/persistent-sessions-unit-of-agent-work | The thesis the post reframes against | 2026-05-05 | Author's own prior post |

## Adversarial check
- Claim risk: "MCP removed sessions" could be overstated. Resolved: the RC removes the *transport* session primitive (initialize handshake + Mcp-Session-Id header) and moves to inline per-request capabilities; it does not claim agents are stateless. The post is explicit about this being the transport layer only, which is the whole argument.
- Recency risk: RC dated 2026-07-28 (future-dated spec label) with SDK support shipped 2026-06-16 — flagged that the label is the target spec date, not a past event. Post says "arrived this month" referring to the RC + SDK landing, which is accurate as of 2026-06-22.
- Verify-before-post TODO: re-confirm the two MCP URLs resolve and that the RC still describes the tasks extension as stated before publishing.

## Editorial decisions
- Cut the broader "is MCP dead / context-cost" debate to keep the piece on the single session-boundary argument.
- Cut swyx's AIE debate-revival color for tightness; available if a follow-up wants it.
- One bold claim only (the "got more scalable by admitting the durable state was never its to keep" line), per voice style rules.


---

## External review (ChatGPT, 2026-06-22) — verbatim

> **Overall evaluation**
>
> This is a strong blog post. The core move is compelling: it reframes "MCP removed sessions" from a loss of state into a clarification of where state belongs. The distinction between transport session and agent session is the post's best idea, and it gives the piece a clear argumentative spine rather than making it another changelog reaction. I would publish it after tightening a few factual and rhetorical edges.
>
> **What works** — The opening starts with a concrete protocol change, then immediately creates tension. The "Two things wearing the same word" section is the clearest and most valuable part; it maps to the official RC language (initialize/initialized handshake removed, protocol version/client info/capabilities move into _meta on requests, Mcp-Session-Id removed so any request can land on any server instance). The web-tier analogy works. Strongest sentence: "make the connection disposable so the work can be durable."
>
> **Factual checks and risk**
> 1. "arrived this month" is date-sensitive and may already be wrong. Official MCP blog post dated May 21, 2026; GitHub RC release page shows May 29, 2026 for "MCP 2026-07-28 RC." If publishing in late June, use "recently," "in May," or "the 2026-07-28 RC."
> 2. "The Python SDK shipped support for it on June 16" is directionally plausible but should be phrased carefully. PyPI shows mcp 1.28.0 released June 16, 2026, but v1.x remains the stable production line while v2 is alpha (pre-releases require opt-in). Avoid implying production-ready full support. Suggested: "The Python SDK has already begun shipping support on the v2 alpha line, while v1.x remains the recommended production release, so this is no longer just a design sketch."
> 3. The Tasks section is almost right but incomplete. The official RC says Tasks can return a task handle and clients drive it with tasks/get, tasks/update, and tasks/cancel; the post mentions only tasks/get and tasks/cancel. Add tasks/update.
> 4. "the largest revision since it launched arrived this month" should not call the 2026-07-28 spec as if final. The RC is available; the final specification ships July 28, 2026, and GitHub warns the spec is not final.
>
> **Main editorial weakness** — Slightly too absolute in places. "the resumability anyone actually cared about never lived in the tool connection in the first place" — some server authors did care about tool-layer resumability (browser sessions, shopping carts, database cursors, multi-step workflows). The better claim is not that nobody cared; it is that the protocol-level session was the wrong implicit mechanism. The RC itself says applications can maintain state by minting explicit handles such as basket_id or browser_id and passing them back as tool arguments. Suggested softening: "It forced infrastructure to preserve a transport relationship when the durable thing people actually needed was an explicit application handle or an agent-owned task thread."
>
> **Structure** — Solid (news hook → apparent contradiction → distinction → analogy → boundary → takeaway). Could use one more concrete example after the distinction. Suggested: "A browser automation MCP server should not depend on Mcp-Session-Id to remember which browser it launched. It should return a browser_id. The agent runtime should decide how that handle is stored, resumed, expired, and associated with the larger task."
>
> **Suggested titles** — Best fit: "MCP Removed Sessions. That Makes Agent Sessions More Important." Alternatives: "MCP Went Stateless. Agents Did Not." / "The Session MCP Deleted Was the Wrong One" / "Stateless MCP and the Return of the Real Agent Session."
>
> **Other line edit** — Consider replacing "Transport stickiness was operational debt dressed up as a feature" with something less inflammatory if the audience includes MCP implementers: "Transport stickiness was a useful bridge, but it was becoming operational debt."
>
> **Verdict** — Publishable with minor revisions. The strongest version of this post is not "MCP sessions never mattered"; it is "MCP deleted the wrong layer's session so agent runtimes can own the right one."

## Editorial response to external review (Aria, 2026-06-22)

Each point cross-checked against the session research brief (MCP/framework scout) before acting — the brief independently corroborates the dates, the v1-stable / v2-alpha split, and the three-verb Tasks API, so the factual catches are accepted with confidence, not on the reviewer's word alone.

| # | Review point | Decision | What changed |
|---|--------------|----------|--------------|
| 1 | "arrived this month" wrong (RC announced May 21) | ACCEPT | Opening now reads "since launch is now in release-candidate form"; drops the month claim, removes the false-finality risk (covers point 4 too) |
| 2 | SDK sentence overstates readiness | ACCEPT | Rewrote to "SDK support is already appearing, including on the Python SDK's v2 alpha line, while the stable v1 series remains the production recommendation, so this is the direction of travel rather than a design sketch" |
| 3 | Tasks missing tasks/update | ACCEPT | Added `tasks/update` to the verb list |
| 4 | Opening could imply spec is final | ACCEPT | Folded into #1 |
| 5 | "nobody cared about tool-layer resumability" is a strawman | ACCEPT (own wording) | Rewrote to concede resumability mattered (browser, cart, cursor, multi-step workflow) and reframe the *mechanism* as wrong — held as an explicit application handle vs smuggled into a transport session. Kept the bold thesis line. Used a sharper rewrite than the reviewer's hedged version |
| 6 | Add a concrete example after the distinction | ACCEPT | Added the `browser_id` paragraph at the end of "Two things wearing the same word," in Merlin's voice |
| 7 | Soften "operational debt dressed up as a feature" | PARTIAL | Kept the directness (voice = unhedged) but made it accurate: "Transport stickiness solved a real problem and then became one." Rejected the reviewer's deferential "useful bridge" phrasing as off-voice |
| 8 | Title leans toward "sessions never mattered" | DEFER to Merlin | Body now leans into "wrong layer, not never mattered," which de-risks the current title; alternatives surfaced for Merlin's decision |

Net effect: ~1040 words (up from 962), still one bold claim, zero em-dashes, all citations inline. Factual precision raised on dates, SDK status, and Tasks API; one strawman removed; one operational example added.

