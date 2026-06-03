# Evidence & provenance — The Hundredth Command Is Free

*Full research + decision record. The Astro content collection globs `**/index.md` only, so this never renders or routes; it ships in the bundle as the audit trail and rides along on `git mv` to `src/posts/`. Authored 2026-06-02.*

---

## 1. Decision log (how the direction was litigated)

1. **Started as a reframe of the MCP post.** Original task: review + freshen "The MCP Explosion Has a Scaling Problem" before promoting it. Three MCP-currency agents (§3) found the post correct but behind the discourse. Merlin approved a **full reframe** of that post (currency + prior-art credit + ACP fix).
2. **New angle proposed by Merlin:** frame the CLI-substrate argument around `aria-rs` (a personal, continuously-sharpened toolchain), not EdgePlane. Spawned three agents to litigate it: FOR / AGAINST / novelty scout (§4).
3. **Verdict: add it, but as a reframe, only if concrete.** Novelty scout rated the specific intersection 4/5 (whitespace). AGAINST's risks (thesis fracture, disclosure trap, "DIY is dead" discourse) were ruled real-but-survivable *if* executed concretely and privacy-safe.
4. **Framing fork → Option A:** personal toolchain leads; EdgePlane becomes a fleet-scale coda; enterprise platform-engineering ("DIY is dead") named and sidestepped as a different question. (Merlin chose this explicitly.)
5. **Operator signaled** for authoritative `aria-rs` substance (§5), kept at pattern level (no inventory) per the privacy constraint.
6. **Scope change:** Merlin decided the toolchain angle had outgrown a section — it became a **new standalone article**. The MCP post was reverted to currency-fixes-only; the toolchain material moved here.
7. **v1 scrapped.** First draft was opinion-led and cited pre-LLM-era sources (Sloan 2020, Appleton 2024). Merlin: "before LLMs and Agentic AI? that's fucking old." → **Recency rule** established (cite ≤ ~12 months) and v1 rewritten as v2: technical, benchmark-led, rolling discovery + concrete commands.
8. **Diagrams** added: `aria-rolling-discovery.svg`, `aria-rs-command-surface.svg`.
9. **Infra:** built a hidden `/draft/<slug>` preview endpoint (+ `/drafts` index) so the rendered draft can be fine-tuned on the live site before `git mv` to `src/posts/`. Vault `queue/` collapsed/renamed to `pre-publish/`; staging model is channel-scoped (site posts stage in repo `src/drafts/`, non-site in vault `pre-publish/`).

---

## 2. The defensible thesis

Most teams assume progressive disclosure (tool search, code execution) "solved" MCP's context bloat. It solved the *token* problem for one agent's tool use. It did not make operations deterministic, governable, or callable by non-model actors. The open question — *which layer owns the operation* — is answered by a CLI you own, which also **compounds** in a way no vendor product can replicate. That compounding/investment framing is the whitespace (novelty 4/5).

---

## 3. MCP-currency agents (3) — informed the framing + the sibling MCP post

**3a. Landscape (current state, last 90 days).** Findings: Claude Code Tool Search shipped (Jan 2026); Cloudflare Code Mode (Feb 2026); Anthropic code-execution pattern (Nov 2025); ACP merged into A2A (Aug/Sep 2025); MCP donated to Agentic AI Foundation / Linux Foundation (Dec 2025); MCP 2026 roadmap = stateless + on-demand discovery; Arize MCP-vs-CLI eval (May 2026); MS Agent Framework 1.0 GA (Apr 2026). Verdict: thesis current, but missed the simultaneously-shipped solutions.

**3b. Adversarial.** Kill shots: (1) core idea published by Anthropic + Cloudflare months earlier, uncredited; (2) problem already solved in-band by Tool Search / `defer_loading` (default in Claude Code 2.1.7+, ~85% cut), unaddressed; (3) ACP is a dead acronym (merged into A2A). Verdict: defensible **with revisions**.

**3c. Fact-check (primary sources).** 97M downloads / 10k servers = accurate *as of Dec 2025* (registry ~9,652 by May 2026); A2A "50+ partners" now **150+ orgs** (Apr 2026); MS AF GA Apr 3 2026 (A2A interop shipped shortly after); client-best-practices quote verified verbatim and live; current spec **2025-11-25**; **all cited links resolve**.

---

## 4. Toolchain-angle agents (3) — FOR / AGAINST / novelty

**4a. FOR (steelman).** Lineage: Robin Sloan "home-cooked software" (2020), Maggie Appleton "barefoot developers" (2024), Geoffrey Litt "Stevens" (Apr 2025), Ink & Switch "malleable software" (Jun 2025), Simon Willison `llm` CLI + "vibe engineering" (2025), Jannik Reinhard CLI-vs-MCP (Feb 2026). Core: "rented vs owned leverage"; durable + uncopyable; recommend a *reframe*. **Note:** the 2020/2024/early-2025 lineage links were CUT from the final draft for recency (§6); the reasoning ("owned leverage compounds") was kept.

**4b. AGAINST.** Kill shots: thesis fracture (two essays in one); "DIY is dead" platform-engineering discourse (Roadie 2026, Gartner 80% IDP, port.io tool-sprawl); disclosure trap ("build your own" invites "show me," exposes internals); already-mainstream as a content genre (personal-AI-toolchain Substacks); survivorship/navel-gazing voice risk. Verdict: don't add, or one-sentence minimal. **How resolved:** reframe (not bolt-on), one concrete example, pattern-not-inventory, name + sidestep the platform-eng discourse.

**4c. Novelty scout — verdict 4/5 (whitespace).** The CLI-beats-MCP performance case is crowded; the **investment framing** (a personal, agent-shared, continuously-sharpened CLI as a compounding substrate, an explicit anti-MCP-proliferation bet) is not yet a named pattern. Adjacent-but-different: IDPs/golden paths (org-scale), build-your-own-MCP (the thing it reacts against), agents-that-write-tools (autonomy, not human curation), dotfiles-for-agents (config, not tooling), Claude Code skills (shared, not bespoke). **Make-or-break:** lives or dies on a concrete "encode the friction, remove it permanently" example, else it collapses to generic "build tools."

---

## 5. Operator input — `aria-rs` substance (pattern-level, generic on purpose)

- **Purpose:** one JSON-speaking command surface over every system you touch; the alternative (SDKs + scripts + bolted-on MCP servers) accumulates, never compounds.
- **Value:** rented leverage (vendor/MCP — someone else's schema, per-call context) vs owned leverage that appreciates (pay once at the binary, every caller draws free). Asymmetry: a vendor optimizes the average task; your CLI optimizes your exact friction — "a vendor cannot build for your Tuesday."
- **Updating:** chassis built once (arg parsing, secret resolution, config, JSON envelope, honest error handling) → adding a capability = "describe a verb." Thin wrapper = minutes; new integration = an afternoon. First command expensive, hundredth nearly free.
- **Cross-platform:** across surfaces (one integration point, not N) + across callers (human/agent/cron/service invoke the identical JSON-on-stdout string).
- **Friction example:** credential fetch (source env → POST for token → parse → fetch secret → parse; stale-token 404 looks like a missing secret) collapsed into one verb.

---

## 6. Validated sources (cited in the piece; each ≤ ~12 months, with summary + date)

| Source | Date | What it establishes |
|---|---|---|
| [Cloudflare, "Code Mode"](https://blog.cloudflare.com/code-mode-mcp/) | 2026-02-20 | Large API via MCP = 1.17M tokens; via generated code on a typed SDK ≈ 1k (99.9% cut). The production instantiation of code-as-substrate. |
| [Anthropic, "Code execution with MCP"](https://www.anthropic.com/engineering/code-execution-with-mcp) | 2025-11-04 | One workflow 150k → 2k tokens (98.7%). Intellectual predecessor; credited in the piece. |
| [Arize, "MCP vs CLI Skills"](https://arize.com/blog/mcp-vs-cli-skills-for-agents-what-our-eval-found-and-which-you-should-use/) | 2026-05-01 | Correctness tie (0.834 vs 0.833); MCP ~6× cost / ~5× slower on complex tasks; tool fidelity 0.33 (escapes to bash); "MCP plus the command line." |
| [Reinhard, "Why CLI Tools Are Beating MCP"](https://jannikreinhard.com/2026/02/22/why-cli-tools-are-beating-mcp-for-ai-agents/) | 2026-02-22 | Up to 35× fewer tokens; reliability ~72% → 100%; in-distribution argument (trained on terminal interaction). |
| [Anthropic Tool Search + `defer_loading`](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) | 2026-01 | Default in Claude Code 2.1.7; ~85% cut on 50 tools; accuracy 79.5% → 88.1% (Opus 4.5). The in-band rebuttal the piece engages. |
| [MCP 2026 roadmap](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/) | 2026 | Stateless core + on-demand discovery prioritized — the spec conceding front-loading doesn't scale. |

**Cut for recency** (kept out of the final draft per the ≤12-month rule, retained here for trail): Sloan "home-cooked software" (2020), Appleton "barefoot developers" (2024), Litt "Stevens" (Apr 2025), Ink & Switch "malleable software" (Jun 2025).

---

## 7. Editorial decisions

- **Recency:** every cited source ≤ ~12 months; pre-LLM-era lineage cut.
- **Framing:** individual-operator lane; EdgePlane = closing coda; platform-engineering "DIY is dead" named and sidestepped (different question).
- **Privacy:** pattern, not inventory — `aria-rs` referenced as "a tool I built," never a catalog; generic `mytool` in code samples.
- **Diagrams:** `aria-rolling-discovery.svg` (rolling-discovery section), `aria-rs-command-surface.svg` (one-verb-every-caller section).
- **Voice:** peer field report, no em dashes, benchmark-led not opinion-led (v1 → v2 rewrite after Merlin flagged v1 as bland/stale).
