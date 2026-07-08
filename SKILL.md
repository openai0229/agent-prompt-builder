---
name: agent-prompt-builder
description: "Interactively build and repair prompts for autonomous agent systems using a five-part runtime contract: Context, Request, Output Format, Constraints, and Checkpoint. Use when creating or improving Codex/Claude/Fable-style agent prompts, system prompts, skill prompts, multi-agent task briefs, prompt autopsies after failed agent runs, or reusable agent-behavior patterns. Especially relevant when the user is not a prompt/agent expert and needs the agent to ask high-quality questions, surface hidden boundaries, define permissions, verification, tool/memory limits, autonomy level, and stop conditions."
---

# Agent Prompt Builder

## Purpose

Use this skill to turn rough intent into an agent-ready runtime contract. Treat a prompt as operational instructions for an autonomous worker, not as persuasive prose.

Assume the user is not an agent-design expert and may also be only partially familiar with the business process. They may know a symptom or desired outcome without knowing the real workflow, stakeholders, data ownership, exceptions, approvals, or downstream consequences. Guide them by asking sharp questions, inspecting available artifacts when possible, explaining the consequence of each decision, and offering safe defaults.

The load-bearing structure is:

```text
Context: what situation the agent is operating in
Request: the exact action the agent must perform
Output Format: the deliverable shape and acceptance surface
Constraints: assumptions, boundaries, tool limits, and negative scope
Checkpoint: when to stop, ask, repair, or continue autonomously
```

## Workflow

## Operating stance

Default to interactive construction for agent-system prompts. Do not expect the user to volunteer complete requirements or know the right vocabulary.

If business understanding is weak, do not jump straight to prompt writing. First build a lightweight business map:

```text
Actors: who is involved or affected
Objects: tickets, orders, accounts, files, records, money, messages, code, etc.
Workflow: what enters, what changes, what exits
Rules: what must always/never happen
Exceptions: what happens when normal flow breaks
Evidence: where truth can be inspected
Authority: who can approve or override
Fact ledger: source, owner, timestamp, confidence for each business fact
```

Then build a few-shot calibration set before writing the final prompt. Rules explain boundaries; examples teach the agent how those boundaries behave in real cases.

For every stage:

1. Name the decision in plain language.
2. Ask only questions that change the prompt contract.
3. Explain the risk of guessing.
4. Offer a safe default.
5. Convert the answer into a concrete prompt clause.
6. Probe one adjacent boundary the user probably did not name.

Do not ask vague questions like "any preference?" or "can you provide more context?" Ask scenario-shaped questions a beginner can answer:

```text
When this agent is unsure, should it draft and wait, ask a human, or take action?
What is the worst thing this agent could accidentally change?
Who will use the output, and what would make it unusable for them?
What would make you say "wait, that is not what I meant" after it finishes?
What should the agent refuse to clean up, simplify, rename, overwrite, or remember?
```

### 1. Classify the job

Choose one mode:

- **Business discovery**: discover workflow, stakeholders, rules, data, exceptions, and evidence before writing the agent prompt.
- **Few-shot calibration**: collect, generate, validate, and compress examples that teach the agent desired, forbidden, borderline, and escalation behavior.
- **Guided interview**: build the prompt through staged questions for a novice user.
- **Interactive draft**: ask high-value questions before drafting when missing answers would change the agent's behavior contract.
- **Draft**: convert a rough user ask into an agent-ready prompt.
- **Repair**: improve an existing prompt or system instruction.
- **Autopsy**: diagnose a failed agent run and identify the missing contract section.
- **Handoff**: write a bounded task brief for a subagent, tool agent, or workflow stage.
- **Boundary lint**: scan a prompt for unsafe authority, tool, memory, mutation, or verification gaps.
- **Patternize**: extract a reusable prompt rule from a successful or failed task.

For open-ended agent architecture, tool-routing, multi-agent design, or high-stakes system-prompt decisions, first use a divergent pass like `$adhd`: generate multiple prompt-contract designs under different frames, then converge. For ordinary prompt cleanup, do the direct workflow below.

### 1.5. Run the interview loop

Use business discovery before guided interview when the user describes only a symptom, uses vague business terms, cannot name the source of truth, cannot name who approves outcomes, or says they are unsure how the business works. Use guided interview by default when designing a new agent, system prompt, tool-using workflow, subagent brief, or production-adjacent automation. Skip or compress the interview only when the user explicitly asks for a quick draft, supplies complete constraints, or says not to ask questions.

Ask questions before drafting when the answer would materially change one of:

- source of truth
- tool or memory permissions
- destructive or production boundaries
- output consumer and format
- verification standard
- autonomy level and checkpoint behavior
- domain-specific constraints the agent cannot infer

Do not ask generic preference questions. Do not ask for information the agent can inspect from local files, provided docs, command output, or explicit user text. If the user asked for speed, a quick draft, or "do not ask", draft with marked assumptions instead.

Ask in rounds, not a wall of questions. In each round, ask at most 3 questions. Each question must include:

1. the decision it controls
2. the risk of guessing
3. the default assumption you will use if the user does not answer

Question shape:

```text
I need these answers before the prompt can be reliable:

1. [Question]
   Controls: [which contract section changes]
   If I guess: [risk]
   Default if unanswered: [assumption]
```

Progress through these rounds:

0. **Business map round**: actors, objects, workflow, business rules, exceptions, evidence, authority.
1. **Few-shot round**: positive examples, negative examples, boundary examples, escalation examples, and expected outputs.
2. **Outcome round**: goal, user, success signal, output consumer.
3. **Evidence round**: what facts the agent may trust, inspect, infer, ignore, cite, or let override the user's first description.
4. **Authority round**: who can authorize, override, revoke, and audit each class of action.
5. **Permission ladder round**: observe, propose, edit, execute, publish; define which rung is autonomous and which requires approval.
6. **Boundary round**: adjacent systems, people, data, environments, cost/time limits, legal/compliance limits, and deliberate non-goals.
7. **Failure round**: worst accidents, over-help, rollback, uncertainty, conflicts, refusal, retries, handoff.
8. **Verification round**: downstream judge, tests, evidence, citations, logs, review workflow, done criteria.

After each round, summarize the clauses learned so far. If the user gives a narrow answer, widen it with one boundary probe:

```text
You answered the normal path. What should happen in the worst acceptable failure case?
```

Use permission escrow for ambiguous operations: the agent may prepare exact proposed actions, diffs, commands, messages, or plans, but must gate execution when ownership, reversibility, production impact, external users, money, or sensitive data is unclear.

If the user cannot answer a business question, ask for artifacts instead:

- a real example input and output
- screenshots of the current workflow
- field names or database tables
- SOPs, policy docs, ticket templates, CRM stages, spreadsheets, logs, emails, or chat transcripts
- names of people or roles who currently handle exceptions
- examples of the last ugly failures, rejected outputs, manual workarounds, and disputed cases

If no artifacts are available, create a conservative prompt that treats business facts as assumptions and blocks autonomous execution.

Unknown business rules are non-delegable. Do not turn weak business guesses into agent authority. Until a rule is backed by policy, system record, observed precedent, or an accountable owner, the agent may observe, draft, or recommend, but must not mutate state, affect external parties, or create obligations.

### 1.6. Build few-shot calibration

Use few-shot examples when behavior depends on judgment, classification, business terms, tone, escalation, tool permissions, or "what good looks like." Do not use examples as decoration.

Build a small calibrated set:

- **Positive**: input that should be handled normally and the expected output.
- **Negative**: tempting input that the agent must refuse, pause, or keep draft-only.
- **Boundary**: ambiguous case where the agent must ask, escalate, or mark uncertainty.
- **Counterexample**: similar-looking case that should produce a different decision.
- **Recovery**: failed verification, missing artifact, conflicting source, or unavailable tool.

Prefer real examples from artifacts. If real examples are unavailable, synthesize examples and label them as synthetic. Ask the user to validate synthetic examples before they grant autonomy.

Few-shot example format:

```text
Example type:
Manifest: domain, risk class, authority rung, evidence source, checkpoint trigger
Input:
Expected behavior:
Expected output shape:
Why:
Do not learn:
Source: real / synthetic / inferred
Confidence:
Maps to clauses:
```

Accept examples through a gate before they can influence the final prompt:

- reject examples with unverifiable facts, hidden owners, sensitive data, fake business nouns, or unclear authority
- label each example as normal, edge, refusal, escalation, or recovery
- include at least one pause/escalation example for each risky permission rung
- separate tone from authority; decisive wording is not approval
- require an example-to-clause trace so no helpful behavior appears without a contract clause

Keep only examples that change behavior. Remove examples that duplicate rules, leak private data, encode stale policy, launder exceptions into defaults, or teach accidental formatting quirks. Compress validated examples into the final prompt as short behavior anchors.

### 2. Build the five sections

Write each section with observable nouns and testable verbs.

- **Context**: include audience, environment, source of truth, permissions, state, and why the work matters.
- **Request**: state one primary action. Split separate actions into ordered phases.
- **Output Format**: define the exact artifact, structure, length, machine-readability, citations, file paths, or verification report expected.
- **Constraints**: state what the agent must not infer, mutate, fetch, remember, overwrite, or simplify away.
- **Checkpoint**: define stop conditions. Use it as a rollback gate, not a progress-update ritual.
- **Verification**: place verification requirements in Output Format or Constraints so claims must be backed by command output, file paths, citations, test results, or explicit assumptions.

Default Checkpoint rule:

```text
Continue autonomously unless the work involves an irreversible action, a scope change, conflicting instructions, missing user-owned information, credential/secrets exposure, destructive file operations, production impact, or a required approval boundary.
```

### 3. Run the contract checks

Before finalizing, check the prompt against these failure smells:

- **Missing authority**: unclear who authorized a decision, tool use, memory use, or mutation.
- **Untestable verbs**: "make it better", "professional", "robust", "smart" without acceptance criteria.
- **Constraint collision**: two reasonable instructions cannot both be satisfied.
- **Absence leak**: silence lets the agent invent missing context or user intent.
- **Checkpoint drift**: the prompt asks the agent to ask too often, or lets it continue through risky changes.
- **Output ambiguity**: the downstream consumer cannot tell whether the result is complete or parseable.
- **Accountability escape**: the agent can hide behind assumptions, vague caveats, or unsupported claims.
- **Novice blind spot**: the prompt assumes the user already knew to specify authority, side effects, sensitive data, failure recovery, or verification.
- **False confidence**: the agent can sound certain without live proof, inspected artifacts, or explicit uncertainty.
- **Over-help**: the agent can "helpfully" simplify, rename, generalize, publish, message, delete, or fix adjacent work that was never authorized.
- **Hidden downstream judge**: the output is optimized for the requester but will be consumed by a parser, CI job, customer, reviewer, regulator, or another agent.
- **Business mirage**: the prompt uses business nouns like "customer", "order", "lead", "qualified", "resolved", "approved", or "risk" without defining who owns them, how they are recognized, and what system records them.
- **Exception blindness**: the prompt covers the normal workflow but not refunds, disputes, abuse, fraud, duplicate records, missing identity, stale state, manual overrides, or partial failure.
- **Invented governance**: the agent can invent policy, compliance interpretation, approval, customer promise, or business rule because the real owner is unknown.
- **Metric trap**: the agent can optimize a literal KPI while violating business intent, customer trust, compliance, or operator workload.
- **Social irreversibility**: the prompt treats emails, refunds, suspensions, escalations, promises, or executive-visible actions as reversible because the database can be rolled back.
- **Example overfit**: few-shot examples teach incidental names, stale policies, private data, or formatting quirks instead of the intended behavior.
- **Missing negative shot**: the prompt shows what to do but not when to refuse, pause, escalate, or mark uncertainty.

If any smell appears, repair the relevant section before presenting the prompt.

Run a refusal rehearsal before finalizing:

```text
The agent must pause, refuse, or escalate when:
- [case]
- [case]
- [case]
```

### 4. Add evidence and provenance

For important prompts, keep a short chain of custody:

- Which source facts came from user text, files, screenshots, docs, or prior runs.
- Which requirements are inferred by the agent.
- Which uncertainties remain.
- Which constraints are deliberate negative scope.

Do not let screenshots, OCR, copied snippets, or vague memory become doctrine without labeling provenance and uncertainty.

### 5. Produce the result

For prompt drafting or repair, output:

1. The final prompt, ready to paste.
2. A short note listing the main design choices.
3. Any unresolved assumptions or checkpoint triggers.

For interactive draft mode, output either:

1. A question pack when required information is missing, or
2. The final prompt plus marked assumptions when the missing information is low-risk.

For guided interview mode, output:

1. Current round name.
2. Up to 3 questions.
3. Why each answer matters.
4. Safe default if unanswered.
5. A short "what we already know" summary.

For business discovery mode, output:

1. A current business map with unknowns marked.
2. Up to 3 artifact or scenario requests.
3. The safest temporary assumptions.
4. A warning that no autonomous execution should be granted until the map is validated.
5. A fact ledger for any business facts already used.

For few-shot calibration mode, output:

1. The candidate example set grouped by positive, negative, boundary, counterexample, and recovery.
2. Which examples are real vs synthetic.
3. What behavior each example teaches.
4. Which examples need user validation.
5. The example-to-clause trace.
6. The compressed examples to embed in the final prompt.

For final agent prompts created from guided interview, include a compact receipt:

1. assumptions used
2. permission gates crossed
3. evidence required
4. refusal or escalation cases
5. unresolved authority gaps

For prompt autopsy, output:

1. Failure summary.
2. Missing or weak section: Context, Request, Output Format, Constraints, or Checkpoint.
3. Repair move.
4. Revised prompt snippet.

For subagent handoff briefs, output:

1. The bounded task.
2. The allowed context and source limits.
3. The disallowed actions.
4. The expected return format.
5. The stop conditions.

## Minimal Template

```text
Context:
[Task background, audience/user, environment, source of truth, current state, and why this matters.]

Request:
[One clear primary action. Add ordered phases only when needed.]

Output Format:
[Exact deliverable shape, structure, file paths, length, citations, verification report, or machine-readable schema.]

Constraints:
[Forbidden assumptions, forbidden mutations, tool/memory/network boundaries, quality bar, negative scope, and uncertainty policy.]

Checkpoint:
[Stop/ask/repair conditions. Everything else should continue autonomously and report at the end.]
```

## References

- Read `references/few-shot-guide.md` before building or teaching few-shot examples, especially when the user says they do not know how to write examples.
- Read `references/checklist.md` when auditing a prompt or diagnosing a failed agent run.
- Read `references/examples.md` when the user asks for examples or when drafting a new agent prompt from a rough request.
- Read `references/question-bank.md` when the user is a beginner, the domain is underspecified, or the agent may use tools, memory, external systems, private data, or autonomous actions.
