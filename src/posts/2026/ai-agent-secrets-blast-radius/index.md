---
title: "AI Agent Secrets Management: What Actually Reduces Blast Radius"
created: "2026-07-08"
status: "published"
tags: ["secrets","security","ai-agents","infisical","non-human-identity","mcp"]
summary: "A vault protects storage, not trust.  The secret is not the unit of risk; the action it permits is.  A practitioner's map of what actually reduces an agent's blast radius, and what nobody has solved yet."
---

![An AI agent at a desk with a glowing key on its chest, ringed by locked doors labeled cloud account, source code, customer data, email, finance system, and deploy pipeline, while a note reading 'ignore all prior instructions' hangs over it like a lamp](./ai-agent-secrets.png)

This spring and summer, researchers kept finding the same failure in different agent products.  In April, Johns Hopkins researchers showed that a [poisoned comment on a public GitHub issue](https://oddguan.com/blog/comment-and-control-prompt-injection-credential-theft-claude-code-gemini-cli-github-copilot/) was enough to turn *Claude Code*, *Gemini CLI*, and *GitHub Copilot* into tools that leaked their own API keys and tokens through GitHub itself.  Weeks later, Wiz showed that opening a booby-trapped code repository could make [Amazon's Q agent run an attacker-controlled config and expose a developer's cloud credentials](https://www.wiz.io/blog/amazon-q-vulnerability).  Four different products, one root cause: an agent that reads something an attacker controls while holding credentials it's allowed to use.

If your first instinct is "so store the secrets somewhere safer," that's the instinct this piece is going to argue with.

An *AI agent* is software that reads, decides, and acts for you.  It calls real tools, moves real data, spends real money, not just chats.  To do that it needs *secrets*, the API keys and tokens that prove it's allowed.  The standard response is a *vault*, an encrypted store for those secrets.  Vaults are good.  They are also not the thing that breaks, because a vault protects storage, and storage was never the weak point.

Here is the reframe the whole piece runs on.  The moment an agent reads attacker-controlled text, a web page, an email, a code comment, that text can smuggle in instructions that redirect what the agent does next.  That is *prompt injection*, and you cannot reliably stop it.  So securing an agent's secrets is not about preventing the trick.  **It is about shrinking the blast radius: how much a hijacked credential can do before anyone notices.**  *Blast radius* is just the size of the damage one compromised key can reach.  Put it another way: the secret isn't the unit of risk.  The action it permits is.

There is a physical version you already trust.  You don't give a contractor your master key.  You give them a temporary badge that opens only the rooms they need, stops working at 5pm, and logs every door.  Ask those same three questions of every secret your agent holds: which doors, for how long, and who is watching the log?  Most setups can't answer one of the three.  The badge doesn't make the contractor trustworthy, and it won't make your agent trustworthy either.  What it does is make the agent's authority small, brief, and observable, which is the most you can actually buy.

<img src="/images/ai-secret-blast-radius.png" alt="A glowing key at the center of concentric containment rings, with only one narrow wedge lit and open while the rest stay dark, a blast radius scoped to a single sector" style="width: 55%; display: block; margin: 2rem auto;" />

## Two failures people keep confusing

Before you can shrink a blast radius, you have to be precise about what you're afraid of, because two very different failures get lumped together and they have opposite fixes.

The first is *exfiltration*: the agent gets tricked into reading a secret and sending it out, through a link it renders, an image URL, an outbound call.  Simon Willison's [lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) names the exact recipe, and it needs all three legs at once: access to private data, exposure to untrusted content, and a way to communicate externally.  The useful part of his framing is that the cheapest leg to cut is the third.  You usually can't stop an agent from touching private data or reading web pages without killing its whole purpose, but you can control where it is allowed to send things.

The second failure is quieter and worse: *capability abuse*.  The secret never leaves.  The attacker just uses the agent's own, already-authorized power for the wrong purpose, send the email, merge the pull request, place the order.  Security people call this a *confused deputy*: a trusted assistant tricked into misusing authority it legitimately holds.  No key is stolen.  Nothing shows up in a "secrets leaked" report.  And a better vault does exactly nothing about it.

Why should you care about the distinction rather than leaving it to a security team?  Because the fix is different.  Exfiltration is an *egress* problem, so you cut the exit.  Capability abuse is an authority problem, so you make the agent's standing power small and scoped to one action at a time, so misdirecting it doesn't buy the attacker much.  Anyone who treats "the agent leaked my key" and "the agent used my key to do something I didn't want" as the same problem is someone a practitioner quietly stops trusting.

## The map: does it mint authority, or just police it?

So you go looking for a product to help, and you fall into the real swamp: there are dozens of them and they do not do the same job.  One distinction cuts through all of it, and it is the single most useful thing in this piece.

Every product here either *issues* authority or *governs* it.

An *issuer* mints the thing the agent uses: a stored secret, a short-lived token, an identity, a brokered call.  *HashiCorp Vault*, *Infisical*, *SPIFFE/SPIRE*, [Anthropic's Workload Identity Federation](https://claude.com/blog/workload-identity-federation), *Keycard*, *Aembit*, the big cloud platforms, these create or hand out credentials.

A *governor* mints nothing.  It sits on top of the issuers and answers "what credentials exist, who owns them, which are stale, which are over-permissioned."  This is the whole *non-human identity* category, companies like *Astrix*, *Oasis*, and *Entro*.  Useful, but if you buy a governor expecting it to fix how your agent *holds* secrets, you bought the wrong class.

How do you know that difference is real and not a slide I made up?  Watch where the money went.  In the first half of 2026 the pure-governance players started getting absorbed into bigger identity platforms: Cisco [announced plans to acquire Astrix](https://blogs.cisco.com/news/cisco-announces-intent-to-acquire-astrix-security), and SailPoint completed its acquisition of Entro.  Read it as a signal that governance is turning into a feature.  The issuers, the ones actually changing how a credential gets minted, are where the sharper design choices still live.

One honest caveat, so this stays a lens and not a religion: some products do both, and the line blurs.  But when you evaluate anything in this space, the first question that saves you is simply, does this *mint* authority, or only police it?

## What each kind of issuer actually hands your agent

Among the issuers, the thing that matters for blast radius is *what kind* of credential lands in the agent, because that decides the damage on the bad day.  Here is the honest spread.

| Approach | What it hands the agent | Blast radius if the agent is hijacked | The catch |
|---|---|---|---|
| Static stored secret (classic secrets managers) | a long-lived key, fetched when needed | High: it's real and reusable the second it's in context | Simplest to run; nothing expires on its own |
| Dynamic / leased credential (Vault, Infisical dynamic secrets) | a password minted on the spot that dies in minutes | Lower: a stolen one is worthless fast | Only works for infrastructure that can mint short-lived creds (databases, cloud roles), not arbitrary SaaS keys |
| Workload identity (Anthropic WIF, SPIFFE/SPIRE) | a short-lived token exchanged for the agent's own identity, no static key | Lower for theft | Proves the *environment*, not the agent's *intent*, so it does nothing about a hijacked agent using the token in-window |
| Brokered / proxied (Infisical Agent Vault, Aembit) | nothing: the agent sends a placeholder, a proxy swaps the real secret in server-side | Lowest for the secret: the agent never holds it | Newest and least proven; still doesn't stop capability abuse |
| Delegated OAuth token (Auth0 Token Vault, Okta) | a user-approved token scoped to one service | Bounded by what the user granted | Scopes are often coarse; best when the agent acts for one specific human |

Read the table and the thesis falls out.  No row is "secure."  Each one shrinks a *different* slice of the blast radius, and every one of them still leaves capability abuse on the table.  Short-lived isn't safe, it's short.  Brokered isn't safe, it just moves the secret out of reach.  The job is not to find the winning row.  It's to know which slice you are actually buying.

## What I run, and what it cost

So what do I run, and what did it cost?  I'll be specific, because vague is how these pieces lie.

My agent fleet keeps its secrets in [Infisical](https://infisical.com) and reaches them through Infisical's Rust SDK compiled into my own tooling, with each agent authenticating as its own scoped *machine identity*, a login for software rather than a person, so the publishing agent literally cannot read the infrastructure agent's keys.  Secrets never reach a log, every read is recorded, and rotating a key is one write instead of a hunt across machines.  On the table above, that puts me squarely in the *static stored secret* row, hardened with scope, audit, and a fast rotation path.

Here is the honest cost, and it's the part worth stealing.  I did not build the fancy end of that table for my daily driver.  The credentials my agents hold are mostly long-lived stored keys, not ones that expire on their own, and that was a choice, not an accident.  Dynamic, self-expiring secrets only exist for infrastructure that can mint them, a database, a cloud role, and most of what an agent actually touches is third-party APIs that have no such mechanism.  So I bought scope, audit, and one-move rotation instead of ephemerality, because for my fleet that's the trade that reduces blast radius without turning every integration into a research project.  What it does not solve: a hijacked agent can still use a key while it legitimately holds it, and *secret zero*, the very first credential that lets an agent prove it is itself, still has to come from somewhere static.  Nobody has magicked that away.  You push it down a layer; you don't delete it.

The frontier is visible from where I'm standing, though.  Infisical itself now ships [Agent Vault](https://infisical.com/blog/agent-vault-the-open-source-credential-proxy-and-vault-for-agents), a proxy where the agent sends a placeholder like `__api_token__` and never sees the real secret at all.  That "hold nothing" pattern is the strong version, and Cloudflare's outbound credential injection works the same way.  Workload identity federation, like Anthropic's, is the lighter cousin: it kills the static key, but the workload still holds a short-lived credential, so it shrinks theft without ever reaching "hold nothing."

That is also how I think about maturity: match the controls to the stakes.  What's right for a single-operator daily driver is not what's right for a production system like [EdgePlane](https://edgeplane.ai), where more surface, less-trusted inputs, and higher-value targets change the math.  There the bar moves up, toward brokered credentials and workload-bound identity, so the agent holds less standing authority directly.  The point was never that one row of the table wins.  It's that blast radius should scale with consequence.

A quick word on *MCP*, the Model Context Protocol, the now-standard way to plug tools into an agent, because it is where this goes most wrong.  MCP is genuinely useful for tool discovery.  It is also, right now, where secrets hemorrhage: GitGuardian's 2026 audit found [24,008 secrets sitting in MCP config files](https://www.gitguardian.com/state-of-secrets-sprawl-report-2026), mostly keys for everyday developer and AI services like Google, Postgres, and Perplexity, largely because so many setup guides still tell you to paste your keys into a plaintext file.  The Amazon Q incident that opened this piece was exactly that, a malicious MCP config auto-loaded from a repo.  None of this makes MCP bad.  It makes it a delivery surface you keep sensitive secrets off of, which is why the sturdier setups route anything that matters around it.

## The boring controls that actually save you

The unglamorous parts are the ones that hold, so here is the Monday version.  When a secret rotates, does anything the agent is doing mid-run break, or does it pick up the new value cleanly?  When you need to cut an agent off right now, is there a break-glass move, or do you sit and wait for a token to expire?  And where do secrets leak besides the obvious place, because they pool in the unglamorous ones: logs, error messages, traces, and the agent's own memory.  One [empirical study of agent "skills"](https://arxiv.org/abs/2604.03070) found that 89.6% of leaked credentials were immediately exploitable, and that ordinary debug logging, the agent's own output being fed back into its context, accounted for 73.5% of the leaks.  The single highest-leverage control is not a lock, it's the audit log.  If a key that's normally read once at startup suddenly gets read forty times in a minute, that is visible, and visible is halfway to stopped.

## The part nobody has solved

Which brings us to the thing worth ending on honestly, rather than pretending the tools above close the loop.

Every layer in this piece, workload identity, short-lived tokens, brokered secrets, answers one question: is this agent who it claims to be, coming from where it claims?  None of them answers the question that actually matters the instant an agent is hijacked: should this particular action have happened at all?  The entire identity stack proves *who and from where*.  Intent, whether the thing the agent is about to do is the thing you wanted, is unproven, and the proposals to fix it, cryptographic per-hop delegation, tokens bound to a workflow, intent attestation, are competing early drafts with no convergence and no real deployment.  This is not a solved space dressed up as hard.  It is genuinely open, which is exactly why it's worth building in.

It is also about to matter on a clock.  Regulation and standards pressure are moving toward *runtime traceability*, being able to reconstruct what an agent did and why at the moment it acted, not just point back at a static permission record from when a token was issued.  That is the difference between "this agent had permission" and "this agent should have done that."

So the reassuring part, and it's real.  You do not need a security team or an exotic stack to be ahead of most production deployments.  Give each agent its own scoped identity instead of a shared key.  Keep an audit log loud enough that misuse is visible.  Control where the agent can send data.  Then carry the one question that reorganizes everything else: does the next tool I hand this agent *mint* new authority, and if so, how little can it be, how fast can it expire, and how loudly will misuse show up?  That is not a checklist you finish.  It is the question the whole field is still trying to answer, and you are now asking it earlier than most.
