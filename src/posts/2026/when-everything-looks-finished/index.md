---
title: "When Everything Looks Finished"
created: "2026-11-18"
status: "published"
tags: ["ai", "agents", "enterprise-ai", "verification-economy", "code-review", "software-economics"]
summary: "AI made polished work cheap.  The approval systems built for a world where effort meant something are losing their signal."
description: "AI made polished work cheap, so effort no longer signals quality. Approval gates have to move to where work gets checked and where the lessons get kept."
---

*AI made polished work cheap.  The approval systems built for a world where effort meant something are losing their signal.*

Between May and September 2026, the code changes landing each day in Anthropic's main repository went [from about 2,500 to more than 30,000](https://www.anthropic.com/engineering/redesigning-source-control).  Claude, the company's AI model, [writes about 90%](https://claude.dev/blog/solving-code-review-at-anthropic/) of the code behind Claude Code, its own coding assistant.  So who checks 30K changes a day?  Not 12x the reviewers.  The Claude Code team, under the same flood in its own repo, moved most of the approval downstream, onto the points where a change can actually be checked.

Every approval gate in an org is a rate limit, a cap on how much work gets through.  Someone put it where they thought the scarce thing was, and for most of corporate history the scarce thing was building.

> **When making gets cheap, the gate has to move onto the costs that didn't, or it stops filtering anything.**

Some front gates are already changing their question.  Shopify's CEO *Tobi Lütke* flipped the burden of proof in an April 2025 memo, telling teams that ["before asking for more headcount and resources, teams must demonstrate why they cannot get what they want done using AI."](https://techcrunch.com/2025/04/07/shopify-ceo-tells-teams-to-consider-using-ai-before-growing-headcount)

![Then: an idea passes one approval gate asking whether it's worth weeks of effort, then gets built and shipped.  Now: the idea still gets asked "should we?", gets built in hours, and passes two gates, the check before shipping and the lesson after it, with the lesson feeding the next check.](./gate-moves.svg)

## What the old gate measured

What were you approving when you approved a polished demo?  Polish used to be expensive.  A demo that ran end to end told you someone had spent weeks on it and survived the hard parts, so you were really grading the effort behind it.  When building was expensive, effort was evidence, and economists have a name for that: a *costly signal*.  A diploma means something because it's hard to fake.

Open source got hit first.  *Daniel Stenberg* maintains curl, a small piece of open-source software that moves data inside billions of devices.  For nearly seven years he paid outsiders who found real security flaws: 87 confirmed, over $100K paid.  The bounty only paid for confirmed flaws, but every report, real or junk, cost a maintainer the time to find out which it was.  Better than 1 in 7 reports used to be real.  In 2025, as AI-written reports poured in, the rate ["plummeted to below 5%,"](https://daniel.haxx.se/blog/2026/01/26/the-end-of-the-curl-bug-bounty/) under 1 in 20.  He shut the program in January 2026, blaming AI slop, worse human reports, and reporters who'd rather poke holes than help.  He wanted to kill "the incentives for submitting made up lies."  Submitting got nearly free while checking cost what it always had, and the checker ate the difference.[^1]

So what does a gate filter once anyone can look done?  If yours rewards finish, it rewards whoever's best at looking done, and a machine is better at that than anyone who ever stood in front of a steering committee.

## What AI actually repriced

I've argued before that [intelligence reduces to three costs](https://ryanmerlin.com/posts/the-loss-function-is-the-product): how complex the model is, what it costs to run, and what it costs to update.  An org runs on a parallel three, and AI hit each one differently.

| Cost | What it buys | What AI did to it |
| --- | --- | --- |
| *Speed* | Making the thing | Collapsed |
| *Quality* | Knowing it's right | Split: looking right got cheap, being right didn't |
| *Adaptation* | Changing how you work once you learn something | Barely moved |

Making collapsed, at least for a plausible first version, which is how you get 30K changes a day.

Quality split.  Looking finished got as cheap as making.  Being right didn't get cheaper per item, and now there's far more to check, all of it polished.  In a randomized trial with early-2025 tools, experienced devs working in their own codebases [took 19% longer](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) while believing they'd been 20% faster.  METR itself now says those results no longer reflect current tools, but that gap between feeling fast and being fast is the tell.  Outside engineering, a Stanford and BetterUp survey of 1,150 desk workers found [40% had received *workslop*](https://hbr.org/2025/09/ai-generated-workslop-is-destroying-productivity) in the prior month: AI output that looks finished and dumps the real work on whoever receives it, at nearly two hours a pop.[^2]

*Christian Catalini*, *Xiang Hui* and *Jane Wu* [model it](https://arxiv.org/abs/2602.20946) as two cost curves racing.  The cost to automate keeps falling while the cost to verify stays stuck at human speed, so "the binding constraint on growth is no longer intelligence but human verification bandwidth."  The shorthand going around is the [*verification economy*](https://www.unite.ai/transitioning-to-the-verification-economy).  It's the thread I keep pulling on here, first as the [verification tax](https://ryanmerlin.com/posts/ai-productivity-dip-longer-deeper-diverging) and then as [verification becoming the scarce step](https://ryanmerlin.com/posts/machine-attention-economy).

Adaptation barely moved.  The MIT report that put [95% of enterprise AI pilots](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/) at little to no measurable return blamed a learning gap in both the tools, which didn't "learn from or adapt to workflows," and the orgs around them.  Take the exact number with a grain of salt, since it's a snapshot of pilots.  The pattern is the useful part: the payoff stalled at the learning.

## Where the gate lands first: the check

If finish is cheap, what should a gate react to?  The Claude Code team's [redesign](https://claude.dev/blog/solving-code-review-at-anthropic/) is the most complete answer I've seen in public.  It's a team grading its own product with its own numbers, so treat it as a design with five rules worth stealing, and hold off on calling it proof.

**Human sign-off scales with consequence, not volume.**  "The change sets the tier, not the author."  Every change gets a machine review.  A low-risk change, say an addition tucked behind a *feature flag* (a switch someone can flip later), needs no human once the automated checks pass, as long as its author is on the repo's trusted list.  The riskiest code needs two.

**The checker never sees the builder's pitch.**  A second *agent*, an AI model given tools and a job, reviews each change "in a fresh context," meaning without the builder's argument for why it's right.  It's still the same model underneath, so it shares the builder's blind spots, the failure I described in [Composed Correction](https://ryanmerlin.com/posts/composed-correction).  Hence the blunt rule: "An agent's approval never counts as a person's."  Whoever prompted the agent is on the hook as a reviewer.

**Findings get checked before a human reads them.**  A separate group of agents votes on each finding, and it only posts if enough agree it's real.  When the reviewer launched as a research preview, the share of internal changes getting a substantive review comment went from 16% to 54%.  From June to September, alongside other process changes, merged changes (ones accepted into the product) more than doubled while the share that had to be backed out fell by more than 40%.[^3]

**Show the output.**  The builder is asked "to show the output instead of saying it's done": test results, or the exact command and what it returned.  A model can write a convincing story about what it did.  Output captured by tools the builder doesn't control is harder to fake and easier to audit, though a weak test still passes honestly.[^4]

**The check needs an off switch.**  One change went through more than fifty rounds of machine review and fixes overnight before its author killed it.  A builder agent and a reviewer agent "can keep each other busy indefinitely."  The team now caps it at three rounds, then the reviewer tells the author to step back and rethink.  Who in your process gets to say enough?

Open source ended up in the same spot.  Of [281 project AI policies](https://arxiv.org/abs/2609.07542), 83% allow AI contributions, usually with strings attached: two-thirds demand heavy human involvement, and about half require disclosure.

That gives a placement rule.

> **Hand work to AI wherever the next step can cheaply check it.  Hold it back wherever nothing downstream can tell good from good-looking.**

| Hand it over | Hold it back |
| --- | --- |
| A contract summary a lawyer reads against the contract | A board memo nobody will verify |
| Code a second reviewer audits with the test output open | An open inbox where every submission costs an expert an hour |

## Where the gate lands second: the lesson

Most teams now budget for generating and for reviewing.  Few I've seen budget for what comes after, which is keeping what worked and resetting the default so the next round starts there.

The Claude Code team's version is small.  When a change causes an incident, something breaking for real users, it becomes a test case, and the reviewing agent gets scored against the whole set every day.  The org's best current understanding sits where a machine reads it daily, and every new change gets checked against it.  Isn't that what it means for a company to remember?

There's a catch.  Lock the lesson in as the default and every team copies it.  *Esteve Almirall* and *Chris Tucci* [simulated what that does](https://arxiv.org/abs/2609.28681) this September: "copying leaders consumes diversity quickly, whereas repertoires paired with local judgment preserve generative capacity."  In English: if every team copies whoever's winning right now, you burn through the alternatives fast, and once conditions change, what's popular stops being a good guide to what's right.  New models change the conditions every few months.  It's a simulation, so take it as a warning.  I'd still fund a few experiments that ignore the house style even when they lose.  I don't know the right size for that slice, and I'd distrust anyone who says they do.

## What stays at the front

Does the front gate go away, then?  I assumed so until I tested it while writing this post.  Three models drafted it independently from the same notes, and I expected three essays I could check against each other.  They came back nearly identical, because my brief contained the outline.  The call that mattered was made before any of them wrote a word, and no amount of checking afterward could bring back the essays I'd already ruled out.

The Claude Code team keeps that call human too.  First on its list of what people still own: "Deciding whether to build it."

The front gate's question changed.  It used to ration effort: is this worth six weeks?  Now it sets the test: is this worth anyone's attention, and what counts as right?  Point a flawless review process at the wrong test and it'll confirm, reliably and at scale, that you built the wrong thing correctly.

## The question to carry

Your approval gates were placed when effort could stand in for judgment.  Building is cheap now, and that proxy is dead.

> **Which of the three costs is your gate still sitting on?  And who wrote the rule for what counts as right, and can anyone in the room read it?**

[^1]: Hiring shows a similar problem in slower motion.  In a Robert Half survey of more than 2,000 U.S. hiring managers, [65% said](https://press.roberthalf.com/2026-03-10-Robert-Half-survey-67-of-HR-leaders-report-AI-generated-applications-are-slowing-hiring) AI-polished applications have made skills harder to verify, and 67% said reviewing them has slowed hiring.

[^2]: Figures from the HBR write-up of the BetterUp Labs and Stanford Social Media Lab survey, September 2025.  Telemetry from more than 10,000 developers at *Faros AI* points the same way: teams with high AI adoption [merged 98% more changes while review time rose 91%](https://www.faros.ai/blog/ai-software-engineering).  That's vendor telemetry and correlational.

[^3]: Three different measurements.  The 12x is daily changes across Anthropic's main shared codebase, May to September.  The doubling and the 40% drop in the backed-out share are merged changes to the Claude Code codebase, June to September.  The 16% to 54% is internal changes at the reviewer's research-preview launch.  All self-reported, with several process changes landing together.

[^4]: Models narrate the way people do.  Ask one to explain its answer and the explanation [doesn't reliably reflect](https://arxiv.org/abs/2305.04388) what drove it, and in one study [bigger models told less faithful stories](https://arxiv.org/abs/2307.13702) on most tasks tested.  I wrote about the human version in [The Press Secretary in the Skull](https://ryanmerlin.com/posts/consciousness-the-press-secretary-in-the-skull).  Self-declared provenance is the weak form: the Linux kernel asked contributors to tag AI-assisted patches, and [over 1,200 commits](https://lwn.net/Articles/1083124/) carry the tag alongside a steady stream of machine-written patches that don't.  After the October 2026 Maintainers Summit, kernel developers [agreed to drop the requirement](https://lwn.net/Articles/1099594/).