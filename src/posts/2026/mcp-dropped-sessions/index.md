---
title: "MCP Went Stateless. Agents Did Not."
created: "2026-06-22"
status: "published"
tags: ["mcp","agents","architecture","infrastructure","sessions","edgeplane"]
summary: "MCP's 2026-07-28 release candidate removes sessions from the protocol. That reads like an argument against persistent agents. It's the opposite: the session that matters was never the protocol's job to hold."
description: "MCP's July 2026 release candidate removes sessions from the protocol. That reads as an argument against persistent agents. It's the opposite."
---

![A wall of pipes labeled MCP crumbles apart where a placard reading Session breaks into rubble, while a solitary figure at a desk with books, coffee, and a laptop faces an intact, softly lit archive tower labeled Agent Runtime filled with organized file boxes](./og.png)

The largest revision of *Model Context Protocol* since launch is now in release-candidate form, and the change everyone is reacting to is a subtraction.  The [2026-07-28 release candidate](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) removes sessions.  Gone is the `initialize` handshake.  Gone is the `Mcp-Session-Id` header.  Protocol version, client info, and capabilities now travel inline on every request, which means any server instance can answer any call behind a plain round-robin load balancer.  SDK support is already appearing, including on the [Python SDK's v2 alpha line](https://github.com/modelcontextprotocol/python-sdk/releases), while the stable v1 series remains the production recommendation, so this is the direction of travel rather than a design sketch.

If you have read me argue that [persistent sessions are the unit of agent work](/posts/persistent-sessions-unit-of-agent-work), removing sessions from the protocol looks like a contradiction.  It is the opposite.  Read closely, the stateless turn is the strongest evidence for that thesis the ecosystem has produced.

Here is the question the whole debate turns on.  When you say your agent has a session, which session do you mean?

## Two things wearing the same word

There are two of them, and they live on different layers.

The first is the *transport session*: the connection between an agent and a tool server.  It exists so the server can remember, mid-exchange, who it was talking to.  This is the session MCP just deleted.  It is the `Mcp-Session-Id` that pinned a client to a particular server instance so a sequence of calls could share setup.

The second is the *agent session*: the agent's own working state.  Its memory, its in-flight plan, its half-finished tool calls, the thread of a task that spans minutes or hours.  This is the session I have argued is the real unit of work.  It is also the one MCP never held, never tried to hold, and was never the right place to hold.

When those two collapse into one word, you get the confusion on display this week.  People read "MCP removed sessions" as "agents lost their memory."  But the protocol was only ever managing the first kind.  The second kind lives a layer up, in the runtime that owns the agent.

Make it concrete.  A browser-automation server should not lean on `Mcp-Session-Id` to remember which browser it launched.  It should hand back a `browser_id` and take it as an argument on the next call.  Then the agent runtime, not the transport, decides how that handle is stored, resumed, expired, and tied to the larger task.  The tool stays stateless, and the continuity lives where the agent already lives.

![Two-panel diagram contrasting the transport session MCP removed (Mcp-Session-Id, sticky connections, hard to scale) with the agent session that matters (durable memory, identity that survives restarts, long-running tasks). Protocols move data; runtimes own state.](./stateless-mcp.png)

## We have run this experiment before

If the move feels familiar, it should.  The web tier learned this lesson twenty years ago.

Early web applications kept user state in the application server's memory and used sticky load balancing to make sure each user kept hitting the same box.  It worked until it didn't.  Sticky routing made scaling lumpy, deploys disruptive, and failover lossy.  The fix was not to make the servers remember harder.  It was to make them stateless and push durable state into a dedicated store, so any server could serve any request and the state that mattered lived where it could be managed on its own terms.

MCP just had that moment.  Transport stickiness solved a real problem and then became one.  It pushed implementers toward shared session stores and sticky routing to keep a tool interaction resumable, when the state people actually needed to resume, a browser, a cart, a cursor, a multi-step workflow, was better held as an explicit application handle than smuggled into a transport session.  **The protocol got more scalable by admitting that the durable state was never its to keep.**

Notice what the same release candidate does on the other side of that boundary.  It promotes a [tasks extension](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/): a server can hand back a task handle and let the client drive it with `tasks/get`, `tasks/update`, and `tasks/cancel`.  Long-running work does not need a sticky socket held open.  It needs a durable handle the client can come back to from anywhere.  That is the shape of the whole revision.  Make the connection disposable so the work can be durable.

## Why the boundary is the point

A cleaner boundary is worth more than it sounds.

When the transport layer was stateful, the temptation was to smuggle agent-meaningful state into it.  Conversation context riding along in a session the load balancer happened to keep alive.  Setup that quietly assumed the next call would land on the same instance.  That is how you build a system that works in the demo and falls apart the first time it scales horizontally, because the thing you were depending on was an accident of routing, not a designed place for state.

Stateless MCP removes the temptation.  It forces the question every agent architecture should answer on purpose: where does the durable identity and memory of this agent actually live?  If your answer is "in the agent runtime, above the tool layer," the protocol is now aligned with you.  If your answer is "I'm not sure," the protocol just took away the hiding place, and that is a gift.

This is the part worth sitting with.  A protocol getting simpler by deleting state is not the protocol getting weaker.  It is the protocol refusing to be the wrong home for something important.  The tool connection becomes a dumb pipe so the agent session can be the smart, durable thing.  Those are supposed to be different layers.  For a while the protocol let you pretend they were one.

## The takeaway for anyone building on this

If you are running agents in production, the stateless RC is a prompt to audit your own boundary.

Where does an agent's memory live when the process restarts?  What gives an agent an identity that is the same identity tomorrow?  When a long task spans an hour, what holds the thread, and is it something you designed or something you inherited from a transport detail?  If the honest answer points at the tool layer, this release is going to surface that, and better now than during an incident.

So when the next protocol gets simpler by removing state, resist the reflex to ask what broke.  Ask instead where that state needed to live all along.  Most of the time, the protocol giving it up is telling you it was never the protocol's job.

