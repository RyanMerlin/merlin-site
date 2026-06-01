---
title: "Curio: Git-Native Knowledge Curation for Enterprise AI"
created: "2026-05-11"
status: "published"
tags: ["agents","enterprise-ai","knowledge-management","open-source"]
summary: "Enterprise AI projects don't fail because organizations lack information. They fail because that information exists in a form no system can reliably act on. Curio is built to fix that."
---

<img src="/images/curio-hero.png" alt="Curio: Curated Intelligence Operator" style="width: 50%; display: block; margin: 0 auto 2rem;" />

Every enterprise AI project I've worked on eventually hits the same wall.  Not a model wall.  Not a data wall.  A knowledge wall.

The organization has information, years of it.  Slack threads where the right answer was given once, buried under 40 follow-ups and never indexed.  Confluence pages that were accurate in 2022 and silently wrong since.  PDFs that someone important wrote, sent to a distribution list, and never touched again.  Internal tooling that three people understand and none of them documented.

When you try to build an AI system that acts on this knowledge, retrieves it, reasons over it, surfaces it at the right moment, you discover the information is there but the *knowledge* isn't.  There's no structure, no editorial status, no provenance.  No way to know what's current, what contradicts what, or what's worth trusting.  The knowledge base is a pile, not a system.

**This is the problem Curio is built to solve.**

---

## The missing abstraction

Most organizations approach this by adding more capture surfaces: better Confluence templates, mandatory fields in Jira, Slack integrations that auto-archive to Notion.  None of it works long-term, because the problem isn't capture.  It's curation.

Curation requires a workflow.  Raw material comes in; something with editorial judgment reviews it, places it in the right structural context, assigns it a status, and connects it to related material.  Human editorial teams do this.  What organizations need is the same function running continuously and automatically, with humans as reviewers and approvers, not the bottleneck.

**Curio provides that infrastructure.**  It's a knowledge curation system where the source of truth is a Git repository, agents drive the editorial judgment, and the published surface is a Confluence space that you never edit directly.

---

## How it works

The core pipeline has four stages:

*Intake.*  You feed Curio a source, a URL, a Confluence page tree, a local file, a Slack export.  The content is extracted to markdown and written to `wiki/intake/` with full provenance metadata in YAML frontmatter: source URL, ingestion timestamp, content hash, source kind.  At this stage, nothing has been judged yet.

*Processing.*  This is where Curio's design diverges from every other knowledge tool I've seen.  Processing runs in two deliberate phases.

*Phase 1, Prepare:* `curio process --prepare` reads all intake pages and produces a JSON routing manifest.  This manifest describes what the agent needs to reason about: the existing taxonomy, the new material, the open questions about hierarchical placement.  The agent ([Claude](https://anthropic.com/claude), [Gemini](https://deepmind.google/technologies/gemini/), or [Codex](https://openai.com/codex), your choice) receives this manifest along with the knowledge base's `NORTHSTAR.md` charter, which defines the taxonomic structure and curation intent.

*Phase 2, Apply:* The agent returns routing decisions.  Curio's CLI applies them atomically: `curio process --route-file decisions.json`.  Each page moves to `staged/{category}/` or `review/{category}/`, receives confidence scoring, and gets a `.analysis.json` sidecar with the full reasoning trace.

**This split is the important architectural decision.**  There are no LLM calls in the Rust binary.  The deterministic substrate handles all file operations, validation, and Git commits.  The agent handles all judgment.  These two concerns have fundamentally different failure modes and they're kept completely separate.

*Review and publish.*  Pages above a confidence threshold go to `staged/`.  Pages where the agent flagged ambiguity, low confidence score, taxonomy conflict, unusual source, go to `review/` for human inspection.  Confluence surfaces the review queue directly; reviewers work where they already work, and approvals push changes back through the pipeline.  `curio publish` promotes staged pages to `published/` with updated cross-reference indexes.

*Sync.*  `curio sync` pushes the published tree to Confluence as a one-way mirror.  The Git repository is always the source of truth.  Confluence is never edited directly; it's a curated, structured publication surface for the people who don't live in terminals.

---

## The architecture decisions

A few choices shaped the design more than anything else.

*Git as the system of record.*  Every curation decision is a commit.  Every routing change is auditable.  You can diff the knowledge base across time, branch for experimental curation passes, and roll back a bad healing run.  Git brings to institutional knowledge what it already brought to code: version control and a full audit trail.

*Hierarchy as the optimization target.*  Most knowledge tools optimize for placement; does this page land in roughly the right bucket?  Curio optimizes for hierarchy; does this page belong exactly where it is, at the right depth, with the right parent, adjacent to the right peers?  The agent is explicitly biased toward restructuring recommendations over shallow routing.  **A shallow knowledge base with good content is still unusable; the hierarchy is the navigability of the entire structure.**

*Quality as a first-class property.*  Every page carries a freshness score (days since meaningful update, against a configurable threshold), an overlap score (semantic similarity against peers in the same subtree), and a signal quality assessment (content depth, keyword richness, external references).  `curio doctor` runs these across the whole knowledge base and surfaces the drift before it accumulates.  `curio heal` proposes consolidations for overlapping content; confidence-gated automatic healing runs the low-risk ones without human review.

*Provider agnosticism.*  [Claude](https://anthropic.com/claude), [Gemini](https://deepmind.google/technologies/gemini/), and [Codex](https://openai.com/codex) all launch from the same harness contract.  The same environment variables, the same entry points, the same CLI output format.  Switching models is an operator decision, not a code change.  **This matters in practice because the right model for bulk intake routing isn't necessarily the right model for nuanced taxonomy restructuring**, and you want the flexibility to use both without rebuilding the system.

---

## The service layer

The CLI is the foundation, but the real deployment target is a containerized service that wraps it.  The service handles multi-workspace registration (separate knowledge bases for different teams or use cases), asynchronous job execution, a per-workspace audit stream, and a Git materializer that clones repositories to local mirrors and creates isolated worktrees for concurrent curation jobs.

**This is the layer that turns Curio from a personal productivity tool into an enterprise-grade system.**  One instance, multiple knowledge bases, fully auditable job history, concurrent processing without state conflicts.

---

## What this says about enterprise AI

The way most enterprise AI projects are built, knowledge is an afterthought.  Retrieval is bolted on.  The vector store gets populated with whatever was easiest to export.  Quality degrades invisibly.

Curio reflects a different premise: **knowledge management is infrastructure.**  It needs the same engineering rigor you'd apply to any other production system: defined interfaces, durable state, quality gates, observability, and a clear operational model.  The agent layer provides editorial judgment at scale; the infrastructure layer ensures that judgment is applied consistently, auditably, and reversibly.

The code is on [GitHub](https://github.com/RyanMerlin/curio).  If you're building production AI systems and hitting the knowledge wall, I'd be interested in what you're seeing.

---

*Curio is written in Rust.  The deterministic CLI substrate is open source.  The agent harness is provider-agnostic: [Claude](https://anthropic.com/claude), [Gemini](https://deepmind.google/technologies/gemini/), and [Codex](https://openai.com/codex) all work from the same contract.  Longer discussion in the repo's `docs/design/` folder.*
