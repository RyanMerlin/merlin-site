# Evidence & provenance — The MCP Explosion Has a Scaling Problem

*Research provenance for the 2026-06-02 reframe of "The MCP Explosion Has a Scaling Problem." Three parallel agents: current-landscape, adversarial, primary-source fact-check. Ships into the post bundle as evidence.md on publish; never rendered.*

## Discourse position (June 2026)

The post's thesis (MCP for in-context discovery; deterministic substrate for known operations) is correct and now independently corroborated. The risk was that the post read as first-to-notice when the field had been converging for 6+ months and had already shipped fixes. The reframe credits the prior art, engages the in-band fix, and stakes the unsolved question: which layer owns the operation, for persistent fleets with non-model actors.

## The so-what test

Most people now assume progressive disclosure and code-execution patterns solved MCP's context-bloat problem. They solved the *token* problem for a single agent's tool use. They did not make operations deterministic, auditable, callable by non-model actors, or policy-governable. That is the layer question the post now owns.

## Verified sources woven into the reframe

- Anthropic, "Code execution with MCP" (2025-11-04) — intellectual predecessor; 150k→2k tokens (98.7%). https://www.anthropic.com/engineering/code-execution-with-mcp
- Cloudflare, "Code Mode" (2026-02-20) — 2,500 endpoints, 1.17M→~1k tokens (99.9%), search()/execute(). https://blog.cloudflare.com/code-mode-mcp/
- Arize AI, "MCP vs CLI Skills" eval (2026-05-01) — correctness near-identical (0.834 vs 0.833); MCP ~6x cost / ~5x slower on complex tasks; "MCP plus the command line." https://arize.com/blog/mcp-vs-cli-skills-for-agents-what-our-eval-found-and-which-you-should-use/
- Claude Code Tool Search + defer_loading — default in 2.1.7+, ~85% token cut. In-band rebuttal target.
- MCP donated to Agentic AI Foundation / Linux Foundation (2025-12-09); vendor-neutral, not Anthropic-controlled. https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation
- A2A surpassed 150 orgs in production, moved to Linux Foundation (2026). https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year
- MS Agent Framework 1.0 GA (2026-04-03), unified Semantic Kernel + AutoGen. https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/
- MCP 2026 roadmap — stateless core, on-demand discovery; maintainers acknowledge scaling cost. https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/
- HN discourse: https://news.ycombinator.com/item?id=47208398 (Simon Willison active; CLI-for-composability vs MCP-for-auth/discovery)

## Corrections applied to the live post

- Dead acronym: ACP merged into A2A (Aug/Sep 2025). Collapsed the stack to MCP + A2A; relabeled the table row "auditable workflow layer."
- Stats: 97M/10k dated "at the time of the donation"; A2A 50+ → 150+ orgs; MS AF GA dated April 2026; MCP framed as LF infrastructure.
- Added spec baseline (2025-11-25) + roadmap acknowledgment for currency and intellectual honesty.

## Open question for promotion

The unique, defensible angle for the LinkedIn/dev.to/X push: the fleet/multi-actor substrate framing, not "MCP is overrated." Lead promotion from "tool search fixed the token problem; it didn't answer which layer owns the operation."
