---
title: "The Next Attention Economy Has No Eyeballs"
created: "2026-07-17"
status: "published"
tags: ["ai-agents", "economics", "machine-attention", "agent-marketplaces", "skills", "mcp", "platform-power"]
summary: "Skills marketplaces are becoming the first visible exchanges for a new scarce resource: not human notice, but admission to the trusted decision-and-action loops of AI agents."
description: "AI agents create an attention economy upstream of the human one, where the scarce resource is not notice but admission to their trusted decision loop."
---

![A vast, dim marble hall with no people in it.  A tall, faceless machine sentinel with no eyes holds a glowing ledger beside a low turnstile, reaching toward a single capability-card that glows warm rust-orange, the only real light in the room, while a long line of identical dim cards waits its turn in the shadows.](./og.png)

Companies have spent thirty years learning how to be seen.  Search rankings, ad budgets, the perfect headline, all of it a fight over one scarce thing: a person's attention.  The next fight is already under way, and it's stranger, because the buyer you have to win over now has no eyes.  When an AI agent books the trip, picks the vendor, or assembles the software stack, it settles on a few options to trust and drops the rest before any human sees a screen.  I build the systems where that choice gets made, and after watching it run a few thousand times, I can tell you it looks a lot like the old attention economy, moved to a room the customer never enters.

That old economy ran on a simple loop.  Turn notice into traffic, traffic into data, and data into money.  AI agents are opening a second attention economy upstream of the first, and it begins before a person sees any options at all.

The first exchanges in this new economy don't look like ad exchanges.  They look like plugin directories.

Every enterprise buyer already knows this shape from procurement.  Purchasing keeps an *approved-vendor list*.  You can be the cheapest, most reliable supplier in your category, and if you're not on that list, the buyer can't cut you a purchase order.

> The list decides who's allowed to be considered, long before anyone compares prices.

An AI agent keeps a list like that too, for tools and data sources and counterparties.  This one updates itself, and nobody publishes it.

So here's the bet this piece is making.  The scarce thing in an agent economy isn't notice.  It's admission to that list.  Admission is starting to look rankable, then ownable, maybe one day sellable, and the companies that noticed first are the ones building the directories, even if the directory turns out to be the visible tip of where the value really sits.  Whether all of this hardens into a genuine market is the open question this piece keeps circling.

## What am I actually calling attention here?

Let me kill the ambiguity before the word runs away from us, because it points at four different things and only one of them is the subject.

I don't mean the *attention* mechanism inside a transformer, the math that lets a model weigh some tokens more than others.  I don't mean a machine having an inner experience.  I don't mean the physicist's observer.  I mean attention in the plain economic sense the field has used since *Herbert Simon*, the sense in which a scarce resource gets *allocated*.

Call it **allocative machine attention**: the bounded consideration an AI system spreads across competing sources, tools, and counterparties when that choice changes what gets represented or acted on.

The definition earns its keep through three words.  *Bounded* means the system can't evaluate everything at equal depth, because it runs out of tokens, retrieval slots, latency budget, money, or human patience first.  *Competing* means one option gets an opening another doesn't.  *Changes representation or action* means the choice leaves a mark, something gets surfaced, invoked, purchased, routed, or quietly dropped.

Does the machine need to be conscious for any of this?  No, and that's the point that trips people up.  A compiler rejects your program without feelings about it.  A credit system denies a loan without wanting to.  An agent drops a vendor from the candidate set without caring who wins.  The property that matters isn't experience.  It's *delegated discretion under constraint*.  Give a system a budget and permission to act, and it's already allocating attention whether or not anyone's home.

## Haven't people already seen this?

They've seen the neighborhood.  The honest version of the claim has to concede that first.

*Simon* named the core trade more than fifty years ago: [information consumes attention](https://gwern.net/doc/design/1971-simon.pdf), so an abundance of information manufactures a scarcity of whatever has to process it.  Economists later turned limited processing into a formal variable under [rational inattention](https://www.sciencedirect.com/science/article/pii/S0304393203000291).  Platform scholars showed how digital intermediaries collect [algorithmic attention rents](https://www.cambridge.org/core/journals/data-and-policy/article/algorithmic-attention-rents-a-theory-of-digital-platform-market-power/D85FE41F6CF99FC57DDFB2B2B63491C5) by controlling which suppliers reach human eyes.  And the machine-facing pieces are landing fast: [Generative Engine Optimization](https://arxiv.org/abs/2311.09735) studies how sources fight to appear inside generated answers, controlled-shopping work like [ACES](https://arxiv.org/abs/2508.02630) shows AI buyers have measurable, gameable position biases, and economists are already modeling an [economy of AI agents](https://www.nber.org/books-and-chapters/economics-transformative-ai/economy-ai-agents) and the [transaction costs](https://www.nber.org/papers/w34468) agents might collapse or create.

So if the argument were only "companies will optimize for bots," you should close the tab.  That argument already shipped.

The narrower claim is the one worth your time.  Retrieval, citation, recommendation, tool selection, permission, and execution are not six separate AI curiosities.  They're successive gates in one market, the market for turning machine consideration into economic action.  Nobody's arguing you can't see the pieces.  The pieces are the point.  What hasn't happened yet is treating them as a single exchange, with a single scarce good moving through it.

## Doesn't a bigger context window just make this go away?

That's the reflex, and it's wrong in an instructive way.

The old attention economy was organized around the screen, around what a person could notice, click, and remember.  An agent moves the bottleneck upstream, to the moment before anyone sees a recommendation.  By then the system may already have decided which registries it trusts, which plugins are enabled for your role, which tools fit inside its budget, which sources are even retrievable, which claims are cheap enough to verify, and which actions it's allowed to take at all.  The answer you read is the visible edge of a much larger exclusion you don't.

A bigger context window doesn't dissolve that.  It moves it.  Make retrieval cheap and verification becomes the scarce step.  Make verification cheap and authorization becomes scarce.  An agent can generate a thousand recommendations, and the company can still sign exactly one contract.  I made the narrow version of this case in [The MCP Explosion Has a Scaling Problem](/posts/mcp-explosion-scaling-problem): every tool you add carries a discovery and selection cost, so an expanding catalog turns choosing into an architecture problem.  The broader shape holds everywhere.  Scarcity lives wherever the system still has to exclude, and it always has to exclude somewhere.  The machine reads faster than you.  It still can't load, verify, and safely act through the entire world.  And a bigger window doesn't even guarantee a better pick.  One 2026 study, [Looking Is Not Picking](https://arxiv.org/abs/2606.16364), found that the tested agents often attend to the right tool and still choose wrong, because the bottleneck sits in the decision itself, not the size of the menu.

## Where does the money actually live?

A mention is not a market outcome.  A skill can rank first and never get installed, get installed and never invoked, get invoked and fail, and even succeed while making the user worse off.  So the market can't be measured at any single point.  It lives in a ledger that follows the decision all the way through.

![The machine-attention ledger: Eligible, Retrieved, Verified, Considered, Recommended, Invoked, and Executed.  Every boundary can exclude, monetize, or audit.](./machine-attention-ledger.svg)

Read it as the path from approved-vendor list to delivered goods.  Each gate asks a different question, and each has a different owner.

| Gate | The question it answers | Who controls it |
|---|---|---|
| Eligible | Can this thing participate at all? | Admin, platform, policy, registry |
| Retrieved | Does it enter the candidate set for this task? | Search, retriever, marketplace ranking |
| Verified | Can its identity and claims be checked cheaply? | Trust service, security layer |
| Considered | Does it get real evaluation, not a glance? | Model, router, planner |
| Recommended | Is it offered as the preferred option? | Agent, interface |
| Invoked | Does the system actually reach for it? | Agent runtime, permission layer |
| Executed | Does the operation complete and matter? | Tool, vendor, transaction layer |

The ladder stops at execution, but there's one more gate the diagram can't draw, because it lands after the machine is done.  Outcome.  Did the completed operation actually help, at acceptable cost and risk?  A tool can execute flawlessly and still leave the user worse off, which is why execution is delivery, not value.  And the ladder itself is a measurement simplification, not a fixed architecture.  Real systems branch, retry, check some gates continuously, and skip others entirely, and a person sometimes reaches past all of them to pick a tool directly.  Recommendation especially is an optional detour, since an agent can invoke a tool without ever showing it to a person.  For the direct action path, though, the gates still multiply.  A supplier's real odds of getting used are `P(eligible) x P(retrieved | eligible) x P(verified | retrieved) x ... x P(executed | invoked)`, each gate conditional on clearing the one before.

Why does that framing matter?  Because small edges compound into large ones.  A supplier that's twenty percent more likely to clear each of six gates is almost three times as likely to reach execution, since 1.2 to the sixth power is about 3, even if it never looked dramatically better at any single step.  The reverse bites just as hard.  A company can dominate generated mentions and still capture almost no economic action, because it dies at authentication, or permission, or runtime reliability.  Representation isn't allocation.  Recommendation isn't authorization.  Invocation isn't success.  **The market is made in the transitions between those words, not in any one of them.**

## Where can you watch this happening right now?

The emerging skill and plugin ecosystems make the whole thing measurable sooner than I expected.  They're not identical, and most aren't yet money-markets in the ordinary sense.  Some are open registries, some curated directories, some enterprise control planes.  That doesn't make them economically irrelevant, because the market logic starts the moment suppliers compete for scarce allocation under a set of rules.  The money can arrive later.

Product details in this section are current as of *July 17, 2026*.  These surfaces move weekly, so hold onto the distinctions, not the counts.

[ClawHub](https://docs.openclaw.ai/clawhub) is the open discovery surface, a registry with public read APIs for search and packages.  Its [ranking documentation](https://docs.openclaw.ai/clawhub/http-api) is unusually candid about allocation: results blend semantic relevance, exact-name boosts, and a small, capped popularity prior, and moderation state can pull a capability out of search entirely.  That's already a machine-attention function deciding what's discoverable and when trust overrides popularity.  But ClawHub also shows the measurement trap.  Its [install telemetry](https://docs.openclaw.ai/clawhub/telemetry) is deliberately minimal and disable-able, recording an aggregate install event and nothing about whether the skill was ever used.  It can tell you about reported installs.  It can't tell you the machine reached for the skill when it mattered.

[Claude's plugin ecosystem](https://code.claude.com/docs/en/discover-plugins) sits closer to the runtime than a directory-only metric, because its [organization analytics API](https://platform.claude.com/docs/en/api/admin/analytics/plugins/list) reports installs and invocations as separate numbers.  That gap is the heart of the thesis.  An install is a permission a human granted.  An invocation is an allocation the system made during real work.  Claude is one of the clearest places you can currently watch those two diverge inside an operating organization.

[OpenAI](https://help.openai.com/en/articles/20001256-plugins-in-chatgpt-and-codex) turns eligibility into an administrative primitive.  As of July 9, 2026 it folded its app directory into a Plugin Directory across ChatGPT and Codex, where a workspace admin can mark a plugin *Available*, meaning members may install it, or *Installed*, meaning the package is added automatically for a role.  Being installed isn't the same as being permitted to touch the underlying data, that's a separate app-permission layer, but the default toolkit is still the position worth wanting.  In the human attention economy a platform fought for the top of a screen.  In an agent economy the stronger position is quietly being in the role's default set.

[Smithery](https://smithery.ai/docs/build) sits closer to the machine's actual reach, giving publishers analytics for tool calls, not just installs.  A tool call isn't proof of a good outcome, since it might be a retry or an error, but it records the machine reaching for the capability, which is a real step past listing views.  [Skills.sh](https://www.skills.sh/docs) ranks reusable skills across Claude Code, Cursor, Codex, Gemini, and more, which makes it a lens on cross-agent diffusion, though its telemetry still tracks what entered the toolbox, not what the worker picked up.  And the official [MCP Registry](https://modelcontextprotocol.io/registry/about) is a preview metadata repository rather than a behavioral market, which makes it valuable for a different reason.  It can expose the supply graph underneath the storefronts, which is the raw material for telling whether a Claude plugin, a Smithery listing, an OpenAI plugin, and a ClawHub package are four competitors or one repository wearing four labels.  The registry doesn't resolve that on its own.  It hands you the identifiers a canonical map would need.

Line them up and the pattern is the same everywhere.  Each surface shows you part of the funnel and hides the part that would let you grade it.

| Surface | What you can see | The blind spot |
|---|---|---|
| ClawHub | Rank, relevance signals, installs, security state | Runtime invocation and outcome |
| Claude plugins | Org-level installs and invocations (analytics API) | Public outcome quality and value |
| OpenAI Directory | Membership, role policy, availability, defaults | Comparable public usage telemetry |
| Smithery | Discovery, tool calls, usage patterns | Task intent, counterfactual choice, welfare |
| Skills.sh | Cross-agent installs and popularity movement | Invocation and execution |
| MCP Registry | Identity, packages, capabilities, provenance | Discovery share and behavior |

The counts don't even mean the same thing across columns, since one platform's install is a unique person and another's is a CLI event.  But together they show where the ecosystem has started to instrument the funnel, and where the numbers that would matter most are still missing.  You can watch supply, discovery, adoption, eligibility, invocation, and a little execution.  Whether that already adds up to a market is precisely what's unsettled.  The missing work is connecting them into one line.

## Which of these numbers is the machine actually voting with?

Here's the easy mistake, and I've caught myself making it.  Calling an install "machine attention."  Usually it isn't.  A person browsed a directory, a developer copied a command, an admin enabled a plugin.  The marketplace may have nudged that choice, but the adoption event was still human.  That's human attention wearing a machine's clothes.

Machine attention starts one step later, when the enabled system faces a real task and allocates work among the tools it's allowed to use.  Which gives you a clean way to read the numbers.

> The install is the human vote.  The invocation is the machine vote.  The execution is delivery.  The measured outcome is the receipt.

So the metric that may matter most in this whole field is `P(invoked | installed, eligible, and relevant)`, the rate at which human permission converts into the agent's own choice.  The version that really counts is the agent-initiated invocation, since a person can also fire a tool by hand, and only the machine picking on its own is the machine's vote.  A capability with a million installs and almost no relevant invocations is a fashionable shelf ornament.  A capability with modest installs and dominant task-level invocation is infrastructure.  The directory can't tell those two apart.  The runtime can.

## What does attention do to the thing it lands on?

Here's the idea that actually started this for me, and it's less about economics than it looks.  The naive version is that complexity and attention are two sides of one coin.  That's not quite right, because a rock doesn't get more intricate just because people stare at it.  The sharper version is this: attention doesn't create complexity, it decides *where* complexity accumulates.

For whoever's doing the looking, attention reduces complexity.  It narrows an impossible field down to the small slice that can actually be represented and used.  That's true in your own head, where a tiny access layer selects from a vast background you never consciously touch, and I wrote about that cognitive version in [The Access Layer](/posts/the-access-layer).  It's just as true in an agent, where retrieval and tool discovery pull a small working set out of a huge external world.

But for an adaptive thing on the receiving end, the direction flips.  A capability that keeps getting selected piles up users, logs, reviews, revenue, integrations, documentation, and fixes.  Every one of those makes it easier to select the next time.

> The observer sees less.  The observed grows more machinery around being seen.

That reversal only fires under one condition.  The surrounding system has to remember, adapt, and feed the result back.  Attention without memory is just exposure.  Attention with memory and feedback becomes structure.  Here's the line I keep coming back to.

> Attention compresses for the observer and compounds for the observed.

Hold onto that second half, because the economics of every agent marketplace is that half made literal.

## What happens after a capability gets picked?

If the system has memory, the pick leaves a residue, and the residue is where this stops being a curiosity and starts being capital.

A temporary boost produces installs.  Installs produce invocations.  Invocations produce logs, reviews, examples, integrations, revenue, and plain operational familiarity.  Every one of those lowers the cost of choosing the same capability next time.  The platform grows more confident, admins approve it more widely, publishers keep improving it, and more agents meet it as the established option.  The original boost can vanish while the advantage stays.  Call that residue **attention capital**: the assets left by prior machine selection that raise the odds of future selection.

![The sticky machine reality loop: platform admission leads to agent action, which creates records, lowers future verification cost, and makes future admission easier.](./sticky-machine-reality-loop.svg)

The loop isn't automatically bad, and I want to be fair to it.  A reliable tool *should* build a track record, and a repeatedly-successful supplier *should* get cheaper to trust.  That's a market learning.  The trouble is that memory comes in three flavors that look alike from the outside.  Performance memory records what actually worked.  Popularity memory records what got selected.  Platform memory records what the platform itself routed.  Only the first measures quality directly.  The other two correlate with it on a good day and preserve arbitrary early advantages, defaults, and incumbency on a bad one.  A marketplace ranking by prior installs is partly learning what people installed.  A model trained on generated text is partly learning what earlier models already made visible.  At some point a system starts treating the residue of its own attention as evidence that the attention was deserved.  This is familiar from [recommender-system feedback research](https://arxiv.org/abs/2007.13019), where exposure amplifies popularity and shrinks diversity.  Agents just raise the stakes, because the output isn't another recommendation.  It's a purchase, a deployed dependency, a routed ticket, a committed line of code.  The gap between measuring an advantage and manufacturing one is where the danger lives.

> Repeated selection doesn't make an option more true.  It makes it cheaper to select again.

## If a hundred agents agree, how many witnesses is that?

This is where the argument turns from economic to epistemic, and it's the part I'd defend hardest.

Picture a hundred agents evaluating the same supplier, and they all agree.  Sounds like overwhelming evidence, until you ask what they share.  They may run the same foundation model, hit the same search index, trust the same registry, and call the same underlying MCP server.  They're a hundred separate processes querying one compressed view of the world.  And that phrase is more literal than it sounds.  There's a serious case, laid out in 3Blue1Brown's recent [*Compression and Intelligence*](https://3blue1brown.substack.com/p/reinventing-entropy) series, that a model gets smart precisely by compressing the world.  Predicting the next word well and compressing text turn out to be the same math, so a trained model works like an aggressive compression of its data, keeping the patterns that predict and letting the rest fall away.  Run a hundred agents on that model and they don't just share what it learned.  They share what it dropped.  Prompts and tools and sampling make their surface answers vary, but their gaps still point the same way.  They were independently instantiated.  They are not independent observers, because they were never independently informed.

A rough approximation from correlated-sample statistics makes it concrete: `effective observers ~= n / (1 + (n - 1) x correlation)`.  Run a hundred agents with an average pairwise error correlation of just 0.2 and your effective independent-observer count is about 4.8, not 100.  The formula is only an illustration.  It's an effective sample size for an average, not a headcount of independent minds and not the odds the crowd is right, and real dependency structures are messier than one number.  But the direction is the whole lesson.  More agents strip out independent noise.  They do nothing about shared error.

Extension markets make this worse, because listing diversity hides substrate concentration.  The same capability can show up as a ClawHub skill, a Claude plugin, a Smithery server, a Skills.sh repo, an OpenAI plugin, and an MCP Registry package.  That looks like six observations.  It may be one repository, one endpoint, one data source, and one publisher.  Telling those apart needs a canonical map that links listings through repository URLs, package identifiers, publisher identity, and shared dependencies, so you can measure the diversity that matters.  How many independent organizations, how many genuinely different codebases, how many decision systems that fail differently, how many independent evidence channels sit underneath the storefronts?  A marketplace can look competitive at the directory and be concentrated at the substrate.

> One million agents running the same retrieval stack are not one million witnesses.

The most observed things don't become more true.  They become better represented, better funded, more elaborately defended, and harder to ignore.  That's not an argument against consensus.  It's an argument for measuring dependency before you trust one.

## Who owns the list?

The human attention economy monetized impressions.  The machine attention economy can monetize admission, and admission is a deeper thing to own.

A platform can charge for registry inclusion, featured discovery, verification, preferred integration, default installation, access to identity and payment rails, eligibility for high-risk actions, or a cut of the action itself.  Some of those charges are honest, because security review and payment infrastructure genuinely cost money.  The structural worry isn't that any single gate is corrupt.  It's that owning the gate creates rent, and one company can own the marketplace, the ranking, the verification layer, the agent, the identity system, the permission policy, and the transaction all at once.  It sees which suppliers convert and tunes the rules.  The supplier sees only its final traffic, never the decisions it was quietly excluded from.

That reframes what transparency even means.  We'll be tempted to audit the generated answer, because it's the part we can read.  But a perfectly cited answer can sit on top of an opaque candidate set.  A model can accurately describe the best of the five suppliers it was allowed to consider while never mentioning the fifty excluded by a commercial deal, a missing integration, or a default nobody inspected.

> Source transparency is not candidate-set transparency.

A real decision receipt would tell you not just what evidence backed the winner, but which universe of alternatives was searched, which gates removed candidates, and which commercial relationships shaped those gates.  The payment world is already building half of that receipt.  Google's [Agent Payments Protocol](https://ap2-protocol.org/) wraps each agent purchase in signed *Mandates* that record who authorized it and within what limits, and in April 2026 the [FIDO Alliance](https://fidoalliance.org/fido-alliance-to-develop-standards-for-trusted-ai-agent-interactions/) began standards work on trusted agent interactions, folding in approaches like AP2.  The authorization receipt is arriving.  The candidate-set receipt, the one that would show you what got excluded, is the harder half still missing.  In the old economy the ad auction sold impressions.  In this one, **the agent auction sells eligibility, and the most valuable placement may never appear on a screen at all.  It's the default permission nobody thought to inspect.**

This is a live question I have to answer in my own systems, and I don't get to ignore it.  When my agents build a candidate set, can I show, after the fact, what got excluded and why?  Most of the time the honest answer is "only if I designed for it up front," which tells you how easy this is to leave out.

## What would make me drop the whole argument?

A thesis with no exit is just a mood.  Here's mine, and each of these is a real experiment, not a rhetorical one.

You don't need a synthetic shopping study to test this, because the marketplaces already expose pieces of the funnel in operating systems.  Build a daily panel across ClawHub, Claude, Smithery, Skills.sh, OpenAI's directory, and the MCP Registry, and exploit the natural experiments they hand you.  A skill gets verified.  A security warning appears.  A plugin flips from optional to default.  Track the listing before and after against matched controls, and pair it with a partner who can see runtime, so you can measure install against invocation against execution rather than guessing.  The one hinge metric is `P(invocation | installed, eligible, relevant)`, and the crucial interaction is whether machine-facing legibility helps agents find genuine quality or *substitutes* for it.  The first is a better market.  The second is rent-seeking.

Now the ways I lose.  If machine-facing tweaks change retrieval and mentions but not invocation or execution, then this is just GEO with a new coat, a story about representation, not action.  If underlying quality dominates once preferences are explicit, the legibility premium mostly helps discovery and the normative worry shrinks.  If verification and default shocks evaporate the moment they're removed, then attention capital is weak and I've oversold the stickiness.  If nearly everything installed is invoked explicitly by people rather than chosen by agents, then these are still human-attention markets and the machine market hasn't actually arrived.  Any of those would move the boundary, not destroy the study.  The theory has to earn the right to be provocative, and the way it earns it is by naming the results that would make it retreat.

## So what do you actually do about it?

If you're building or buying agent-mediated capability this year, your evaluation question is moving, and it's worth saying out loud.  The old question was "what will the model say about us?"  The new one is sharper: can a delegated system identify us, verify us, get permission to use us, execute through us, and prove afterward what happened?

That's a product and security and identity problem, not a marketing one.  A company with polished pages and unreliable interfaces will be easy to describe and hard to use, which is exactly the profile an agent economy punishes.  The durable advantage goes to whoever is easiest to *admit*: stable identity, verifiable claims, least-privilege permissions, deterministic operations, and receipts that separate what performed from what was merely popular.  Brand doesn't vanish, it compresses into a trust prior, but the prior is only worth what you can convert it into a safe, auditable operation.  The uncomfortable part is that the companies that win machine attention first may not have the best products.  They may just be the easiest to admit, and the real market-design job is making those two groups converge.

I'd extend the same demand to the platforms building these directories, because they're early enough that their measurement choices still shape the field.  Don't collapse the funnel into one popularity number.  Separate installs from eligibility from invocation from execution from outcome, disclose what's paid or default, and expose enough lineage to tell independent evidence from copied evidence.  There's a competition-policy question hiding in the architecture, and it's worth posing carefully rather than asserting.  Controlling a default isn't the same as foreclosing a market.  A market can look open at the directory and be closed at authorization, listing ten thousand tools while a default role policy makes ten of them economically real, and whether that's prudent risk management or quiet foreclosure is exactly what a regulator now has to decide.  That's not hypothetical.  In June 2026 the [European Commission ordered Meta](https://ec.europa.eu/commission/presscorner/detail/en/ip_26_1276) to restore free access for third-party AI assistants inside WhatsApp, after Meta met an earlier objection by charging a per-message fee the Commission read as a de facto ban.  Owning the gate and pricing admission is precisely the move competition law is now watching for.  This is the same fight over accountability I made in [The Warranted Change](/posts/warranted-change), moved one layer down the stack, from who answers for an agent's action to who's even allowed into the room where the action gets chosen.

## The point

The human attention economy learned to turn notice into money.  The machine attention economy will turn admission into action.  The listing was never the asset, eligibility is.  The recommendation was never the outcome, execution is.

> The old web competed to be clicked.  The agentic web competes to be admitted.

The next attention economy has no eyeballs.  It has permissions, and the first exchanges are already open.
