---
title: "The Loss Function Is the Product"
created: "2026-07-09"
status: "published"
tags: ["ai-agents", "error-correction", "orchestration", "cybernetics", "edgeplane"]
summary: "Generation is the new commodity, so the loss function that senses error and corrects is the actual product. Why correlated failure, not oversight, is the thing you have to engineer."
---

Jensen Huang, who runs Nvidia, has a rule of thumb: if your $500,000 engineer isn't burning through a quarter-million dollars a year in AI, you're underusing it.  He's right that the spend is coming.  He's just measuring the wrong side of it.

That money buys *tokens*, the small chunks of text an AI reads and writes.  It's tempting to treat them as raw fuel, where more tokens means more output means more value.  But every token is really an allocation decision.  Some of it goes to generation, the forward motion, the new code, the new draft.  The rest goes to correction: noticing the model has drifted, measuring how far off it is, and steering it back.  The ratio between those two is the number nobody is tracking, and it is the one that decides whether all that spend buys anything real.

The production data suggests the industry is spending its units of intelligence on the wrong thing.

A [2025 State of AI Code Quality](https://news.ycombinator.com/item?id=44257283) analysis found that AI-co-authored code contains 1.7 times more major issues than human-written code, with security vulnerabilities running 2.74 times higher.  Saiprapul Thotapally documented a team that [burned 202 million tokens in a single weekend](https://medium.com/@Saiprapul/202-million-tokens-in-one-weekend-hard-lessons-from-running-agentic-ai-at-scale-cedcb6b1e71e) from spawn loops, malformed retries, and context drift.  A [LeanOps analysis](https://leanopstech.com/blog/agentic-ai-cost-runaway-token-budget-2026/) found that an agent working on a multi-step task burns ten to a hundred times more than a simple chat, because at every step it re-reads everything it knows before it acts.  And the errors compound.  If each step in a chain is 85 percent reliable, a ten-step task comes out right only about a fifth of the time.  Picture a factory line where four of every five products fall off the belt before the end.  Augment Code's report on [the 80% problem](https://augmentcode.com/guides/the-80-percent-problem-ai-agents-technical-debt) puts the squeeze another way: AI can write about 1,500 lines of code in ten minutes, and a human can review about 500 in an hour.

The industry is optimizing generation.  But the part that actually decides whether the output is any good, the piece engineers call the *loss function*, the internal scorecard that measures how wrong a system is and points it back toward right, is the real product.


## The governor

The history of channeling fire is the history of this problem.

Open flame is pure generation.  Raw power, no regulation.  It cooks your dinner or it burns down the village.  For most of human history, that was the tradeoff.

The Newcomen steam engine arrived in 1712 and offered containment.  Operators watched the engine and manually adjusted valve timing based on observation.  Better than open flame.  But the correction loop was human, slow, and did not scale.  This is where most AI guardrails sit today: permissions, approval gates, human-in-the-loop review.  Containment without feedback.

James Watt's flyball governor changed the equation in 1788.  Spinning arms sensed rotational speed and mechanically throttled steam intake.  No human in the loop.  Continuous, automatic correction.  James Clerk Maxwell analyzed the mathematics in his 1868 paper [On Governors](https://en.wikipedia.org/wiki/On_Governors) and effectively founded control theory.

The breakthrough was not a bigger fire.  It was not a stronger box around the fire.  It was a feedback loop that could sense error and correct without waiting for a human to notice.

We are at the Newcomen stage of AI systems.  We have containment.  We do not yet have the governor.  The teams that build it will define the next era of this industry.


## Error correction is intelligence

This is not a metaphor.  The claim is structural, and the evidence runs across four domains that arrived at the same answer independently.

*Biology.*  DNA polymerase has a raw error rate of roughly 1 in 100,000 bases per replication step.  The finished genome lands at 1 in 10 billion.  Five orders of magnitude.  The entire gap is [correction mechanisms](https://bio.libretexts.org/): proofreading, mismatch repair, base excision repair, nucleotide excision repair.  Generation produces noise.  Correction produces stability.

The immune system tells the same story from a different angle.  Burnet's clonal selection theory describes a system that generates enormous receptor diversity at random and then applies a [correction filter](https://pubmed.ncbi.nlm.nih.gov/): negative selection in the thymus deletes any lymphocyte that would attack self.  Strip the filter and you do not get smarter immunity.  You get autoimmunity.  The intelligence is the deletion pass.

Synaptic pruning completes the pattern.  The brain overproduces connections in childhood and removes the unused ones.  A [2022 PNAS study](https://www.pnas.org/) on pruning artificial neural networks replicated the same improvements in working memory and reinforcement learning seen in adolescent development.  Better performance from removal, not addition.

*Information theory.*  Shannon's [noisy channel coding theorem](https://en.wikipedia.org/wiki/Noisy-channel_coding_theorem) established that reliable communication through a noisy channel is possible only with error-correcting codes.  Reliability is not a property of the signal.  It is a property of the correction layer.  This is a mathematical theorem, not a loose analogy.  Modern [polar codes](https://en.wikipedia.org/wiki/Polar_code_(coding_theory)) operate within 0.5 to 1 dB of the Shannon limit, and 5G telecommunications infrastructure is built on top of them.

Wiener's [Cybernetics](https://en.wikipedia.org/wiki/Cybernetics:_Or_Control_and_Communication_in_the_Animal_and_the_Machine), published the same year, defined the thermostat as the canonical intelligent system.  Not because it generates the right temperature, but because it continuously measures the gap between actual and target and corrects.  Wiener arrived at this framing during wartime anti-aircraft work.  Prediction alone was not enough.  Continuous error measurement and re-correction is what made the targeting system functional.

*Markets.*  Hayek argued in [The Use of Knowledge in Society](https://en.wikipedia.org/wiki/The_Use_of_Knowledge_in_Society) that prices function as the error-correction mechanism of distributed economies.  When a resource is mispriced, the price moves, and agents adjust behavior.  Market "efficiency" in the academic sense is really a claim about correction speed: how quickly prices converge on available information.

*Organizations.*  Toyota's Jidoka principle requires any worker to stop the production line the moment a defect is detected.  The Andon cord is the physical mechanism.  Toyota accepted lower short-term throughput in exchange for faster error signal propagation.  American manufacturers copied the cord.  They did not copy the permission structure that made pulling it safe.  The mechanism failed because the organizational context for correction had not been built.

Every system that demonstrates intelligence does so through the sophistication of its correction mechanisms.  Popper's [The Logic of Scientific Discovery](https://en.wikipedia.org/wiki/The_Logic_of_Scientific_Discovery) lands here: knowledge advances by surviving correction attempts, not by positive generation.  Generation is cheap.  It always was.


## Three costs

Intelligence reduces to three costs: the complexity of your model, the cost to run it, and the cost to update it.

All three are cost-centric.  And in all three, the dominant cost is not the initial generation.  It is the correction loop.

Complexity: a more complex model is not a smarter model.  A model whose complexity has been shaped by correction (pruning, distillation, RLHF) outperforms a model whose complexity comes from accumulation.  The synaptic pruning finding, again.

Inference cost: the token-pricing conversation treats inference as a generation expense.  Production data says otherwise.  The majority of tokens in agentic workflows go to correction: retries, self-evaluation, chain-of-thought verification, error-loop rework.  Research on [token efficiency in multi-agent systems](https://arxiv.org/html/2510.26585v1) found that waste concentrates in the correction and rework loop, not the generation step.

Update cost: the most expensive part of keeping a model useful is not the retraining compute.  It is knowing what to retrain on.  The loss function that selects training signal is the intelligence.  Everything else is matrix multiplication.


## The self-correction paradox

Here is the uncomfortable finding.

LLMs cannot reliably correct their own errors.  A [MIT TACL survey](https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00713/125177) on self-correction and a decomposition analysis of the [accuracy-correction paradox](https://arxiv.org/abs/2601.00828) established this empirically, and the result is counterintuitive.  Stronger models make fewer but deeper errors that resist self-correction.  GPT-3.5 at 66% accuracy achieves 1.6 times higher intrinsic correction rates than DeepSeek at 94%.  More capable systems produce harder-to-detect failures.

A system cannot evaluate itself using the same blind spots that produced the error.  External feedback is not optional.  It is the mechanism.

This connects to a broader measurement failure.  A [METR randomized controlled trial](https://arxiv.org/abs/2507.09089) found that experienced developers using early-2025 AI tools believed they were speeding up while they were measurably slowing down, unable to feel the direction of their own error even while living it.  The authors later [flagged a selection effect](https://metr.org/blog/2026-02-24-uplift-update/) that likely overstates the size of that slowdown, so hold the magnitude loosely, the metacognitive gap is the part that survives.  When your instruments read the altitude you want instead of the altitude you have, correction becomes impossible, and you do not feel blind from the inside, you feel fine.

What if the most dangerous failure mode in AI adoption is not generating the wrong thing, but losing the ability to detect that you generated the wrong thing?


## Composed loss functions

The self-correction paradox points to something the industry has not named honestly yet.

Humans and AI have different loss functions.  The human loss function is shaped by cognitive biases, social pressure, sunk cost, ego protection.  It is powerful in domains that require social reasoning, ambiguity tolerance, and embodied intuition.  It is systematically weak at statistical reasoning at scale, consistency across repetitions, and separating signal from emotional noise.

The AI loss function is shaped by training data, reward signal, and architecture.  It is powerful for pattern detection, consistency, and brute-force search across enormous possibility spaces.  It is systematically weak in novel situations outside its training distribution, in knowing when to stop generating, and in modeling real-world consequence.

Here is where the comfortable version of this argument goes wrong.  The tempting move is to assume those two sets of blind spots don't overlap, that the human covers what the machine misses and the reverse, so the composition is safe by default.  But why would they be independent?  A model trained on human text and tuned to agree with human judgment is compressed us.  It is most confidently wrong in the same places we are, because that is where the training signal was densest and least contested.  Its blind spots are correlated with yours by construction, not by accident.

So that independence is not a property you are handed.  It is a property you fight for.  This is portfolio thinking applied to judgment: the risk that ruins a portfolio is correlated risk, the holding that moves against you exactly when everything else does.  You do not diversify by buying the two highest-returning assets, you diversify by buying the two whose failures do not coincide.  A correction loop obeys the same math, with one extra condition: an uncorrelated corrector that is also incompetent buys you nothing, so you want the lowest shared error among correctors that each actually know something.  There is now a theorem shaped like this argument.  A 2026 [analysis of when human-AI teams beat their best member](https://arxiv.org/abs/2605.08710) proves that when you just take a human answer and a machine answer and blend them, the team helps only while their mistakes don't overlap too much, and past that line no weighting scheme can win the advantage back.  Correlation is not a tax on the gain.  Past a point it is a wall.

"Human in the loop" frames even this wrong.  It positions the human as the fixed reference and the AI as the worker being checked.  The better frame is two narrow, biased correction systems, each blind somewhere, arranged so the same mistake is not broadcast twice.  The composed loss function is not a given you inherit.  It is the mechanism you build to drive that correlation down, continuously, against a system engineered to agree with you.  **That composition is the product.**

I made this argument about the mind itself in a three-part series that ends at [Composed Correction](https://ryanmerlin.com/posts/composed-correction).  This is the engineering underneath it.


## Retreat, patch, redesign

If the loss function is the product, then the mode of correction you default to when the loss function fires determines your trajectory.

*Retreat* is pulling back from the change.  It looks like correction but functions as error avoidance.  Klarna pulled humans back into customer service after chatbot failures.  Forty-two percent of enterprises in recent surveys abandoned AI tools entirely.  In machine learning terms: reducing the learning rate to zero.  You stop making errors by stopping learning.  Short-term metrics stabilize.  The compounding curve is gone.

*Patch* is layering correction on top of the existing structure without redesigning.  Adding AI to existing development workflows without changing code review, testing, or deployment processes.  Shannon's insight applies: patching is like increasing transmission power instead of adding redundancy to the encoding.  You get marginal gains.  You never approach channel capacity.  Metrics look acceptable.  Debt accumulates where nobody is measuring.

*Redesign* is rebuilding the correction mechanism at the right level of abstraction.  In quantum error correction terms: you do not fix errors by making physical qubits better.  You build a logical qubit architecture on top and correct at a different layer.  Counter-intuitively, the Faros data showing an 861% increase in code deletion and rework may be what redesign looks like from inside.  A deep J-curve dip is a leading indicator, not a warning sign.

Here is the linking claim: adjusting your error correction is learning.  Retreat is refusing to learn.  Patch is surface learning, adjusting parameters within the existing architecture.  Redesign is structural learning, changing the architecture itself.

Which mode is your organization defaulting to?


## The governor for AI fleets

Agent orchestration is the current attempt at building the governor for AI systems.  The approach spectrum runs from fully restricted (permissions at every step, human gates, hard output constraints) to fully autonomous (self-correcting loops, no checkpoint).

The emerging consensus from production teams is that both poles fail.  Over-restricted agents hit synthetic ceilings and lose the exploratory power that makes generative AI valuable in the first place.  Unrestricted agents compound errors silently until the 202-million-token weekend arrives.

Current frameworks are making progress at the edges.  The orchestration graphs treat error recovery as a first-class primitive, the managed-agent runtimes catch failed tool calls and retry with fallback logic, and the agent SDKs surface execution state at the moment of failure for post-mortem analysis.  What none of them solves is cross-agent error attribution in multi-hop chains.  When agent C fails because agent B passed it wrong data from agent A, you need a causal trace, not a stack trace.

[EdgePlane](https://github.com/RyanMerlin/edgeplane), the system I am building, takes the approach that the correction loop should operate at the fleet level, not the invocation level.  Persistent agents carry identity and memory across sessions.  Error signals propagate through fleet topology.  Any agent can signal a correction, and the organizational context (session history, shared memory, fleet structure) gives that signal meaning.  The Toyota model: not a jailed platform, not unrestricted autonomy, but a correction-aware fleet where the Andon cord actually works because the permission structure supports pulling it.


## What are we training people to do?

If intelligence is the quality of your correction mechanisms, and capable work increasingly means composing correctors that go dark in different places, then most education systems are optimizing the wrong thing.

We train the generation faculty: memorization, output production, test performance, volume of answers.  But generation is commodity now.  Huang's tokens.  The skill that compounds is the correction faculty: critical thinking, the falsification instinct, statistical intuition, the discipline of looking at a confident output and asking what would have to be true for this to be wrong.

The organizations that win will build the governor.  The individuals that win will train their loss function.

The question was never how fast your team can generate.  It is how well you catch yourselves when you are wrong, and what you reach for the moment you are: retreat, a quick patch, or a real redesign.  So which one is your organization actually built for?
