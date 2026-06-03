# Evidence & provenance — Own the Operation

*Full research + decision record. Non-rendering sidecar (collection globs `**/index.md` only); rides the bundle on `git mv` to `src/posts/`. Slug: `own-the-operation`.*

---

## 1. Decision log

1. Surfaced while reframing the MCP post; hived off into its own article.
2. **v1** (opinion-led, 2020/2024 lineage links) — scrapped for staleness. → [[citation-recency]].
3. **v2** (technical, benchmark-led). Slug `the-hundredth-command-is-free`.
4. **v3** (ChatGPT pass #1, rendered in voice): ownership + CLI-plus-MCP + progressive discovery + prepaid chassis + workshop. Slug `cli-teaches-agents-your-world` (retired).
5. **v4 — this version, "Own the Operation"** (ChatGPT pass #2 + Aria editorial pass). Sharper thesis ("where does the operation live?"), adds the layer table, the JSON contract, "Why not workflows?" (orchestration vs ownership), "What earns a command" (discipline criteria), "Build by osmosis" (MCP as prior art), and "Falsify it on your own system" (testable claim + what-would-make-it-wrong). Fixes the two issues flagged in review: the weak socket/workshop metaphor was dropped; the bash ambiguity resolved ("That is not an operation. It is ceremony.").
6. Aria editorial pass: re-added internal links (MCP / secrets / protocol-stack), converted prose `text` fences to bullets, trimmed the agent-prompt + metrics lists (~10%), em-dash sweep, kept both diagrams + callouts.

## 2. Research agents

- **Toolchain angle (3):** FOR (lineage), AGAINST (dilution / disclosure-trap / "DIY is dead"), novelty scout (**4/5** — the ownership/investment framing is whitespace). Verdict: add as a reframe, concrete, privacy-safe. The "What earns a command" section is the direct answer to AGAINST's DIY-decay risk.
- **MCP-currency (3):** landscape, adversarial, primary-source fact-check (detail in the sibling MCP post's evidence.md).
- **Source verification (Aria, this version):** every citation re-checked against primaries before publish, including ChatGPT's two newest links (both CONFIRMED live — see §3).

## 3. Validated sources (each ≤ ~12 months, with summary + date)

| Source | Date | What it establishes |
|---|---|---|
| [Cloudflare, "Code Mode"](https://blog.cloudflare.com/code-mode-mcp/) | 2026-02-20 | 2,500-endpoint API = 1.17M tokens as native MCP tools vs ~1k via `search()`/`execute()`. Security: a shell is "a much broader attack surface than a sandboxed isolate." |
| [Anthropic, "Code execution with MCP"](https://www.anthropic.com/engineering/code-execution-with-mcp) | 2025-11-04 | 150k → 2k tokens (98.7%); MCP as an open standard replacing bespoke per-tool glue. |
| [Anthropic Tool Search](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) | 2026-01 | ~55k tokens on defs before work; tool search cuts >85%; defer/search/expand. The "progressive discovery won" hinge. |
| [Arize, "MCP vs CLI Skills"](https://arize.com/blog/mcp-vs-cli-skills-for-agents-what-our-eval-found-and-which-you-should-use/) | 2026-05 | 500 evals: 0.834 (MCP) / 0.833 (CLI skill) / 0.845 (bare shell); hardest tier MCP ~6× cost / ~5× slower / 0.33 fidelity. Branch+PR faster via MCP (direct tools). Endpoint-shaped vs composition-shaped rule. |
| [Anthropic, Skills for organizations + directory](https://claude.com/blog/organization-skills-and-directory) | 2025-12-18 | **Verified live (Aria):** "repeatable workflows tailored to how you work"; org-wide admin provisioning; partner-built skills; open standard for cross-platform portability. |
| [MCP tools spec (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) | 2025-11-25 | **Verified live (Aria):** servers expose tools invokable by models; each tool "uniquely identified by a name and includes metadata describing its schema." Current spec version. |
| [GitHub Actions docs](https://docs.github.com/en/actions) · [Temporal durable execution](https://docs.temporal.io/tags/durable-execution) | live | Orchestration prior art (workflow layer). Generic, low-risk. |

## 4. Adversarial findings + resolutions

- "Derivative of Code Mode / code-execution" → credited explicitly; reframed to convergence (everyone is doing progressive discovery), CLI as the owned-operations layer underneath.
- "Tool Search already fixes it" → admitted openly ("progressive discovery won"); edge is ownership + composition + contracts, not token count.
- "Anti-MCP cosplay" → "Put MCP behind it" + layer table + Cloudflare security; explicitly not anti-MCP.
- "DIY navel-gazing / n=1" → "What earns a command" criteria + "Falsify it on your own system" (measure, do not build to satisfy an identity).
- Metaphor crowding (socket/workshop) → dropped. Bash-vs-shell ambiguity → resolved (ceremony vs operation).

## 5. Editorial decisions

- **Title:** "Own the Operation" (supersedes the long working title and `cli-teaches-agents-your-world`).
- **Recency:** every source ≤ ~12 months; pre-LLM lineage cut.
- **Privacy:** pattern, not inventory; generic `mytool`.
- **Internal links:** MCP post, secrets post, protocol-stack post.
- **Diagrams:** `aria-rolling-discovery.svg` (progressive-discovery), `aria-rs-command-surface.svg` (the seam / every-caller).
- **Format:** callout blockquotes for load-bearing lines, bullets for criteria/metrics, code fences reserved for commands/JSON.
