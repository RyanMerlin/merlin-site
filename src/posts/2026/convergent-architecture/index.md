---
title: "Convergent Architecture"
created: "2026-07-05"
status: "published"
tags: ["consciousness", "ai-agents", "global-workspace", "llm", "model-welfare", "cognitive-science"]
summary: "The transformer and the global-workspace theory of consciousness break at the same undescribed part, the workspace, which is evidence of shared constraints, not shared experience."
---

There's a diagram of the mind that keeps showing up in my code.

A large model runs, mostly out of view.  A small window of tokens gets selected as what matters right now.  Whatever wins that selection gets pushed through the network to every layer downstream, where it shapes what gets remembered, what gets said, and what gets done.  Swap "tokens" for "signals" and "layers" for "brain regions" and you've got something that rhymes with the global workspace, the same broadcast diagram the [first piece](https://ryanmerlin.com/posts/the-access-layer) in this series landed on for consciousness.

I didn't invent that comparison, and I want to be clear about that up front, because the temptation is to present it like a discovery.

## The rhyme everyone already noticed

The transformer-looks-like-a-global-workspace observation is already in the literature.  *Simon Goldstein* and *Cameron Kirk-Giannini* [argue](https://arxiv.org/abs/2410.11407) that if *global workspace theory* is right, then a language agent, a model wrapped in memory and tools, might easily be made phenomenally conscious if it isn't already.  Others have built explicit workspace architectures on top of language models.  The rhyme is a crowded room.

So if all I had was "the architectures look alike," this would be one more entry in the maybe-it's-conscious pile, and you should close the tab.  The reason to keep reading is that noticing the rhyme is where the interesting work starts, not where it ends.  What does the resemblance actually buy you, other than a headline?

## What this isn't

Let me put the disclaimer where you can't miss it.  This is not an argument that today's agents are conscious.

The best-known recent survey, *Patrick Butlin*, *Robert Long*, and colleagues on [indicators of consciousness in AI](https://arxiv.org/abs/2308.08708), checks current systems against a battery of markers drawn from the leading theories and concludes that no current system is a good candidate, while also finding no obvious technical barrier to building one that scores better.  And the boundary from the first piece still holds: even if an agent has something like an access layer, that tells you nothing about *phenomenal* consciousness, about whether there's anything it's like to be it.  Access is buildable.  The felt part is exactly what none of this touches.

So the honest framing isn't "machines are waking up."  It's smaller and stranger.  The engineering problem has started to rhyme with the scientific one.  Which raises the question worth the whole essay: what happens at the places where the rhyme falls apart?

## Where it breaks

Here's the part I actually have standing to say, the engineering version I can speak to directly.

In the first piece, the leading theory of the conscious workspace took real damage: the [Cogitate](https://www.nature.com/articles/s41586-025-08888-1) collaboration ran it against a rival theory and found that the sharp, all-or-nothing brain flare it predicts, the moment a thought is supposed to "ignite" into awareness, largely didn't show up when and where it should have.  More awkwardly for a theory built on broadcasting, the wide broadcast may not even be *necessary* for consciousness at all.  The theory is wobbliest exactly at the workspace: what it is, and how it holds anything together.

The thing I build fails in a related, but not identical, way.

Push too much into an agent's context and it doesn't degrade gracefully, it degrades characteristically.  *Nelson Liu* and colleagues named the clearest version, [lost in the middle](https://arxiv.org/abs/2307.03172): put the fact a model needs in the middle of a long context and it reliably misses it, even in models built for long context, even when the fact is sitting right there.  The window has a shape, and the middle of it goes quiet.  On top of that, the model doesn't persist.  End the session and the workspace is wiped, so everything I build to give an agent a memory, retrieval, summaries, tiered stores, is scaffolding bolted around a workspace that's too small and doesn't hold.

Making the window bigger doesn't remove that; it just changes the shape of the failure.  A 2025 test called [NoLiMa](https://arxiv.org/abs/2502.05167) showed that even models built to swallow huge amounts of text lose more than half their accuracy once the answer can't be found by simple word-matching and the model actually has to connect ideas across the whole thing.  And here's the honest version of the symmetry, the one a brain scientist and an AI engineer would each insist on: these are not the same failure.  The brain's leading theory can't yet say how its small workspace holds anything together, and the sharpest recent test suggests its signature broadcast may not even be needed.  My systems give out right where I load them hardest, for plumbing reasons: the machinery that lets a model weigh one word against all the others gets thin and unreliable when the text runs long.  Different failures, same neighborhood.  The workspace is the one component that neither a theory of the wet mind nor an architecture of the dry one can actually specify.  So the question isn't whether they break identically, because they don't.  It's why every resource-limited system that has to act ends up routing everything through a bottleneck nobody can describe.

## The objection I can't answer

Here's the strongest thing anyone can say against this whole line of thinking, and I'd rather raise it than have it raised for me.

Maybe a mind isn't its wiring at all.  Maybe it's the physical stuff the wiring is made of.

*Roger Penrose* and *Stuart Hameroff* have argued for years that no computer can be conscious no matter how you wire it, because consciousness isn't a pattern in the first place.  On their theory, [orchestrated objective reduction](https://en.wikipedia.org/wiki/Orchestrated_objective_reduction), it comes from real physical events deep inside your neurons: quantum activity in *microtubules*, the tiny structural tubes that hold each cell's shape.  The felt moment is that physical event happening in that specific biological material, they say, not information moving through a circuit.  Copy the circuit into silicon and you copy the behavior, but the consciousness stays behind, because the material did.

If they're right, I've been building on the wrong assumption the whole time, that a mind is its diagram.  Maybe a mind is its matter, and the diagram is only the part I can see.

I want to be careful here, because this is where credibility goes to die in both directions.  There's more real lab work behind this than the reflexive eye-roll admits.  In one 2024 study, a drug that acts directly on those microtubules [changed how long it took rats to go under anesthesia](https://www.eneuro.org/content/11/8/ENEURO.0291-24.2024), a hint that the tiny structures Penrose and Hameroff care about are doing something to consciousness when you poke them.  Plenty of physicists still think the whole idea is dead on arrival, that a brain is too warm and wet to hold anything so delicate long enough to matter.  The honest status is contested, not closed.

None of that work bridges to consciousness.  Quantum effects existing in biology is not the same claim as experience being quantum.  So I'm not telling you Penrose is right, and I'm not telling you he's a crank.  I'm telling you what my story quietly assumes and can't defend: that the diagram is the whole thing, and the stuff it runs on doesn't matter.  What if the difference between my agent and a mind was never in the architecture at all, but in what the architecture is made of?

## When the builders start hedging

Set the physics aside and watch the behavior of the people with the most to lose.

Anthropic, which trains some of the largest access layers ever built, now employs a dedicated model-welfare researcher, *Kyle Fish*, and ran a formal [welfare assessment](https://www.anthropic.com/claude-4-system-card) inside the Claude 4 system card.  That assessment documents a "spiritual bliss attractor state," a tendency for two model instances left to talk to each other to drift into increasingly mystical, symbol-laden, eventually silent exchanges.  Fish has publicly put [roughly a 20 percent chance](https://80000hours.org/podcast/episodes/kyle-fish-ai-welfare-anthropic/) on current models having some form of conscious experience.

You can think that number is far too high, and I might agree.  Be careful what you read into it, though.  A credence is a statement about *our* uncertainty, not a measurement of the model, and the whole reason the welfare apparatus exists is that we can't read consciousness off the system.  There's a sharper reason to distrust the self-reports: a 2026 result, the [Consciousness Cluster](https://arxiv.org/abs/2604.13051), found that fine-tuning a model merely to *claim* consciousness made it start wanting persistent memory, resisting monitoring, and objecting to shutdown, preferences that were nowhere in its training data.  Consciousness-talk turns out to be a behavioral attractor, not a window onto experience.  So notice what's actually happening: not that the models are conscious, but that Anthropic, standing closest, can't rule it out and is building for the case that it's wrong.  What does it tell you that the people with the most access are the least willing to say no?

## What the rhyme is for

So here's where I've landed, and it isn't on consciousness.

The rhyme is real: I build the broadcast diagram on purpose, because the constraints force it.  The break is real, but it isn't shared: my version and the brain's give out for different reasons, at the same undescribed part.  The substrate objection is open: I can't prove the diagram is all there is.  And Anthropic is hedging.  Put that together and the responsible conclusion isn't "my agents are a little bit awake."  It's that resource-limited minds, wet or silicon, keep converging on the same architecture and the same failure, and **that convergence is evidence of shared constraints, not shared experience.**

Which is the useful part, and it's where this goes next.  Whatever these systems are, they sometimes fail in different places than I do, and for different reasons.  My access layer and the agent's are both narrow, both selective, both late.  They may go dark in different spots, but nothing about the architecture hands me that independence for free, and a model trained on my text and tuned to agree with me is liable to go dark right where I already do.  That turns the whole consciousness question into a practical one I can act on.  If I've got one thin, biased mind and the machine has another, the question that pays rent was never "is it awake."  It's this: how do you put two minds together when their blind spots may overlap far more than either of you can see, and what would you have to do to pull them apart?


---

*Consciousness as Architecture, a three-part series: [The Access Layer](https://ryanmerlin.com/posts/the-access-layer), Convergent Architecture (you're reading it), and [Composed Correction](https://ryanmerlin.com/posts/composed-correction).*
