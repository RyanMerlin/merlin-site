# Evidence & provenance — MCP connects agents to the world. Your CLI teaches them your world

*Full research + decision record. Non-rendering sidecar (collection globs `**/index.md` only); rides the bundle on `git mv` to `src/posts/`. Slug: `cli-teaches-agents-your-world`.*

---

## 1. Decision log

1. Surfaced while reframing the MCP post; hived off into its own article.
2. **v1** (opinion-led, 2020/2024 "home-cooked software" lineage) — scrapped. Merlin: stale pre-LLM links read as outdated. → [[citation-recency]].
3. **v2** (technical, benchmark-led: rolling discovery + commands + numbers). Slug `the-hundredth-command-is-free`.
4. **v3** (this version) — incorporates a ChatGPT editorial pass, rendered in our voice with callouts/bold/inline links. Structural reframe: **ownership** ("which layer owns the operation"), **CLI *plus* MCP, not versus**, **progressive discovery** as the shared trend (MCP and CLI both), the chassis as **amortized** knowledge ("the hundredth command is prepaid, not free"), and the **workshop/socket** metaphor. Title set by Merlin: *"MCP connects agents to the world. Your CLI teaches them your world."* Slug renamed `the-hundredth-command-is-free` → `cli-teaches-agents-your-world` (Merlin's call).
5. Internal links added (body-of-work): the MCP post (prior half of the argument), the secrets post (the credential example), the protocol-stack post (the layering).

## 2. Research agents

- **Toolchain angle (3):** FOR (steelman + lineage), AGAINST (dilution/disclosure-trap/"DIY is dead"), novelty scout (**4/5**, the investment/ownership framing is whitespace). Verdict: add as a reframe, concrete, privacy-safe.
- **MCP-currency (3):** landscape, adversarial, primary-source fact-check (see the sibling MCP post's evidence.md for detail).
- **v3 fact-check (3 new sources ChatGPT introduced):** all CONFIRMED against primaries before use — see §3 rows for Skills, the Arize *guidance*, and the Cloudflare *security* line. Caveat recorded: do not quote Anthropic's "tailored to how you work" verbatim (unconfirmed phrasing); functional claims confirmed.

## 3. Validated sources (each ≤ ~12 months, with summary + date)

| Source | Date | What it establishes |
|---|---|---|
| [Cloudflare, "Code Mode"](https://blog.cloudflare.com/code-mode-mcp/) | 2026-02-20 | 2,500-endpoint API = 1.17M tokens as native MCP tools vs ~1k via `search()`/`execute()`. **Security:** "a shell… introduces a much broader attack surface than a sandboxed isolate." |
| [Anthropic, "Code execution with MCP"](https://www.anthropic.com/engineering/code-execution-with-mcp) | 2025-11-04 | 150k → 2k tokens (98.7%) by inspecting only the tool files needed. |
| [Anthropic Tool Search + `defer_loading`](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) | 2026-01 | Multi-server setups ~55k tokens on defs before work; tool search cuts >85%; defer/search/expand 3–5. The in-band rebuttal — "progressive discovery won," not "MCP failed." |
| [Arize, "MCP vs CLI Skills"](https://arize.com/blog/mcp-vs-cli-skills-for-agents-what-our-eval-found-and-which-you-should-use/) | 2026-05 | 500 evals: correctness 0.834 (MCP) / 0.833 (CLI skill) / 0.845 (bare shell); hardest tier MCP ~6× cost / ~5× slower / 0.33 fidelity. **Guidance:** CLI for local/pre-auth/composable, MCP for remote/OAuth/stateful/shipped-to-customers. Branch+PR faster via MCP (8 calls/33s) when ops map to direct tools. The hinge source. |
| [Anthropic, Agent Skills](https://claude.com/blog/skills) | 2025-10-16, updated 2025-12-18 | Skills as composable procedural workflows; Dec-18 open-standard portability (build once, use across Claude apps / Claude Code / API), org-wide management, partner directory. Supports the personalization thesis: skill = the map, CLI = the machine. |
| [MCP 2026 roadmap](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/) | 2026 | Stateless core + on-demand discovery prioritized. |

## 4. Adversarial findings + resolutions

- "Derivative of Code Mode / code-execution" → resolved: credit them explicitly and reframe to *convergence* (everyone is doing progressive discovery), with the CLI as the owned-operations plane underneath.
- "Tool Search already fixes the context problem" → resolved: admit it openly ("progressive discovery won"); the CLI's edge is ownership + composition, not token count.
- "Anti-MCP cosplay" risk → resolved: explicit "Where MCP belongs" section (remote/OAuth/distribution/security) using Arize's guidance + Cloudflare's sandbox argument.
- "n=1 / vendor-toolchain navel-gazing" → resolved: pattern-level, generic `mytool`, no inventory.

## 5. Editorial decisions

- **Title:** Merlin's (over ChatGPT's "Stop Renting Your Interface").
- **Reframe:** "CLI vs MCP" → "CLI plus MCP"; "hundredth command is free" → "prepaid" (amortized chassis).
- **Formatting:** blockquote callouts for the load-bearing lines, bold for key terms, verified inline links throughout.
- **Internal links:** MCP post, secrets post, protocol-stack post.
- **Recency:** every source ≤ ~12 months; 2020/2024 lineage cut.
- **Privacy:** pattern, not inventory; generic `mytool`.
- **Diagrams kept:** `aria-rolling-discovery.svg` (progressive-discovery section), `aria-rs-command-surface.svg` (owned-surface section).
