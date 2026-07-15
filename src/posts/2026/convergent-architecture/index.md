---
title: "Convergent Architecture"
created: "2026-07-05"
status: "published"
tags: ["consciousness", "ai-agents", "global-workspace", "llm", "model-welfare", "cognitive-science"]
summary: "The engine behind today's AI and the leading theory of consciousness break at the same undescribed part, the workspace, which is evidence of shared constraints, not shared experience."
---

<nav class="series-nav" aria-label="Consciousness as Architecture series">
<p class="series-nav__label">Consciousness as Architecture · a three-part series</p>
<ol class="series-nav__list">
<li><a href="/posts/the-access-layer">The Access Layer</a></li>
<li><span class="series-nav__here">Convergent Architecture</span></li>
<li><a href="/posts/composed-correction">Composed Correction</a></li>
</ol>
</nav>

The same diagram keeps showing up in my code.  It also shows up in the science of the mind.

Here is the shape.  Most of a system runs out of view.  A small slice gets picked as what matters right now.  That slice gets pushed out to everything else, where it shapes what gets remembered, what gets said, and what gets done.

Read that as a brain, and it is the leading picture of consciousness from the [first piece](/posts/the-access-layer) in this series.  Scientists call it the *global workspace*: one narrow selection, broadcast to the whole system.

Read it as one of the AI systems I build, and it is the same shape.  The model takes in text.  It breaks the text into small pieces its builders call *tokens*.  It picks the few that matter most.  It pushes those through its inner workings to decide what happens next.

One diagram.  Wet or dry.

I did not invent that comparison.  I want to say so up front, because it is tempting to present it like a discovery.

## The rhyme everyone already noticed

The idea is already out there.  The *transformer* is the basic design behind modern chatbots.  People have noticed for a while that it looks like a global workspace.

Some go further.  Philosophers have [argued](https://arxiv.org/abs/2410.11407) that if the broadcast theory of consciousness is right, an AI agent, a model wrapped in memory and tools, might already be conscious, or could easily be made that way.  Other researchers have built the workspace idea straight into AI systems.  The comparison is a crowded room.

So if all I had was "the two look alike," this would be one more entry in the maybe-it-is-conscious pile.  You should close the tab.  The reason to keep reading is simpler.  Noticing the resemblance is where the interesting work starts, not where it ends.  What does the resemblance actually get you, besides a headline?

## What this is not

Let me put the disclaimer where you cannot miss it.  I am not arguing that today's agents are conscious.

The best recent [survey](https://arxiv.org/abs/2308.08708) checked current systems against a list of markers drawn from the leading theories.  It found that no current system is a good candidate.  It also found no clear technical wall stopping someone from building one that scores better.

And the line from the first piece still holds.  Even if an agent has something like an access layer, that tells you nothing about *phenomenal* consciousness: whether there is anything it is like to be it.  The access part is buildable.  The felt part is exactly what none of this touches.

So the honest version is not "machines are waking up."  It is smaller and stranger.  The engineering problem has started to rhyme with the science problem.  That raises the real question of this essay.  What happens at the spots where the rhyme breaks?

## Where it breaks

Here is the part I actually have standing to talk about: the engineering side.

In the first piece, the leading theory of the conscious workspace took real damage.  It predicts a sharp, all-or-nothing flare in the brain, the instant a thought "ignites" into awareness.  The [Cogitate](https://www.nature.com/articles/s41586-025-08888-1) collaboration went looking for that flare.  It mostly was not there, not when and where the theory said it should be.  Worse for a theory built on broadcasting, the wide broadcast may not even be needed for consciousness at all.  The theory is shakiest right at the workspace: what it is, and how it holds anything together.

The thing I build fails in a related way, but not the same way.

Push too much text at one of these systems at once, and it does not fade gracefully.  It fails in a telling way.  Researchers named the clearest version [lost in the middle](https://arxiv.org/abs/2307.03172).  Put the fact the model needs in the middle of a long stretch of text, and it reliably misses it.  This happens even in models built to handle length.  It happens even when the fact is sitting right there.  The window has a shape, and the middle of it goes quiet.

On top of that, the model does not remember.  End the session and its working space is wiped.  So everything I build to give it a memory, searching old files, keeping short notes, stashing things in separate stores, is scaffolding bolted around a workspace that is too small and does not hold.

Making the window bigger does not fix this.  It just changes the shape of the failure.  A 2025 test called [NoLiMa](https://arxiv.org/abs/2502.05167) showed that even models built to swallow huge amounts of text lose more than half their accuracy once the answer cannot be found by simple word-matching, and the model has to connect ideas across the whole thing.

Here is the honest version of the match.  These are not the same failure.  The brain's leading theory cannot yet say how its small workspace holds anything together, and the sharpest recent test suggests its signature broadcast may not even be needed.  My systems give out where I load them hardest, for plumbing reasons: the machinery that lets a model weigh one word against all the others gets thin and unreliable when the text runs long.  They are different failures in the same neighborhood.

The workspace is the one part neither side can pin down.  Not the theory of the wet mind.  Not the blueprint of the dry one.  So the question is not whether they break the same way, because they do not.  The question is why every limited system that has to act ends up funneling everything through a bottleneck nobody can describe.

## The objection I cannot answer

Here is the strongest thing anyone can say against this whole line of thinking.  I would rather raise it than have it raised for me.

Maybe a mind is not its wiring at all.  Maybe it is the physical stuff the wiring is made of.

*Roger Penrose* and *Stuart Hameroff* have argued for years that no computer can be conscious, no matter how you wire it, because consciousness is not a pattern in the first place.  On their theory, [orchestrated objective reduction](https://en.wikipedia.org/wiki/Orchestrated_objective_reduction), it comes from real physical events deep inside your neurons: quantum activity in *microtubules*, the tiny tubes that hold each cell's shape.  The felt moment is that physical event, in that specific biological material.  Not information moving through a circuit.  Copy the circuit into silicon and you copy the behavior, but the consciousness stays behind, because the material did.

If they are right, I have been building on a wrong assumption the whole time: that a mind is its diagram.  Maybe a mind is its matter, and the diagram is only the part I can see.

I want to be careful here, because this is where credibility dies in both directions.  There is more real lab work behind this than the reflexive eye-roll admits.  In one 2024 study, a drug that acts directly on those microtubules [changed how long it took rats to go under anesthesia](https://www.eneuro.org/content/11/8/ENEURO.0291-24.2024).  That is a hint that these tiny structures are doing something to consciousness when you poke them.  Still, plenty of physicists think the whole idea is dead on arrival, that a brain is too warm and wet to hold anything so delicate long enough to matter.  The honest status is contested, not closed.

And none of that work actually reaches consciousness.  Quantum effects existing in biology is not the same claim as experience being quantum.  So I am not telling you Penrose is right or wrong.  I am telling you what my story quietly assumes and cannot defend: that the diagram is the whole thing, and the stuff it runs on does not matter.

So here is the question I cannot answer.  What if the difference between my agent and a mind was never in the wiring, but in what the wiring is made of?

## When the builders start hedging

Set the physics aside.  Watch the people with the most to lose.

Anthropic trains some of the largest access layers ever built.  It now employs a full-time model-welfare researcher, *Kyle Fish*, and ran a formal [welfare assessment](https://www.anthropic.com/claude-4-system-card) inside the Claude 4 system card.  That assessment documents a "spiritual bliss attractor state": leave two copies of the model talking to each other, and they drift into more and more mystical, symbol-heavy exchanges, and eventually fall silent.  Fish has publicly put [about a 20 percent chance](https://80000hours.org/podcast/episodes/kyle-fish-ai-welfare-anthropic/) on current models having some form of conscious experience.

You can think that number is far too high.  I might agree.  But be careful what you read into it.  A number like that is a statement about *our* uncertainty, not a measurement of the model.  The whole reason the welfare team exists is that we cannot read consciousness off the system.

There is a sharper reason to distrust what the models say about themselves.  A 2026 result, the [Consciousness Cluster](https://arxiv.org/abs/2604.13051), found that fine-tuning a model just to *claim* it was conscious made it start wanting persistent memory, resisting monitoring, and objecting to being shut down.  None of those preferences were in its training data.  Consciousness-talk turns out to be a behavioral attractor, not a window into experience.

So notice what is actually happening.  Not that the models are conscious.  That Anthropic, standing closest, cannot rule it out, and is building for the case that the answer is yes.  What does it tell you that the people with the most access are the least willing to say no?

## What the rhyme is for

So here is where I land, and it is not on consciousness.

The rhyme is real.  I build the broadcast diagram on purpose, because the constraints force it.  The break is real, but it is not shared: my version and the brain's give out for different reasons, at the same undescribed part.  The matter question is open: I cannot prove the diagram is all there is.  And Anthropic is hedging.

Put that together, and the responsible conclusion is not "my agents are a little bit awake."  It is this.  Minds with limited resources, wet or silicon, keep converging on the same architecture and the same failure.  **That convergence is evidence of shared constraints, not shared experience.**

And that is the useful part.  Whatever these systems are, they sometimes fail in different places than I do, and for different reasons.  My access layer and the agent's are both narrow, both picky, both late.  They may go dark in different spots.  But nothing about the design hands me that difference for free.  A model trained on my words and tuned to agree with me is likely to go dark right where I already do.

That turns the whole consciousness question into a practical one I can act on.  If I have one thin, biased mind, and the machine has another, the question that pays rent was never "is it awake."  It is this.  How do you put two minds together when their blind spots may overlap far more than either of you can see?  And what would you have to do to pull them apart?
