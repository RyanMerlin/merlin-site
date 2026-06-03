# Evidence & provenance — The Hundredth Command Is Free

*Research scaffold. The Astro content collection globs `**/index.md` only, so this file ships in the bundle as provenance but never renders or routes. Rides along on `git mv` to `src/posts/` at publish.*

## Discourse position

The "CLI beats MCP for agents" performance case is established 2026 discourse. The genuinely under-occupied claim (novelty scout rated it 4/5) is the **investment framing**: build and continuously sharpen your own bespoke, agent-shared CLI as a *compounding* operational substrate, an explicit bet against MCP proliferation. Adjacent rooms are crowded (MCP-vs-CLI benchmarks, "compound engineering," dotfiles-for-agents, Claude Code skills); this exact intersection is whitespace.

## So-what / framing test

Most teams assume progressive disclosure (tool search, code execution) "solved" MCP's context bloat. It solved the *token* problem for one agent's tool use. It did not make operations deterministic, governable, or callable by non-model actors. The layer question — which layer owns the operation — is still open, and a CLI you own answers it while compounding in a way no vendor product can replicate.

## Verified sources (all ≤ ~12 months as of 2026-06-02)

- **Cloudflare, "Code Mode"** (2026-02-20): large API via MCP = 1.17M tokens; via generated code against a typed SDK ≈ 1k (99.9% cut). https://blog.cloudflare.com/code-mode-mcp/
- **Anthropic Engineering, "Code execution with MCP"** (2025-11-04): one workflow 150k → 2k tokens (98.7%). https://www.anthropic.com/engineering/code-execution-with-mcp
- **Arize AI, "MCP vs CLI Skills" eval** (2026-05-01): correctness tie (0.834 vs 0.833); MCP ~6× cost / ~5× slower on complex tasks; MCP tool fidelity 0.33 on hard tasks (escapes to bash); "MCP plus the command line." https://arize.com/blog/mcp-vs-cli-skills-for-agents-what-our-eval-found-and-which-you-should-use/
- **Jannik Reinhard, "Why CLI Tools Are Beating MCP"** (2026-02-22): up to 35× fewer tokens; reliability ~72% → 100%; in-distribution argument (models trained on billions of lines of terminal interaction). https://jannikreinhard.com/2026/02/22/why-cli-tools-are-beating-mcp-for-ai-agents/
- **Anthropic MCP Tool Search + `defer_loading`** (Claude Code 2.1.7, Jan 2026): ~85% token cut on a 50-tool setup; tool-selection accuracy 79.5% → 88.1% (Opus 4.5). https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool
- **MCP 2026 roadmap**: stateless core + on-demand discovery prioritized. https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/

## aria-rs substance (Operator input, pattern-level, kept generic on purpose)

- **Purpose:** one JSON-speaking command surface over every system you touch; the alternative (SDKs + scripts + bolted-on MCP servers) accumulates, never compounds.
- **Value:** rented leverage (vendor/MCP — someone else's schema, per-call context) vs owned leverage that appreciates (pay once at the binary, every caller draws free). Asymmetry: a vendor optimizes the average task; your CLI optimizes your exact friction.
- **Updating:** chassis built once (arg parsing, secret resolution, config, JSON envelope, honest error handling) → adding a capability becomes "describe a verb." Thin wrapper = minutes; new integration = an afternoon. First command expensive, hundredth nearly free (declining marginal cost).
- **Cross-platform:** across surfaces (one integration point, not N) + across callers (human/agent/cron/service invoke the identical JSON-on-stdout string).
- **Friction example:** credential fetch (source env → POST for token → parse → fetch secret → parse; stale-token 404 looks like a missing secret) collapsed into one verb.

## Editorial decisions

- v1 (opinion-led, with a 2020 "home-cooked software" lineage) was scrapped. Per Merlin's recency rule: cite sources ≤ ~12 months; pre-LLM-era anchors read as outdated for agentic-AI topics. Sloan (2020) / Appleton (2024) / Litt (Apr 2025) cut.
- Reframed around the aria-rs personal toolchain (individual-operator lane), with EdgePlane as the closing fleet coda, and the enterprise platform-engineering "DIY is dead" discourse named and sidestepped (different question).
- Internals kept at pattern level (no inventory) per the privacy constraint.
- Diagrams: `aria-rolling-discovery.svg` (rolling-discovery section), `aria-rs-command-surface.svg` (one-verb-every-caller section).
