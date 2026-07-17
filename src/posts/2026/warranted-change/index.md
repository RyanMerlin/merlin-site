---
title: "The Warranted Change"
created: "2026-07-17"
status: "published"
tags: ["ai-agents", "enterprise-ai", "agentic-ai", "software-economics", "ai-insurance"]
summary: "Gartner says agentic AI puts $234 billion of enterprise application spending at risk by 2030. The money doesn't disappear, it changes hands and changes shape. Here is the new thing the winners compete on, and the unit that captures it."
description: "Agentic AI reprices software from access to accountability. When an agent acts, who answers? The warranted change is the new unit of software value."
---

![A vast, dim hall where an endless stream of identical glowing blue documents flows into the distance like a river of cheap, anonymous output.  At a lone stone counter, a single figure works a heavy brass embossing press, sealing one document that glows warm gold beneath it, the one change someone will stand behind.](./og.png)

Gartner just told the enterprise software industry that [$234 billion of enterprise application spending is "at risk"](https://www.gartner.com/en/newsroom/press-releases/2026-07-01-gartner-says-us-dollars-234-billion-in-enterprise-application-software-spend-is-at-risk-from-agentic-artificial-intelligence) from agentic AI by 2030, roughly one in five dollars of application SaaS spending.  The room read it as an obituary.  But an obituary for whom, and for what, if the money doesn't disappear so much as change hands and change shape?

Let me put my cards on the table up front, because it shapes how I read this.  I build agent systems where every action has to be attributable, reviewable, and recoverable, so I'm primed to see accountability as valuable.  What follows is a practitioner's bet, not a market forecast.  Here's the bet: most of that $234 billion relocates, and the thing the winners end up competing on isn't the software at all.

## What did Gartner actually say?

Pull the claim to the primary source rather than the reactions to it.  The threat Gartner describes is not that software gets cheap to build.  It's that agents do the clicking for you.  When an agent works across ten systems on your behalf, you stop touching the software directly, and Gartner's analyst names the consequence: agents are "making the software invisible," which "breaks the link between user growth and revenue growth."  Gartner even has a name for the exposed spending: *agentic arbitrage*.

It's the difference between browsing a store's website and telling an assistant "restock the kitchen."  The store still ships the goods.  But it lost the storefront, the upsell, the search bar, and the reason you ever looked at its interface.  A vendor whose price rode on seats and logins may have just lost its most visible meter.  It can try to install a new one, usage pricing or outcome pricing, and Gartner expects many will.  So the money doesn't vanish.  It moves.

## So where does $234 billion actually go?

Some becomes buyer savings.  Some moves to AI-native vendors, to inference, orchestration, integration, observability, governance, and services.  Gartner's own read is that new entrants building horizontal agentic platforms capture a lot of it.  I think that's mostly right, and it sharpens the interesting question rather than settling it.  If the interface is invisible and generating the software trends cheap, price competition drags the old sources of margin toward the floor.  That generation is the new commodity is a shift I've traced from the [technical side](https://ryanmerlin.com/posts/the-loss-function-is-the-product) already; here I'm following the money.  So what's left that a buyer will still pay a premium for?

Run down that list of destinations and ask which one a CFO would happily pay *more* for than the software it replaced.  Most of them are cost centers you'd rather shrink.  One isn't, and it's the one almost nobody is pricing yet.  My bet is that it's accountability: the assurance that when an agent acts, someone can show what it did and answer for it when it's wrong.

## What were you ever actually paying for?

Think about what you buy when you buy enterprise software.  The screen was never the whole product.  You paid for the thing to be right, and for someone to answer when it wasn't.

Agents make the interface, and a growing share of the implementation, cheap.  They don't make the outcome correct, and they don't answer for it when it's wrong.  If anything, they make correctness harder to see.  The work of checking, approving, and recovering an agent's output doesn't disappear when the agent shows up.  It goes quiet, which is not the same as going away.  I've written before about how that hidden cost can [quietly swamp the measured speedup](https://ryanmerlin.com/posts/ai-productivity-dip-longer-deeper-diverging); here the point is narrower.  Someone still has to answer for the change, and that someone is getting scarcer, and more valuable.

That quiet cost is the slice that doesn't commoditize.  You stop paying for the seat.  **You start paying for the warranty on the change.**

What does it mean to warrant a change, concretely?  The action carries a record of what it did, why, and on whose authority, tied to an identity, reconstructable after the fact, with a named owner who answers if it turns out wrong.  That isn't a feature you bolt on.  It's the difference between "the model said so" and "here are the receipts."  A *warranted change* is my term for a change someone will stand behind.

## Is anyone actually pricing this?

If that still sounds abstract, follow the money that's already moving.  The business press is arguing about the $234 billion.  The legal press is [warning about who's liable](https://www.cliffordchance.com/insights/resources/blogs/talking-tech/en/articles/2026/02/agentic-ai-and-the-liability-gap-your-contracts-may-not-cover.html) when an agent quietly deletes your records.  Those look like two separate conversations.  They're one, and a market is forming in the gap between them.

[Munich Re](https://www.munichre.com/en/solutions/for-industry-clients/insure-ai.html) has insured AI model performance since 2018.  [Armilla](https://www.armilla.ai/) has offered an insurance-backed AI performance warranty since 2023, paying out when a covered product misses its contracted thresholds.  [AIUC](https://aiuc.com) sells standards, audits, and insurer-backed coverage, and its 2026 report, whose authors include [researchers affiliated with Anthropic and OpenAI](https://www.underwriting-agents.com/), argues that the vast majority of AI-agent risk still sits in "silent" coverage: buried inside ordinary cyber and liability policies, neither named nor priced.  Surveys of corporate insurance buyers put the appetite even higher, north of 90% wanting cover built for AI risk.  The demand is loud, the supply is early, and the product is still taking shape: part evaluation, part controls, part contractual promise, part insurance.

Regulation is moving the same direction, if slower than the headlines suggest.  [Article 12 of the EU AI Act](https://artificialintelligenceact.eu/article/12/) requires high-risk AI systems to keep automatic logs of what they do.  The [Digital Omnibus](https://www.consilium.europa.eu/en/press/press-releases/2026/05/07/artificial-intelligence-council-and-parliament-agree-to-simplify-and-streamline-rules/) pushed that obligation for most high-risk systems out to December 2027, so it's a direction of travel, not a deadline at your throat.  But the direction is set: for consequential AI, the record of what the system did stops being optional.  So here's a question worth carrying into your next architecture review.  If an auditor, a regulator, or a litigant asked you to reconstruct one consequential thing your agents did last quarter, what it was allowed to do, what it saw, which tools it called, and who owned the result, could you?

## What changes on your side of the table?

If you're signing enterprise software this year, your evaluation criterion is moving.  Many of your existing contracts still assume passive software, and, as Clifford Chance argues, they may not cleanly allocate risk for the one thing agents now do, which is act on their own.  So stop scoring vendors on features and seat counts alone.  Add the question that actually bites: when your agent gets it wrong, who eats it?

And if your answer is "we'll build our own agents, so there's no vendor to blame," look carefully at what you just did.  You didn't escape the warranty.  You wrote it yourself, and you're holding the whole risk, most of it still unpriced.  Building can absolutely be the right call.  Just don't mistake it for making the accountability disappear, because that's the one thing agents guarantee you can't do.

## The new unit

Here's where the bet lands.  The vendors who capture the slice that doesn't commoditize won't be the cheapest at generating software.  They'll be the ones who stand behind the outcome.  The market is watching the cost of generation fall and calling that the story.  I think it's underpricing assurance, and I'd bet a lot of the durable margin ends up there.  Call it a practitioner's hypothesis with skin in the game.

The seat was the old unit of software value, the license to touch the tool.  The new one is the *warranted change*: the provable, owned, someone-is-accountable-for-it change.  You're no longer paying for a seat.  You're paying for a signature, for the authority to make a change and the promise to stand behind it.  Ask your next AI vendor to warrant it, and watch how fast the room gets honest.
