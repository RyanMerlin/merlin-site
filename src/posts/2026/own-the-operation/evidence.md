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
8. **ChatGPT adversarial review pass (Aria triage + selective incorporation, 2026-06-03).** Merlin ran an external adversarial review; Aria triaged it against the core premises rather than implementing wholesale. Snapshot tag `own-the-operation-pre-adversarial` (`1842ec2`) pushed before edits. **Accepted:** (a) new "What owning the operation does not solve" limitations section (real gap — the old "Falsify it on your own system" section had been cut and nothing replaced it); (b) security banner elevated — "A CLI is not a permission model. It is a sharper knife."; (c) portable rule promoted to a blockquote ("the operation should live at the lowest layer that can execute it deterministically and be reused by every caller") + role annotations on the agent→MCP→CLI→operation stack; (d) ~surgical compression of the skills section (3→2 paras, kept the SKILL.md-interpreted-not-executed point) + closing-para tighten + one redundant sentence cut after the layer table. **Rejected, with reasons:** (i) the Cloudflare "1.17M token" nitpick — **verified false alarm**, 1.17M is Cloudflare's own *body* figure (the "over 2M" line is the deck); kept as-is; (ii) "minutes / an afternoon" → "small / bounded" — the replacement is vaguer and weaker, concrete time estimates are more credible; kept original; (iii) "cite primary for Claude dynamic workflows" — already primary (`code.claude.com/docs`); (iv) 20–30% cut + moving the banner line earlier — too aggressive, the late banner is the payoff; did ~surgical only. Net length ≈ flat: the limitations section adds high-trust content, the compressions tighten overlap. Quality over a length target.

7. **"Why not workflows?" reframe (Aria, 2026-06-03, post-publish in-place edit).** Merlin's direction: open on workflow as a critical/foundational idea many companies are built on; establish that the word spans layers; quick touches on the orchestration family; **add the agentic-AI-harness meaning** with the latest. Edits made: (a) opener rewritten from "two meanings" cold-open to "load-bearing idea" framing; (b) orchestration paragraph re-listed as GitHub Actions + Airflow/Dagster/Prefect + **Alteryx (added)** + n8n; (c) **new paragraph** on the agent-harness meaning — Anthropic's workflow-vs-agent line plus Claude Code's literal dynamic-workflows primitive; (d) unifying paragraph preserves the load-bearing "decides *when/order*, not *what*" contrast and the "control planes vs operational primitives" payoff. **Temporal removed everywhere** (Merlin: not familiar) — from the orchestration list, the honest-exception paragraph, and the skills-section "a Temporal activity runs the same code" line (now "a workflow step"). **Zapier dropped** (not in Merlin's list); honest-exception now reuses CI / data pipeline / n8n. Fit check: workflow-as-orchestration (engines + agents) stays the *first* meaning so the next section's "this is the other meaning of workflow" (skills/plugins) still reads.

## 2. Research agents

- **Toolchain angle (3):** FOR (lineage), AGAINST (dilution / disclosure-trap / "DIY is dead"), novelty scout (**4/5** — the ownership/investment framing is whitespace). Verdict: add as a reframe, concrete, privacy-safe. The "What earns a command" section is the direct answer to AGAINST's DIY-decay risk.
- **MCP-currency (3):** landscape, adversarial, primary-source fact-check (detail in the sibling MCP post's evidence.md).
- **Source verification (Aria, this version):** every citation re-checked against primaries before publish, including ChatGPT's two newest links (both CONFIRMED live — see §3).
- **Workflow-reframe landscape sweep (Aria, 2026-06-03):** 3 web searches (Anthropic workflows-vs-agents / Claude Code dynamic-workflows orchestration / agentic-workflow-vs-orchestration debate) + 1 WebFetch of the Claude Code workflows doc to confirm exact limits before citing. Cross-source corroboration (InfoQ, Claude Code docs, alexop.dev) on the May 28 2026 research-preview date and the 1,000/16 caps; cited the primary doc only. Noted but **deliberately excluded** the LangGraph/CrewAI/AutoGen framework race (search surfaced it) — off-thesis here and a known recency trap per [[citation-recency]].

## 3. Validated sources (each ≤ ~12 months, with summary + date)

| Source | Date | What it establishes |
|---|---|---|
| [Cloudflare, "Code Mode"](https://blog.cloudflare.com/code-mode-mcp/) | 2026-02-20 | 2,500-endpoint API = 1.17M tokens as native MCP tools vs ~1k via `search()`/`execute()`. Security: a shell is "a much broader attack surface than a sandboxed isolate." |
| [Anthropic, "Code execution with MCP"](https://www.anthropic.com/engineering/code-execution-with-mcp) | 2025-11-04 | 150k → 2k tokens (98.7%); MCP as an open standard replacing bespoke per-tool glue. |
| [Anthropic Tool Search](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) | 2026-01 | ~55k tokens on defs before work; tool search cuts >85%; defer/search/expand. The "progressive discovery won" hinge. |
| [Arize, "MCP vs CLI Skills"](https://arize.com/blog/mcp-vs-cli-skills-for-agents-what-our-eval-found-and-which-you-should-use/) | 2026-05 | 500 evals: 0.834 (MCP) / 0.833 (CLI skill) / 0.845 (bare shell); hardest tier MCP ~6× cost / ~5× slower / 0.33 fidelity. Branch+PR faster via MCP (direct tools). Endpoint-shaped vs composition-shaped rule. |
| [Anthropic, Skills for organizations + directory](https://claude.com/blog/organization-skills-and-directory) | 2025-12-18 | **Verified live (Aria):** "repeatable workflows tailored to how you work"; org-wide admin provisioning; partner-built skills; open standard for cross-platform portability. |
| [MCP tools spec (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) | 2025-11-25 | **Verified live (Aria):** servers expose tools invokable by models; each tool "uniquely identified by a name and includes metadata describing its schema." Current spec version. |
| [GitHub Actions](https://docs.github.com/en/actions) · [Airflow](https://airflow.apache.org/) · [Dagster](https://dagster.io/) · [Prefect](https://www.prefect.io/) · [Alteryx](https://www.alteryx.com/) · [n8n](https://n8n.io/) | live | Orchestration-engine family (workflow-as-pipeline). Generic, low-risk product homepages. **Temporal cut** (2026-06-03, Merlin: not familiar). |
| [Anthropic, "Building Effective Agents"](https://www.anthropic.com/research/building-effective-agents) | 2024-12 (still canonical) | The workflow-vs-agent distinction: workflows orchestrate models/tools along *predefined code paths*; agents *direct their own process*. The line the agentic-harness paragraph hangs on. |
| [Claude Code, "Dynamic workflows"](https://code.claude.com/docs/en/workflows) | 2026-05 (research preview) | **Verified live (Aria WebFetch, 2026-06-03):** a dynamic workflow is a JS script Claude writes; runtime runs it in the background. Exact limits quoted: "**1,000 agents total per run**," "**Up to 16 concurrent agents**." Script holds the plan + intermediate results; Claude's context gets only the final answer. Requires v2.1.154+. The "workflow jumped layers into agent harnesses" anchor. |
| [Demystifying and Detecting Agentic Workflow Injection Vulnerabilities in GitHub Actions](https://arxiv.org/abs/2605.07135) | 2026-05-08 (arXiv) | **Verified live (Aria WebFetch, 2026-06-03):** empirical study. **13,392** agentic workflows across **10,792** repos; **519** potential AWI flaws, **496 confirmed exploitable** (95.6% precision), **343 zero-days**. AWI = untrusted GitHub event text (issue/PR bodies, comments) flows into agent prompts → exfiltration via agent tools/downstream logic. The security anchor for the new limitations section. Stronger than the vendor blogs ChatGPT proposed (CSA "Comment and Control", Aikido PromptPwnd, n8n CVE-2026-27493) — those were surveyed but not cited (peer-grade empirical preferred). |

## 4. Adversarial findings + resolutions

- "Derivative of Code Mode / code-execution" → credited explicitly; reframed to convergence (everyone is doing progressive discovery), CLI as the owned-operations layer underneath.
- "Tool Search already fixes it" → admitted openly ("progressive discovery won"); edge is ownership + composition + contracts, not token count.
- "Anti-MCP cosplay" → "Put MCP behind it" + layer table + Cloudflare security; explicitly not anti-MCP.
- "DIY navel-gazing / n=1" → "What earns a command" criteria + "Falsify it on your own system" (measure, do not build to satisfy an identity).
- Metaphor crowding (socket/workshop) → dropped. Bash-vs-shell ambiguity → resolved (ceremony vs operation).

## 5. Editorial decisions

- **Title:** "Own the Operation" (supersedes the long working title and `cli-teaches-agents-your-world`).
- **Recency:** every source ≤ ~12 months; pre-LLM lineage cut.
- **Privacy:** pattern, not inventory; generic `mycli`.
- **Internal links:** MCP post, secrets post, protocol-stack post.
- **Diagrams:** `aria-rolling-discovery.svg` (progressive-discovery), `aria-rs-command-surface.svg` (the seam / every-caller).
- **Format:** callout blockquotes for load-bearing lines, bullets for criteria/metrics, code fences reserved for commands/JSON.
