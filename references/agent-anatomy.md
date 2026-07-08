# Agent Anatomy Guide

Use this guide before drafting an agent prompt when the user, the model, or the prompt itself treats an agent as "just instructions." An agent is a runtime system: model behavior plus state, tools, permissions, feedback, and control flow.

## Load-Bearing Definition

For this skill, define an agent as:

```text
Agent = model + instructions + context + state + tools + control loop + authority + observation + verification + handoff/recovery.
```

If one part is missing, the prompt must either remove the implied capability or mark it as a required external dependency. Do not let the prompt imply magic powers.

## Anatomy Map

Build this map before writing prompt prose:

```text
Identity:
  Name, role, owner, user, operating environment.

Goal:
  Outcome, success signal, non-goals, downstream consumer.

Inputs and sensors:
  User messages, files, screenshots, databases, APIs, browser pages, logs, memory, events, subagent reports.

Context window:
  What is visible now, what is hidden, what may be summarized, what must be ignored.

State:
  Ephemeral scratchpad, durable memory, task ledger, external system state, local files, emitted obligations.

Reasoning and planning:
  When to plan, when to act directly, when to decompose, when to ask.

Tools and actuators:
  Shell, browser, database, issue tracker, email, chat, filesystem, deploy tools, payment/refund systems, subagents.

Authority:
  What each tool/action is allowed to do autonomously; who approves higher-risk rungs.

Control loop:
  Observe -> decide -> act -> verify -> report/escalate/recover.

Verification:
  Tests, citations, command output, source records, evaluator, reviewer, parser, rubric.

Memory:
  Read/write permissions, owner, TTL, invalidation trigger, privacy boundary.

Handoff:
  What another human or agent needs to take over mid-run without hidden context.

Observability:
  Logs, receipts, traces, evidence notes, decision records, failure reports.

Stop and recovery:
  Kill switch, rollback, retries, degraded output, refusal, escalation.
```

## Beginner Translation

When the user is a beginner, translate anatomy into plain body parts:

```text
Eyes: what can the agent see?
Ears: who can talk to it?
Brain: what rules and facts can it reason with?
Pockets: what can it carry or remember?
Hands: what can it change?
Mouth: who can it speak to, and in what format?
Boss: who can approve risky actions?
Judge: who decides whether it succeeded?
Clock: how long may it work or wait?
Brake: what makes it stop?
```

Any instruction with no body part goes into the "pretend magic" pile and must not become an operational prompt clause.

## Bill of Materials Gate

Before drafting, require a bill of materials:

```text
Component:
Exists now: yes | no | assumed | external dependency
Source of truth:
Owner:
Allowed operations:
Forbidden operations:
Failure mode:
Checkpoint trigger:
Prompt section:
```

Use this gate for tools, memory, external systems, subagents, evaluators, and live data. If `Exists now` is `assumed`, the agent may draft or recommend only; it may not execute based on that component.

## Capability-to-Liability Ledger

For every action verb in the prompt, write the liability line:

```text
Action:
Input evidence required:
State changed:
External party affected:
Reversibility:
Approval required:
Verification required:
Failure mode:
Refusal/escalation trigger:
Recovery path:
```

Examples:

- "Classify a customer" changes priority only if the scoring rule, CRM field, and owner are known.
- "Draft an email" affects nobody until sent; "send an email" creates a social obligation.
- "Run a query" may be observe-only in dev but destructive in production.

## Runtime Loop

Do not write only what the agent should do. Define the loop it follows:

```text
Observe: gather allowed evidence.
Interpret: classify the task, risk, and missing parts.
Plan: choose the next action and fallback.
Act: use an allowed tool or produce an output.
Verify: compare result with evidence, tests, or rubric.
Record: report what was done, what was assumed, and what remains unknown.
Recover: retry, degrade, ask, escalate, or stop.
```

For production-adjacent agents, require a black-box recorder:

```text
Log these events:
- evidence used
- tool calls or skipped tool calls
- permission rung crossed
- assumptions made
- verification result
- refusal/escalation reason
- handoff state
```

## State and Memory Coherence

Every fact must live in a named state class:

```text
read_only_input: visible for this run only
cached_belief: remembered but may be stale
mutable_state: files, records, tickets, database rows, settings
emitted_obligation: messages, commitments, approvals, public artifacts
forgotten_residue: data that must not be carried forward
```

For memory, define:

```text
memory_item:
owner:
ttl:
write_allowed: yes | no
read_allowed: yes | no
invalidation_trigger:
private_data_policy:
```

If no TTL or owner exists, treat memory as stale context, not authority.

## Conflict Arbitration

Agents receive conflicting signals. Define who wins:

```text
If user request conflicts with inspected artifact:
If memory conflicts with live tool output:
If policy conflicts with convenience:
If old example conflicts with current rule:
If subagent report conflicts with primary evidence:
If tool failure conflicts with deadline:
```

Default order for factual claims:

1. current authoritative system record
2. current policy or contract
3. inspected artifact or runtime output
4. accountable owner statement
5. user description
6. prior memory
7. model inference

Authority to act is separate from factual truth. A fact can be true while the agent still lacks permission to act on it.

## Tool Pinout and Fuses

For each tool or actuator:

```text
Tool:
Direction: read | write | read/write | publish
Scope:
Credentials:
Allowed inputs:
Allowed outputs:
Autonomous limit:
Trip condition:
Reset path:
Maximum blast radius:
```

Add fuses between failure domains:

- local scratch work
- workspace files
- private data
- external systems
- production
- money
- customer-visible messages
- durable memory

If a fault can cross domains, require approval or a checkpoint before crossing.

## Handoff Packet

If another human or agent might take over, require:

```text
Current goal:
Known facts with sources:
Current state:
Actions already taken:
Tools used:
Open risks:
Blocked decisions:
Next safe step:
What not to assume:
```

If the task cannot be handed off without hidden context, the prompt is under-specified.

## Anatomy Mismatch Refusal

Reject or downgrade any prompt that assumes a component that does not exist:

- asks the agent to "check live status" with no live data source
- asks the agent to "remember next time" with no memory write permission
- asks the agent to "approve" without naming the approver or policy
- asks the agent to "notify customers" with no channel, template, or approval
- asks the agent to "fix automatically" with no rollback or verification
- asks the agent to "coordinate subagents" with no ownership or merge protocol

Safe downgrade:

```text
The agent may draft the plan/output and list required components. It must not execute until the missing component is provided or explicitly authorized.
```

## Organ Removal Drill

Before finalizing, remove each organ and see whether the prompt still tells the truth:

```text
If tools are unavailable, what changes?
If memory is unavailable, what changes?
If live state is unavailable, what changes?
If user approval is delayed, what changes?
If verification fails, what changes?
If a subagent returns unusable output, what changes?
```

If the answer is "nothing changes," the component was fake or the prompt is hiding a failure mode.

## Prompt Mapping

Map anatomy into the five-part contract:

```text
Context:
  identity, owner, environment, inputs, state, source of truth

Request:
  goal, phases, runtime loop, allowed action verbs

Output Format:
  response shape, logs, receipts, handoff packet, verification report

Constraints:
  tool fuses, memory policy, authority ladder, conflict arbitration, non-goals

Checkpoint:
  kill switch, approval gates, missing anatomy, domain crossing, recovery paths
```

Do not finish the prompt until every major anatomy item appears in one of these sections or is explicitly out of scope.

## Source-Backed Notes

- OpenAI Agents SDK describes agents as LLMs configured with instructions, tools, guardrails, handoffs, output types, and lifecycle hooks, run through an agent loop.
- Anthropic describes the basic building block of agentic systems as an augmented LLM with retrieval, tools, and memory, then distinguishes workflows from more autonomous agents.
- Production agent systems need observability and traces because failures often happen across tool calls, state, handoffs, or verification, not only inside the model response.

Sources:

- OpenAI Agents SDK, Agents: https://openai.github.io/openai-agents-python/agents/
- OpenAI Agents SDK, Running agents: https://openai.github.io/openai-agents-python/running_agents/
- OpenAI Agents SDK, Guardrails: https://openai.github.io/openai-agents-python/guardrails/
- Anthropic, Building effective agents: https://www.anthropic.com/engineering/building-effective-agents
