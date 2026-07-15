---
title: "The Loss Function Is the Product"
created: "2026-07-09"
status: "published"
tags: ["ai-agents", "error-correction", "orchestration", "cybernetics", "edgeplane"]
summary: "Generation is becoming cheap. The durable advantage is the system that detects error, attributes it, and learns from it."
---

![A conveyor belt labeled Generation spills a mountain of discarded paper onto the floor.  A wall of four panels, labeled Detection, Attribution, Correction, and Learning, stands between it and a doorway of warm light labeled Verified Outcome, where a lone figure stands looking toward it.](./correction-loop.png)

Jensen Huang has a [rule of thumb](https://www.tomshardware.com/tech-industry/artificial-intelligence/jensen-huang-says-nvidia-engineers-should-use-ai-tokens-worth-half-their-annual-salary-every-year-to-be-fully-productive-compares-not-using-ai-to-using-paper-and-pencil-for-designing-chips): he would be, in his words, "deeply alarmed" if a $500,000 engineer didn't burn through at least a quarter-million dollars a year in AI tokens.  He's right that the spend is coming.  He's just measuring the wrong side of it.

That money buys *tokens*, the small chunks of text an AI reads and writes.  It's tempting to treat them as raw fuel: more tokens means more output, and more output means more value.  But every token is really an allocation decision.  Some of it goes to generation: the forward motion, the new code, the new draft.  The rest goes to correction.  Correction means noticing the model has drifted, measuring how far off it is, and steering it back.  The ratio between those two is the number nobody is tracking.  It is the one that decides whether all that spend buys anything real.

The production data suggests the industry is spending its units of intelligence on the wrong thing.

A [2025 CodeRabbit analysis](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report) of 470 open-source pull requests found that AI-co-authored code carried roughly 1.7 times as many issues as human-written code, with some security categories running as much as 2.74 times higher.  The study leaned on authorship signals rather than confirmed provenance, so treat the exact multipliers as directional rather than precise.  In one vivid weekend experiment, Saiprapul Thotapally [burned 202 million tokens](https://medium.com/@Saiprapul/202-million-tokens-in-one-weekend-hard-lessons-from-running-agentic-ai-at-scale-cedcb6b1e71e) pushing agentic workflows across a few thousand requests.  The cause was spawn loops, malformed retries, and context drift.  A [LeanOps analysis](https://leanopstech.com/blog/agentic-ai-cost-runaway-token-budget-2026/) found that an agent working on a multi-step task burns ten to a hundred times more than a simple chat.  The reason: at every step it re-reads everything it knows before it acts.  And the errors compound.  If each step in a chain is 85 percent reliable, a ten-step task comes out right only about a fifth of the time.  Picture a factory line where four of every five products fall off the belt before the end.  Augment Code's report on [the 80% problem](https://augmentcode.com/guides/the-80-percent-problem-ai-agents-technical-debt) puts the squeeze another way.  AI can write about 1,500 lines of code in ten minutes.  A human can review about 500 in an hour.

The industry is optimizing generation.  But the part that actually decides whether the output is any good is something else.  Engineers call it the *loss function*.  Strictly, the loss function is just the score, the number that says how far off you are.  The real machine is the loop around it: the instrumentation that senses the drift, the trace that attributes it, and the mechanism that corrects.  I will use *loss function* as shorthand for that whole correction system, because the score is where it starts.  That system is the real product.


## The governor

The history of channeling fire is the history of this problem.

Open flame is pure generation.  Raw power, no regulation.  It cooks your dinner or it burns down the village.  For most of human history, that was the tradeoff.

The Newcomen steam engine arrived in 1712.  It offered containment.  Operators watched the engine and manually adjusted valve timing based on observation.  That was better than open flame.  But the correction loop was human, slow, and did not scale.  This is where most AI guardrails sit today: permissions, approval gates, human-in-the-loop review.  Containment without feedback.

James Watt's flyball governor changed the equation in 1788.  Spinning arms sensed rotational speed and mechanically throttled steam intake.  No human in the loop.  Continuous, automatic correction.  James Clerk Maxwell analyzed the mathematics in his 1868 paper [On Governors](https://en.wikipedia.org/wiki/On_Governors).  In doing so he effectively founded control theory.

The breakthrough was not a bigger fire.  It was not a stronger box around the fire.  It was a feedback loop that could sense error and correct without waiting for a human to notice.

We are at the Newcomen stage of AI systems.  We have containment.  We do not yet have the governor.  The teams that build it will define the next era of this industry.


## Error correction is intelligence

This is not a metaphor.  The claim is structural.  The evidence runs across four domains that arrived at the same answer independently.

*Biology.*  DNA polymerase has a raw error rate of roughly 1 in 100,000 bases per replication step.  The finished genome lands at 1 in 10 billion.  Five orders of magnitude.  The entire gap is [correction mechanisms](https://pmc.ncbi.nlm.nih.gov/articles/PMC6153641/): proofreading, mismatch repair, base excision repair, nucleotide excision repair.  Generation produces noise.  Correction produces stability.

The immune system tells the same story from a different angle.  Burnet's clonal selection theory describes a system that generates enormous receptor diversity at random.  It then applies a [correction filter](https://pubmed.ncbi.nlm.nih.gov/24830344/): negative selection in the thymus deletes any lymphocyte that would attack self.  Strip the filter and you do not get smarter immunity.  You get autoimmunity.  The intelligence is the deletion pass.

Synaptic pruning completes the pattern.  The brain overproduces connections in childhood and removes the unused ones.  A [2022 PNAS study](https://www.pnas.org/doi/10.1073/pnas.2121331119) on pruning artificial neural networks replicated the same improvements in working memory and reinforcement learning seen in adolescent development.  Better performance from removal, not addition.

*Information theory.*  Shannon's [noisy channel coding theorem](https://en.wikipedia.org/wiki/Noisy-channel_coding_theorem) established that reliable communication through a noisy channel is possible only with error-correcting codes.  Reliability is not a property of the signal.  It is a property of the correction layer.  This is a mathematical theorem, not a loose analogy.  Modern [polar codes](https://en.wikipedia.org/wiki/Polar_code_(coding_theory)) operate within 0.5 to 1 dB of the Shannon limit.  5G telecommunications infrastructure is built on top of them.

Wiener's [Cybernetics](https://en.wikipedia.org/wiki/Cybernetics:_Or_Control_and_Communication_in_the_Animal_and_the_Machine) was published the same year.  It defined the thermostat as the canonical intelligent system.  The thermostat doesn't generate the right temperature.  It continuously measures the gap between actual and target and corrects.  That correction loop is what makes it intelligent.  Wiener arrived at this framing during wartime anti-aircraft work.  Prediction alone was not enough.  Continuous error measurement and re-correction is what made the targeting system functional.

*Markets.*  Hayek argued in [The Use of Knowledge in Society](https://en.wikipedia.org/wiki/The_Use_of_Knowledge_in_Society) that prices function as the error-correction mechanism of distributed economies.  When a resource is mispriced, the price moves.  Agents adjust behavior in response.  Market "efficiency" in the academic sense is really a claim about correction speed: how quickly prices converge on available information.

*Organizations.*  Toyota's Jidoka principle lets any worker [stop the production line](https://mag.toyota.co.uk/andon-toyota-production-system/) the moment they spot a threat to quality.  The Andon cord is the physical mechanism.  Toyota accepted lower short-term throughput in exchange for faster error signal propagation.  American manufacturers copied the cord.  They did not copy the permission structure that made pulling it safe.  The mechanism failed because the organizational context for correction had not been built.

Every system that demonstrates intelligence does so through the sophistication of its correction mechanisms.  Popper's [The Logic of Scientific Discovery](https://en.wikipedia.org/wiki/The_Logic_of_Scientific_Discovery) lands here.  Knowledge advances by surviving correction attempts.  It does not advance by positive generation.  Generation is cheap.  It always was.


## Three costs

Intelligence reduces to three costs: the complexity of your model, the cost to run it, and the cost to update it.

All three are cost-centric.  And in all three, the dominant cost is not the initial generation.  It is the correction loop.

Complexity: a more complex model is not a smarter model.  A model whose complexity has been shaped by correction (pruning, distillation, RLHF) outperforms a model whose complexity comes from accumulation.  The synaptic pruning finding, again.

Inference cost: the token-pricing conversation treats inference as a generation expense.  Production data says otherwise.  A large share of tokens in agentic workflows goes to correction rather than forward motion: retries, self-evaluation, chain-of-thought verification, error-loop rework.  Research on [token efficiency in multi-agent systems](https://arxiv.org/html/2510.26585v1) found that waste concentrates in the correction and rework loop, not the generation step.

Update cost: the most expensive part of keeping a model useful is not the retraining compute.  It is knowing what to retrain on.  The loss function that selects training signal is the intelligence.  Everything else is matrix multiplication.

Put the three together and the ratio you started with resolves into a single number.  Not the price per token, but the total cost per verified outcome: generation, verification, retries, human review, and the price of the errors that slip through anyway.  The cheapest system is the one that drives that number down, not the one with the lowest sticker price per token.


## The self-correction paradox

Here is the uncomfortable finding.

<img src="/images/loss-function-red-pen.webp" alt="A printed manuscript covered in red-pen editing marks, corrections, strike-throughs, and circled errors under a desk lamp" style="width: 55%; display: block; margin: 2rem auto;" />

LLMs cannot be assumed to reliably correct their own reasoning errors from another pass over the same evidence.  A [MIT TACL survey](https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00713/125177) on self-correction and a decomposition analysis of the [accuracy-correction paradox](https://arxiv.org/abs/2601.00828) established this empirically.  The result is counterintuitive.  Stronger models make fewer but deeper errors that resist self-correction.  GPT-3.5 at 66% accuracy achieves 1.6 times higher intrinsic correction rates than DeepSeek at 94%.  More capable systems produce harder-to-detect failures.

A system cannot evaluate itself using the same blind spots that produced the error.  External feedback is not optional.  It is the mechanism.

This connects to a broader measurement failure.  A [METR randomized controlled trial](https://arxiv.org/abs/2507.09089) found that experienced developers using early-2025 AI tools believed they were speeding up.  They were actually measurably slowing down.  They could not feel the direction of their own error, even while living it.  The authors later [flagged a selection effect](https://metr.org/blog/2026-02-24-uplift-update/) that likely overstates the size of that slowdown.  Hold the magnitude loosely.  The metacognitive gap is the part that survives.  When your instruments read the altitude you want instead of the altitude you have, correction becomes impossible.  You do not feel blind from the inside.  You feel fine.

What if the most dangerous failure mode in AI adoption is not generating the wrong thing, but losing the ability to detect that you generated the wrong thing?


## Composed loss functions

The self-correction paradox points to something the industry has not named honestly yet.

Humans and AI have different loss functions.  The human loss function is shaped by cognitive biases, social pressure, sunk cost, ego protection.  It is powerful in domains that require social reasoning, ambiguity tolerance, and embodied intuition.  It is systematically weak at statistical reasoning at scale, consistency across repetitions, and separating signal from emotional noise.

The AI loss function is shaped by training data, reward signal, and architecture.  It is powerful for pattern detection, consistency, and brute-force search across enormous possibility spaces.  It is systematically weak in novel situations outside its training distribution, in knowing when to stop generating, and in modeling real-world consequence.

Here is where the comfortable version of this argument goes wrong.  The tempting move is to assume those two sets of blind spots don't overlap.  The assumption is that the human covers what the machine misses, and the reverse, so the composition is safe by default.  But why would they be independent?  A model trained on human text and tuned to agree with human judgment is compressed us.  It is most confidently wrong in the same places we are.  That is because the training signal there was densest and least contested.  Its blind spots are correlated with yours by construction.  Not by accident.

So that independence is not a property you are handed.  It is a property you fight for.  This is portfolio thinking applied to judgment.  The risk that ruins a portfolio is correlated risk: the holding that moves against you exactly when everything else does.  You do not diversify by buying the two highest-returning assets.  You diversify by buying the two whose failures do not coincide.  A correction loop obeys the same math, with one extra condition.  An uncorrelated corrector that is also incompetent buys you nothing.  So you want the lowest shared error among correctors that each actually know something.  There is now a theorem shaped like this argument.  A 2026 [analysis of when human-AI teams beat their best member](https://arxiv.org/abs/2605.08710) proves it.  Take a human answer and a machine answer and blend them.  The team helps only while their mistakes don't overlap too much.  Past that line, no weighting scheme can win the advantage back.  Correlation is not a tax on the gain.  Past a point, it is a wall.

"Human in the loop" frames even this wrong.  It positions the human as the fixed reference and the AI as the worker being checked.  The better frame is two narrow, biased correction systems.  Each is blind somewhere.  They're arranged so the same mistake is not broadcast twice.  The composed loss function is not a given you inherit.  It is the mechanism you build to drive that correlation down.  You build it continuously, against a system engineered to agree with you.  **That composition is the product.**

I made this argument about the mind itself in a three-part series that ends at [Composed Correction](https://ryanmerlin.com/posts/composed-correction).  This is the engineering underneath it.


## Retreat, patch, redesign

If the loss function is the product, then your trajectory is set by how you correct.  It comes down to the mode you default to the moment the loss function fires.

*Retreat* is pulling back from the change.  It looks like correction.  In practice, it functions as error avoidance.  Klarna [brought human agents back into customer service](https://www.customerexperiencedive.com/news/klarna-reinvests-human-talent-customer-service-AI-chatbot/747586/) after going all-in on an AI chatbot.  Forty-two percent of enterprises in [one 2025 survey](https://www.ciodive.com/news/AI-project-fail-data-SPGlobal/742590/) abandoned most of their AI initiatives, up from 17 percent a year earlier.  In machine learning terms, this is reducing the learning rate to zero.  You stop making errors by stopping learning.  Short-term metrics stabilize.  The compounding curve is gone.

*Patch* is layering correction on top of the existing structure without redesigning.  Adding AI to existing development workflows without changing code review, testing, or deployment processes.  Shannon's insight applies: patching is like increasing transmission power instead of adding redundancy to the encoding.  You get marginal gains.  You never approach channel capacity.  Metrics look acceptable.  Debt accumulates where nobody is measuring.

*Redesign* is rebuilding the correction mechanism at the right level of abstraction.  In quantum error correction terms: you do not fix errors by making physical qubits better.  You build a logical qubit architecture on top and correct at a different layer.  Counter-intuitively, the [Faros data](https://www.faros.ai/blog/ai-acceleration-whiplash-takeaways) showing an 861 percent increase in code deletion and rework may be what redesign looks like from inside.  A spike in deletion is ambiguous on its own.  It could be thrashing and defective generation, or it could be a team finally tearing out the structures that no longer fit.  The distinguishing variable is not the churn itself, but whether the rework leaves the system simpler, more testable, and less likely to reproduce the same error.

Here is the linking claim: adjusting your error correction is learning.  Retreat is refusing to learn.  Patch is surface learning, adjusting parameters within the existing architecture.  Redesign is structural learning, changing the architecture itself.

The sharper test is not which mode sounds bravest, but which one matches the error.  Is the correction landing at the same level as the cause?  A local, well-understood failure wants a patch.  A failure that keeps resurfacing across components wants a redesign.  A capability whose economics or safety boundary is simply wrong sometimes wants retreat, and that can be the rational call rather than the cowardly one.

Which mode is your organization defaulting to?


## The governor for AI fleets

Agent orchestration is the current attempt at building the governor for AI systems.  The approach spectrum runs from fully restricted (permissions at every step, human gates, hard output constraints) to fully autonomous (self-correcting loops, no checkpoint).

The emerging consensus from production teams is that both poles fail.  Over-restricted agents hit synthetic ceilings and lose the exploratory power that makes generative AI valuable in the first place.  Unrestricted agents compound errors silently until the 202-million-token weekend arrives.

Current frameworks are making progress at the edges.  The orchestration graphs treat error recovery as a first-class primitive.  The managed-agent runtimes catch failed tool calls and retry with fallback logic.  The agent SDKs surface execution state at the moment of failure for post-mortem analysis.  Research systems are beginning to trace and attribute these failures.  What most production stacks still lack is a durable, fleet-level model of causality: which agent introduced a claim, which agents downstream relied on it, which check caught the failure, and whether the fix keeps it from recurring.  When agent C fails because agent B passed it wrong data from agent A, a stack trace won't help.  You need a causal trace.

[EdgePlane](https://github.com/RyanMerlin/edgeplane) is the system I am building.  It takes the approach that the correction loop should operate at the fleet level, not the invocation level.  Persistent agents carry identity and memory across sessions.  Error signals propagate through fleet topology.  Any agent can signal a correction.  The organizational context, meaning session history, shared memory, and fleet structure, gives that signal meaning.  Call it the Toyota model.  Not a jailed platform.  Not unrestricted autonomy.  A correction-aware fleet where the Andon cord actually works, because the permission structure supports pulling it.


## What are we training people to do?

Intelligence is the quality of your correction mechanisms, and capable work increasingly means composing correctors that go dark in different places.  If that is right, most education systems are optimizing the wrong thing.

We train the generation faculty: memorization, output production, test performance, volume of answers.  But generation is commodity now.  Huang's tokens.  The skill that compounds is the correction faculty: critical thinking, the falsification instinct, statistical intuition, the discipline of looking at a confident output and asking what would have to be true for this to be wrong.

The organizations that win will build the governor.  The individuals that win will train their loss function.

The question was never how fast your team can generate.  It is how well you catch yourselves when you are wrong.  And what you reach for the moment you are: retreat, a quick patch, or a real redesign.  So which one is your organization actually built for?
