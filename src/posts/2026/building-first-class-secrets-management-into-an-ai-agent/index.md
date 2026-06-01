---
title: "Building first-class secrets management into an AI agent"
created: "2026-05-22"
status: "published"
tags: ["infisical","secrets","rust","agents","security"]
summary: "The .env file is a collaboration tool for human engineers. It was never meant to be a security primitive. When you run an always-on agent fleet, that distinction stops being theoretical."
---

The `.env` file is a collaboration tool for human engineers.  It was never meant to be a security primitive.  When you run an always-on agent fleet, that distinction stops being theoretical.

*Aria* is the Rust CLI that runs my personal agent stack.  It compiles to a single binary, runs as a persistent service across multiple persistent profiles, and handles the substrate for each one: calling external APIs, spawning subprocess workers, managing [MCP servers](https://modelcontextprotocol.io), running browser automation, and coordinating with a fleet orchestrator.

Each profile has its own identity, vault access, and set of integrations.  The substrate is the same binary across all of them, wired differently per profile.

For about two weeks, the secret management strategy was a mix of `.env` files, shell exports, and the kind of optimism that usually ends in an incident.  Then I wired in [Infisical](https://infisical.com) and built a proper Rust interface around it.

The difference was big enough to write about.

## What is wrong with `.env` files for agents

The `.env` pattern has three failure modes that are inconvenient for humans and dangerous for agents.

First: staleness.

A `.env` file captures credential state at the moment you write it.  When you rotate an API key, you update the file.  When an agent is running continuously, it does not automatically reload that file.  It keeps calling with the old key until it fails, until you restart it, or until you notice.

Second: `.env` is read-only infrastructure in practice.

Agents need to write secrets, not just read them.  OAuth refresh tokens expire and get replaced.  Derived credentials get generated at runtime.  First-run setup flows produce new tokens.  A `.env` file has no clean write path.  You end up with conditional logic that checks for newer credentials somewhere else, or worse, ignores refresh entirely.

Third: the surface area compounds.

An agent fleet with six profiles, each calling 8-12 services, quickly turns into dozens of credentials to track, rotate, scope, and not accidentally commit to git.  At some point the real job becomes managing `.env` files instead of running the agent.

## Infisical as the secrets backbone

[Infisical](https://infisical.com) is an open-source platform for managing secrets, credentials, certificates, and machine access.  It gives you access control, secret versioning, machine identities, API access, SDKs, and audit logs.

The mental model is a permissioned, versioned filesystem for credentials.  Paths look like:

```text
/providers/openai/OPENAI_API_KEY
/infra/freshrss/FRESHRSS_API_PASSWORD
/providers/google/OAUTH_REFRESH_TOKEN
```

You authenticate as a machine identity (*Universal Auth*) or with a project service token.  Every read is live.  Every write is audited.  The [free Secrets Manager tier](https://infisical.com/pricing) is enough for a personal stack, though it is not unlimited: the current free tier caps identities, projects, environments, and integrations.  That is still plenty for a solo agent backbone.

## How Aria uses it

Aria wraps the SDK in an `InfisicalClient` struct that handles auth, caching, retries, and bidirectional access:

```rust
// Resolve a secret by path (cached in-process)
let api_key = client.resolve("/providers/openai/OPENAI_API_KEY").await?;

// Write back a derived credential (upsert semantics)
client.set("/providers/google/OAUTH_REFRESH_TOKEN", &new_token, None).await?;
```

Subprocess injection works the same way from the CLI:

```bash
aria secrets inject \
  --map 'OPENAI_API_KEY=/providers/openai/OPENAI_API_KEY' \
  -- python3 server.py
```

A few design choices worth noting.

*Bidirectional by default.* The `set()` method does a create-or-update against Infisical, then invalidates the in-process cache so the next `resolve()` call fetches the fresh value.  Agents that rotate OAuth tokens, store derived keys, or update credentials after first-time setup can write back to the same store they read from.  No separate write path to wire up.

*In-process cache with targeted invalidation.* Every `resolve()` hit checks an in-process `RwLock<HashMap>` before going to the API.  Cache entries survive for the lifetime of the process.  Write operations (`set()`, `delete()`) invalidate the specific key so the next read is fresh.  You pay the network cost once per process restart, not once per API call.

*Automatic session recovery.* Universal Auth tokens have TTLs.  When the API returns a 401, the client re-authenticates transparently and retries with exponential backoff and jitter.  The running agent does not notice the expiry.

*Subprocess injection with injection protection.* The `secrets inject` command resolves a map of env-name to Infisical paths, then executes a subprocess with those values in its environment using `exec()` (no child process, single PID, clean signal semantics).  Before the exec, it validates env-var names against a denylist that includes `LD_PRELOAD`, `DYLD_INSERT_LIBRARIES`, `BASH_ENV`, `NODE_OPTIONS`, and similar loader-level variables.  You cannot inject a dynamic linker hijack through this interface.

*Startup validation.* `aria secrets validate` resolves every secret path the active config references and reports per-path OK or FAIL.  If any required secret is missing, it exits non-zero.  This runs at agent startup so configuration drift is caught immediately, not at the first API call that fails at 2am.

The Infisical dashboard covers the other half: full audit log of every read and write, secret version history, environment isolation (prod vs dev), and per-identity access control.  The [Infisical docs](https://infisical.com/docs/documentation/getting-started/introduction) have screenshots if you want to see the UI before signing up.

## "Wait, you're giving the AI your API keys?"

Yes.  And I understand the instinct to pause on that.  Handing an agent access to your credentials sounds like one carefully-crafted email subject line away from an interesting afternoon.

But the question worth asking is: what are you actually protecting against, and does your current setup protect against it?

The realistic threats for a personal agent stack are prompt injection (malicious content in a fetched page or email redirects the agent into exfiltrating a credential), buggy tool logic that leaks a secret value into a log or output, and a compromised dependency in the agent binary itself.

None of those are solved by a `.env` file.  What a `.env` file does is make secrets slightly harder to access than the agent binary.  It does not provide rotation, does not provide audit visibility, and does not scope access by identity.

Here is what the Infisical integration actually adds on the security side.

*Secrets never appear in logs.* A `redact()` function runs on every error message and output before it leaves the process.  If a secret value ends up in an error string, it gets replaced with `[REDACTED]` before anything downstream sees it.

*Minimum-scope machine identity.* The agent authenticates as a dedicated Universal Auth identity with access only to the paths it needs.  It does not have admin access to the Infisical project.  If the identity is compromised, you rotate the machine credentials and the secret paths it could access are visible in the audit log.

**The audit log is the detection layer.** Every Infisical-side secret access is logged with a timestamp, identity, and path.  Anomalous access patterns are visible.  If something reads `/providers/openai/OPENAI_API_KEY` forty times in a minute when the agent normally reads it once at startup, that shows up.

*Layered encryption at rest.* Infisical encrypts sensitive data before persistence using AES-256-GCM and a layered key hierarchy.  A database-only compromise is not enough to decrypt the secrets.  That is not the same thing as "the agent is safe to leak secrets," but it is materially better than plain files scattered across hosts.

*Rotation has an operational path.* When a key is compromised or expires, you update it in Infisical.  The agent picks it up on the next cache miss or process restart.  No file to hunt down, no shell history to clear, no manual push to six machines.

**The real risk of agents and secrets is not "agent has access to credentials."  It is "agent has access to credentials with no audit trail, no rotation path, and no scoping."** The `.env` model gives you all of that risk with none of the controls.  Infisical inverts that.

## What this changes

The shift is not just operational convenience.  An agent with a proper secrets interface is a different kind of system than one managing credentials through environment files.  It can rotate its own credentials.  It can validate its access surface at startup.  It can share credentials across a fleet without file synchronization.  It can write back secrets it discovers or generates.

The `.env` file works fine when a human is sitting next to the process.  When the agent is running at 6am pulling a briefing, calling calendar APIs, and spawning subprocesses, a setup that requires a human in the loop to keep credentials fresh is the wrong one.

Infisical with the Rust SDK took about two days to wire in properly.  It has not needed attention since.
