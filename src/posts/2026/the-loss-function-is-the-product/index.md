---
title: "The Loss Function Is the Product"
created: "2026-07-09"
status: "published"
tags: ["ai-agents", "error-correction", "orchestration", "cybernetics"]
summary: "Generation is becoming cheap. The durable advantage is the system that detects error, attributes it, and learns from it."
---

![A conveyor belt labeled Generation spills a mountain of discarded paper onto the floor.  A wall of four panels, labeled Detection, Attribution, Correction, and Learning, stands between it and a doorway of warm light labeled Verified Outcome, where a lone figure stands looking toward it.](./correction-loop.png)

Jensen Huang has a [rule of thumb](https://www.tomshardware.com/tech-industry/artificial-intelligence/jensen-huang-says-nvidia-engineers-should-use-ai-tokens-worth-half-their-annual-salary-every-year-to-be-fully-productive-compares-not-using-ai-to-using-paper-and-pencil-for-designing-chips): he would be, in his words, "deeply alarmed" if a $500,000 engineer didn't burn through at least a quarter-million dollars a year in AI tokens.  He's right that the spend is coming.  He's just measuring the wrong side of it.

That money buys *tokens*, the small chunks of text an AI reads and writes.  It's tempting to treat them as raw fuel: more tokens means more output, and more output means more value.  But every token is really an allocation decision.  Some of it goes to generation: the forward motion, the new code, the new draft.  Much of the rest goes to making that generation usable, the retrieval, coordination, verification, retries, and correction that turn a draft into something you can trust.  The ratio between forward motion and everything it takes to make that motion trustworthy is the number almost nobody reports.  It's the one that decides whether all that spend buys anything real.

The available evidence and field reports suggest the industry is measuring its units of intelligence at the wrong boundary.

A [2025 CodeRabbit analysis](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report) of 470 open-source pull requests found that AI-co-authored code carried roughly 1.7 times as many issues as human-written code, with some security categories running as much as 2.74 times higher.  The study leaned on authorship signals rather than confirmed provenance, so treat the exact multipliers as directional rather than precise.  In one vivid weekend experiment, Saiprapul Thotapally [burned 202 million tokens](https://medium.com/@Saiprapul/202-million-tokens-in-one-weekend-hard-lessons-from-running-agentic-ai-at-scale-cedcb6b1e71e) pushing agentic workflows across a few thousand requests.  The cause was spawn loops, malformed retries, and context drift.  A [LeanOps analysis](https://leanopstech.com/blog/agentic-ai-cost-runaway-token-budget-2026/) found that an agent working on a multi-step task burns ten to a hundred times more than a simple chat.  The reason: at every step it re-reads everything it knows before it acts.  And the errors compound.  Assume for a moment that step failures are independent: a ten-step chain where each step is 85 percent reliable comes out right end to end only about a fifth of the time.  Picture a factory line where four of every five products fall off the belt before the end.

The industry is optimizing generation.  But the part that actually decides whether the output is any good is something else.  Engineers call it the *loss function*.  Strictly, the loss function is just the score, the number that says how far off you are.  The real machine is the loop around it: the instrumentation that senses the drift, the trace that attributes it, and the mechanism that corrects.  I will use *loss function* as shorthand for that whole correction system, because the score is where it starts.  That system is the real product.

You could object that this is just control theory with new nouns, or MLOps, or the error budgets that site-reliability teams have run for years.  Fair, and half the point: the same shape keeps getting rediscovered because it holds weight.  What's actually new is where it now has to live.  Not around one model or one service, but across a fleet of agents handing work to each other, where the failure hides in the handoff and nothing ever throws an error.  That is the part the old playbooks don't cover, and it's where this is headed.


## The governor

The history of channeling fire is the history of this problem.

Open flame is pure generation.  Raw power, no regulation.  It cooks your dinner or it burns down the village.  For most of human history, that was the tradeoff.

The Newcomen steam engine arrived in 1712.  It offered containment.  Operators watched the engine and manually adjusted valve timing based on observation.  That was better than open flame.  But the correction loop was human, slow, and did not scale.  This is where most AI guardrails sit today: permissions, approval gates, human-in-the-loop review.  Containment with slow, manual feedback.

James Watt's flyball governor changed the equation in 1788.  Spinning arms sensed rotational speed and mechanically throttled steam intake.  No human in the loop.  Continuous, automatic correction.  James Clerk Maxwell analyzed the mathematics in his 1868 paper [On Governors](https://en.wikisource.org/wiki/On_Governors).  In doing so he effectively founded control theory.

<img src="/images/watt-flyball-governor.webp" alt="A labeled engineering diagram of Watt's flyball governor: two weighted flyballs on a spinning shaft linked through arms to a valve that throttles the steam as the shaft speeds up" style="width: 60%; display: block; margin: 2rem auto;" />

The breakthrough was not a bigger fire.  It was not a stronger box around the fire.  It was a feedback loop that could sense error and correct without waiting for a human to notice.

We are at the Newcomen stage of AI systems.  We have containment.  We do not yet have the governor.  The teams that build it will define the next era of this industry.


## Error correction is intelligence

Is that a metaphor, or is the same structure genuinely repeating?  Four domains reached it independently, without ever comparing notes.  Read them and decide for yourself.

*Biology.*  DNA polymerase has a raw error rate of roughly 1 in 100,000 bases per replication step.  The finished genome lands at 1 in 10 billion.  Five orders of magnitude.  The entire gap is [correction machinery](https://pmc.ncbi.nlm.nih.gov/articles/PMC6153641/): the polymerase proofreads as it goes, and mismatch repair sweeps up what slips through.  Generation produces noise.  Correction produces stability.

The immune system tells the same story from a different angle.  Burnet's clonal selection theory describes a system that generates enormous receptor diversity at random.  It then applies a [correction filter](https://pubmed.ncbi.nlm.nih.gov/24830344/): negative selection in the thymus deletes any lymphocyte that would attack self.  Strip the filter and you do not get smarter immunity.  You get autoimmunity.  The intelligence is the deletion pass.

Synaptic pruning completes the pattern.  The brain overproduces connections in childhood and removes the unused ones.  A [2022 PNAS study](https://www.pnas.org/doi/10.1073/pnas.2121331119) on pruning artificial neural networks replicated the same improvements in working memory and reinforcement learning seen in adolescent development.  Better performance from removal, not addition.

And the brain doesn't only prune, it predicts.  One influential framework in modern neuroscience treats perception itself as error correction: the brain constantly guesses its next input and spends attention only on the gap, the [prediction error](https://en.wikipedia.org/wiki/Free_energy_principle), between what it expected and what arrived.  Even reward runs on that signal.  The [dopamine response that drives learning](https://pubmed.ncbi.nlm.nih.gov/9054347/) doesn't encode reward, it encodes reward *prediction error*, the surprise when the world pays out differently than you guessed.  In the brain, correction isn't a stage that happens after cognition, it is the cognition.

*Information theory.*  Shannon's [noisy channel coding theorem](https://en.wikipedia.org/wiki/Noisy-channel_coding_theorem) proved that reliable communication over a noisy channel is possible only with error-correcting codes.  The theorem itself is about a capacity threshold, but the lesson generalizes cleanly: reliability lives in the correction layer, not in the signal.  Modern [polar codes](https://en.wikipedia.org/wiki/Polar_code_(coding_theory)) operate within 0.5 to 1 dB of the Shannon limit.  5G uses them for its control channels, alongside LDPC codes for the data.

Wiener's *Cybernetics* was published the same year and reached for the [thermostat](https://en.wikipedia.org/wiki/Cybernetics) as its model case.  A thermostat doesn't generate the right temperature.  It measures the gap between where the room is and where you want it, and it closes that gap.  The correction loop is the whole intelligence.

Ashby pushed the idea to its hardest edge with the [Law of Requisite Variety](https://pespmc1.vub.ac.be/REQVAR.html): only variety can absorb variety.  A regulator can correct only the disturbances it can tell apart and answer differently.  If the world can go wrong in a hundred ways and your corrector recognizes ten of them, the other ninety pass straight through.  Control isn't a matter of effort or will, it's a matter of whether your correction has as many distinct moves as the error does.  Hold onto that, because it is the hinge of the whole argument.  Wiener arrived at this framing during wartime anti-aircraft work.  Prediction alone was not enough.  Continuous error measurement and re-correction is what made the targeting system functional.

*Markets.*  Hayek's [The Use of Knowledge in Society](https://www.econlib.org/library/Essays/hykKnw.html) is really about dispersed knowledge, how a market coordinates what no single mind could ever hold.  Read it through this lens, though, and the price system is doing correction: when a resource is mispriced, the price moves, and everyone downstream adjusts without being told why.  Market "efficiency" becomes a claim about correction speed, how fast prices converge on what is actually known.

*Organizations.*  On a Toyota line, any worker can [pull the Andon cord](https://mag.toyota.co.uk/andon-toyota-production-system/) the instant they see a threat to quality.  It doesn't slam the plant to a halt.  It raises a signal, a team leader comes over, and the line stops only if the problem can't be cleared in the normal cycle time.  Toyota traded a little throughput for a fast, cheap error signal.  American plants copied the cord but not the permission that made pulling it safe, so the signal rotted: a worker who gets punished for stopping the line learns to stop pulling.

Every system that stays intelligent under uncertainty does so through the sophistication of its correction mechanisms.  Popper's [The Logic of Scientific Discovery](https://en.wikipedia.org/wiki/The_Logic_of_Scientific_Discovery) lands here.  Knowledge advances by surviving correction attempts, not by piling up conjectures.  None of this makes generation worthless.  Ashby's own law says a corrector needs a repertoire rich enough to match the world, and that repertoire has to come from somewhere.  What changed is which half is scarce: it used to be generation, now it's correction.


## Three costs

Intelligence reduces to three costs: the complexity of your model, the cost to run it, and the cost to update it.

All three are cost-centric.  And in each, ask where the money actually goes: into the first draft, or into everything you spend making that draft right?  It's the second one, every time.

Complexity: a more complex model is not necessarily a smarter model.  A model whose complexity has been shaped by correction (pruning, distillation, RLHF) outperforms a model whose complexity comes from accumulation.  The synaptic pruning finding, again.

Inference cost: the token-pricing conversation treats inference as a generation expense.  The bigger expense comes after, in the correction.  Retries, self-checks, verification passes, and the long slog of an agent trying to dig out of a wrong turn.  An [empirical study of coding agents](https://arxiv.org/abs/2511.00197) that traced OpenHands, SWE-agent, and Prometheus across the SWE-Bench benchmark found that failed runs are consistently longer than successful ones.  A wrong answer doesn't fail cheaply, it thrashes, and the thrashing is where the tokens go.

Update cost: the most expensive part of keeping a model useful is not the retraining compute.  It is knowing what to retrain on.  The loss function that selects training signal is the intelligence.  Everything else is matrix multiplication.

Put the three together and the ratio you started with resolves into a single number.  Not the price per token, but the total cost per verified outcome: generation, verification, retries, human review, and the price of the errors that slip through anyway.  The cheapest system is the one that drives that number down, not the one with the lowest sticker price per token.

Put a toy number on it.  A task costs a dollar to generate but lands right only two times in three.  Each miss costs another dollar to catch and redo, and the rare one that slips past review costs twenty to clean up in production.  Now the honest price of one accepted result is several dollars, not one, and a model that generates for half the price while missing twice as often makes that number worse, not better.

One honest objection before going further.  Sometimes generation *is* the work.  In open-ended search, drug discovery, brainstorming, generating images, the goal isn't to steer one output toward a known answer, it's to spray out ten thousand candidates and find the one that's surprising and good.  Ninety-nine percent waste is just the cost of the search.  True.  But look at what does the finding.  Something has to pick the one good candidate out of the ten thousand, and that picker, the assay, the taste, the test that says *this one*, is the loss function in a different coat.  Cheaper generation doesn't retire it, it raises the stakes on it: the more you can produce, the more everything rides on how well you can tell what's worth keeping.


## The self-correction paradox

Here is the uncomfortable finding.

<img src="/images/loss-function-red-pen.webp" alt="A printed manuscript covered in red-pen editing marks, corrections, strike-throughs, and circled errors under a desk lamp" style="width: 55%; display: block; margin: 2rem auto;" />

A model cannot be assumed to fix its own reasoning by reading its own work again.  A [critical survey of self-correction](https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00713/125177) drew the line sharply: *intrinsic* correction, where the model grades itself with no new information, mostly fails, while correction driven by reliable external feedback works.  One [decomposition of the accuracy-correction paradox](https://arxiv.org/abs/2601.00828), a recent preprint, found the same pattern.  The result is counterintuitive.  Stronger models make fewer but deeper errors that resist self-correction.  In one comparison, GPT-3.5 at 66 percent accuracy corrected its own mistakes at 1.6 times the rate of DeepSeek at 94 percent.  In that study at least, the more capable system made fewer errors but harder-to-correct ones.

A system cannot evaluate itself using the same blind spots that produced the error.  This is why the agentic coding harnesses that actually work don't ask the model to introspect harder.  They hand it a failing test, a compiler error, a real execution result, and let the world push back.  **External feedback isn't a nicety on top of the loop, it is the loop.**

This connects to a broader measurement failure.  A [METR randomized controlled trial](https://arxiv.org/abs/2507.09089) found that experienced developers using early-2025 AI tools believed they were speeding up.  They were actually measurably slowing down.  They could not feel the direction of their own error, even while living it.  The authors later [flagged a selection effect](https://metr.org/blog/2026-02-24-uplift-update/) that likely overstates the size of that slowdown.  Hold the magnitude loosely.  The metacognitive gap is the part that survives.  When your instruments read the altitude you want instead of the altitude you have, correction becomes impossible.  This is [Goodhart's law](https://en.wikipedia.org/wiki/Goodhart%27s_law) turned inward: once the feeling of speed becomes your gauge, it stops measuring the speed.  You don't feel blind from the inside, you feel fine.

What if the most dangerous failure mode in AI adoption is not generating the wrong thing, but losing the ability to detect that you generated the wrong thing?


## Composed loss functions

The self-correction paradox points to something the industry has not named honestly yet.

Humans and AI have different loss functions.  The human loss function is shaped by cognitive biases, social pressure, sunk cost, ego protection.  It is powerful in domains that require social reasoning, ambiguity tolerance, and embodied intuition.  It is systematically weak at statistical reasoning at scale, consistency across repetitions, and separating signal from emotional noise.

The AI loss function is shaped by training data, reward signal, and architecture.  It is powerful for pattern detection, consistency, and brute-force search across enormous possibility spaces.  It is systematically weak in novel situations outside its training distribution, in knowing when to stop generating, and in modeling real-world consequence.

Here is where the comfortable version of this argument goes wrong.  The tempting move is to assume those two sets of blind spots don't overlap.  The assumption is that the human covers what the machine misses, and the reverse, so the composition is safe by default.  But why would they be independent?  **A model trained on human text and tuned to agree with human judgment is compressed us.**  It is most confidently wrong in the same places we are.  That is because the training signal there was densest and least contested.  Its blind spots are correlated with yours by construction.  Not by accident.

So that independence is not a property you are handed.  It is a property you fight for.  This is portfolio thinking applied to judgment.  The risk that ruins a portfolio is correlated risk: the holding that moves against you exactly when everything else does.  You do not diversify by buying the two highest-returning assets.  You diversify by buying the two whose failures do not coincide.  A correction loop obeys the same math, with one extra condition.  An uncorrelated corrector that is also incompetent buys you nothing.  So you want the lowest shared error among correctors that each actually know something.  There is now a theorem shaped like this argument.  A 2026 [analysis of when human-AI teams beat their best member](https://arxiv.org/abs/2605.08710) makes it precise.  Blend a human answer and a machine answer by confidence, and the team beats its best member only while their mistakes don't overlap too much.  Past that line, no weighting scheme wins the advantage back.  The proof covers weighted blending, not the back-and-forth of real review, but the mechanism carries over: correlated error eats the gain.  Correlation is not a tax on the gain.  Past a point, it is a wall.

"Human in the loop" frames even this wrong.  It positions the human as the fixed reference and the AI as the worker being checked.  The better frame is two narrow, biased correction systems.  Each is blind somewhere.  They're arranged so the same mistake is not broadcast twice.  The composed loss function is not a given you inherit.  It is the mechanism you build to drive that correlation down.  You build it continuously, against a system engineered to agree with you.  **That composition is the product.**

So how do you actually build one?  Mostly by refusing to let your correctors share a blind spot.  Grade the model's output against something that fails differently than a language model does: a test suite, a compiler, a running system, not just a second prompt to the same model, which mostly relaunders the first answer's confidence as a second opinion.  When a human reviews, hand them the evidence the model didn't have, not the model's own summary of its work.  When you stack two models, pick ones trained differently or pointed at different sources, so a shared habit doesn't make them wrong in unison.  The easy version of this is a trap: spinning up a second [Claude Code subagent](https://code.claude.com/docs/en/sub-agents) to check the first gives it a fresh context window, which helps, but the same model reading the same evidence brings the same blind spots along with it.  A subagent earns its keep as a corrector only when its job or its evidence differs from the agent it's checking.  None of this is exotic.  It's portfolio construction for judgment, and the work is in the correlations you refuse to accept, not the number of checkers you bolt on, because ten checkers that fail the same way have the variety of one.  That is Ashby's law again: correlated correctors share their moves, so stacking them doesn't add coverage, it just repeats it.

I made this argument about the mind itself in a three-part series that ends at [Composed Correction](/posts/composed-correction).  This is the engineering underneath it.


## Retreat, patch, redesign

If the loss function is the product, then your trajectory is set by how you correct.  It comes down to the mode you default to the moment the loss function fires.

*Retreat* is pulling back from the change.  It looks like correction.  In practice, it functions as error avoidance.  Klarna [brought human agents back into customer service](https://www.customerexperiencedive.com/news/klarna-reinvests-human-talent-customer-service-AI-chatbot/747586/) after going all-in on an AI chatbot.  Forty-two percent of enterprises in [one 2025 survey](https://www.ciodive.com/news/AI-project-fail-data-SPGlobal/742590/) abandoned most of their AI initiatives, up from 17 percent a year earlier.  In machine learning terms, this is reducing the learning rate to zero.  You stop making errors by stopping learning.  Short-term metrics stabilize.  The compounding curve is gone.

*Patch* is layering correction on top of the existing structure without redesigning.  Adding AI to existing development workflows without changing code review, testing, or deployment processes.  Shannon's insight applies: patching is like increasing transmission power instead of adding redundancy to the encoding.  You get marginal gains.  You never approach channel capacity.  Metrics look acceptable.  Debt accumulates where nobody is measuring.

*Redesign* rebuilds the correction mechanism at the right level.  In quantum computing you don't get a reliable machine by making each physical qubit perfect.  You accept noisy qubits and build a logical layer on top that corrects their errors as a group, so the fix lives one level up from the failure.

Watch how hard real data resists a clean read.  [Faros studied two years of telemetry from 22,000 developers](https://www.faros.ai/blog/ai-acceleration-whiplash-takeaways) and found that code churn, the ratio of lines deleted to lines added, rose 861 percent on high-AI-adoption teams.  That number alone tells you nothing.  It could be thrash, teams shipping AI code fast and ripping it back out, or it could be redesign, teams finally affording refactors that were too expensive to staff before.  Faros looked at its own data and refused to pick, telling every organization to work out which one is theirs.  That refusal is the honest answer.  The churn isn't the signal.  Whether the rework leaves the system simpler and less likely to break the same way twice is the signal.  In their words, throughput measures what was shipped, not what survived.

None of this is new.  It's [single-loop and double-loop learning](https://en.wikipedia.org/wiki/Double-loop_learning), the distinction Chris Argyris and Donald Schön drew in the 1970s, wearing engineering clothes.  *Single-loop* learning corrects the error but leaves the governing assumptions alone.  That's a patch.  *Double-loop* learning changes the assumptions themselves.  That's a redesign.  Their own example was, of all things, a thermostat: one that switches the heat on and off is single-loop, one that asks why it's set to sixty-nine degrees in the first place is double-loop.  *Retreat* is neither.  It's the move that avoids the error instead of correcting it at either level.

So the useful question is simple.  Does the correction land at the same level as the cause?  A local, well-understood bug wants a *patch*, and reaching for a redesign there is expensive theater.  A failure that keeps resurfacing across components is telling you the assumptions are wrong, and patching it again is how debt compounds while the dashboards stay green.  And sometimes the honest move is *retreat*, pulling a capability whose economics or safety just don't work.  Calling that cowardice is how teams talk themselves into shipping what shouldn't ship.

No organization runs on one mode.  But most have a reflex, the thing they reach for first when the loss function fires, and the reflex is the tell.  A team that reflexively retreats stops learning and calls it prudence.  A team that reflexively patches buries debt and calls it velocity.  A team that reflexively redesigns burns quarters rebuilding what only needed a bolt tightened.  Which reflex is yours?


## The governor for AI fleets

Agent orchestration is the current attempt at building the governor for AI systems.  The approach spectrum runs from fully restricted (permissions at every step, human gates, hard output constraints) to fully autonomous (self-correcting loops, no checkpoint).

Both extremes have a failure mode you can already watch happen.  Lock an agent down with a human gate on every step and you don't get safety, you get a reviewer rubber-stamping two hundred approvals a day until the sign-off is a formality.  Take the gates off and the agent compounds its own mistakes unwatched.  One agent handed autonomous cloud access [ran up thousands of dollars in charges in a day](https://news.ycombinator.com/item?id=48500012) by spinning up a fresh batch of resources every time it hit an error.  The pattern is symmetric: too much restriction trains the humans to stop looking, and too little means no one was looking to begin with.

The frameworks are making real progress on the first half of this problem, and they've split into distinct stances.  [LangGraph](https://www.langchain.com/blog/fault-tolerance-in-langgraph) retries a failed step with backoff and, once the retries are spent, hands control to a dedicated recovery node with the failure attached.  The [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/guardrails/) takes the opposite tack, tripping a guardrail that halts the run the moment the output crosses a line you've drawn.  Anthropic's [evaluator-optimizer](https://www.anthropic.com/research/building-effective-agents) loop is the one closest to the argument of this piece: it pairs a generator with a separate model that critiques the output and sends it back until it passes, a corrector deliberately kept apart from the thing it's correcting.  Retry through the failure, stop cold at the boundary, or hand it to a second judge.  All three are real error handling, and all three still work inside a single agent's run.

The harder and much less mature half is attribution across agents.  When agent C fails because agent B passed it bad data that agent A produced, a stack trace is useless, because nothing crashed.  Every step ran fine.  The failure lives in the handoffs.  How hard is that to untangle?  A [2025 benchmark built to test exactly this](https://huggingface.co/papers/2509.03312) found that state-of-the-art reasoning models correctly named the agent responsible for a multi-agent failure less than ten percent of the time.  A [2026 follow-on](https://arxiv.org/abs/2603.25001) then challenged the framing itself, arguing that many failures admit several defensible causes and that single-root-cause benchmarks exaggerate how badly the models do.  That disagreement is the real tell: in a fleet of agents, we haven't just failed to automate attribution, we haven't settled what a correct attribution even is.  Generation is nearly free and getting freer.  Working out which part of your own system misled the other parts is the hard, unfinished problem.

The shape of the fix is coming into view even where the tooling isn't.  The correction loop has to move up a level, out of a single agent's run and into the whole fleet.  Agents need identity and memory that persist across sessions, so a bad result can be traced back through the handoffs that produced it, and any agent needs the standing to raise a flag when something looks wrong.  That's the Toyota line rather than the locked-down platform or the free-for-all: bounded autonomy, where anyone can pull the cord and the structure around them makes pulling it safe and cheap.


## What are we training people to do?

If intelligence is the quality of your correction, and good work increasingly means pairing minds that fail in different places, then most of our schooling trains the wrong muscle.

We drill the generation muscle: memorize, produce, perform on the test, answer in volume.  But generation is the part that just got cheap.  The skill that compounds now is the other one: thinking critically, distrusting a confident answer, the reflex to look at something that sounds right and ask what would have to be true for it to be wrong.

**The organizations that win will build the governor.  The individuals that win will train their loss function.**

The question was never how fast your team can generate.  It is how well you catch yourselves when you are wrong.  And what you reach for the moment you are: retreat, a quick patch, or a real redesign.  So which one is your organization actually built for?
