# Agent Prompt Contract Checklist

Use this checklist when auditing or repairing an agent prompt.

## Section Checks

## Interaction Gate

Default to asking staged, high-quality questions when building a new autonomous agent prompt. Ask only when the answer changes the contract, but assume novice users will omit critical boundaries unless prompted.

Good questions target:

- source of truth
- authority to act
- tool, memory, browsing, filesystem, or production permissions
- output consumer and format
- verification standard
- stop conditions
- domain constraints unavailable from the provided materials
- failure recovery and rollback
- sensitive data handling
- cost, latency, rate limit, and operational limits
- human approval and escalation paths
- blast radius if the agent is confidently wrong
- downstream consumers that will trust the output
- adjacent tasks that look helpful but violate ownership or consent
- what should not be cleaned up, renamed, simplified, skipped, fetched, remembered, or generalized
- business actors, objects, workflow stages, exceptions, approvals, and source systems
- real examples and artifacts when the user cannot explain the process
- positive, negative, boundary, counterexample, and recovery examples

Reject weak questions:

- "Any preferences?"
- "Can you provide more context?" without naming the missing decision
- "Should I continue?" when the Checkpoint already allows autonomous work
- questions answerable from local files or provided source material

A high-quality question includes:

```text
Question:
Controls:
Risk if guessed:
Default if unanswered:
```

## Beginner Handling Rules

- Do not use agent-design jargon without translating it into a scenario.
- Offer concrete options when the user may not know what choices exist.
- Ask about the bad path, not only the happy path.
- Convert answers into prompt clauses immediately.
- If the user says "随便" or "你决定", choose the safest default and state it.
- If the user gives a narrow scope, ask one widening question about hidden side effects.
- If the user asks for too much autonomy, add approval gates around irreversible actions.
- If the user wants no questions, produce a draft with explicit assumptions and a risk note.
- If the user cannot answer, offer safe options instead of stalling.
- If the user says "I do not know", choose draft-only/read-only defaults and mark the gap.
- If the user does not understand the business process, switch to artifact-driven discovery.
- If no business artifacts exist, keep the agent in observe/propose mode only.

## Business Discovery Map

Before writing prompts for unclear domains, fill this map:

```text
Actors:
Objects:
Workflow:
Rules:
Exceptions:
Evidence:
Authority:
Fact ledger:
Unknowns:
```

Ask for examples before abstractions:

- "Show one real input and one acceptable output."
- "Who touches this before and after the agent?"
- "What fields/statuses change?"
- "What cases currently get escalated?"
- "Where would someone verify the truth?"
- "Who rejects this output, and what rework happens next?"
- "Which customer, region, queue, contract, launch freeze, quarter-close, incident freeze, or legal hold changes the normal rule?"

## Few-Shot Calibration

Add few-shot examples when behavior depends on judgment, business vocabulary, classification, escalation, tool use, tone, or output acceptance.

Minimum useful set:

- **Positive**: normal case the agent should handle.
- **Negative**: case the agent must refuse, pause, or keep draft-only.
- **Boundary**: ambiguous case requiring uncertainty, escalation, or extra evidence.
- **Counterexample**: looks similar to a positive case but should produce a different decision.
- **Recovery**: missing artifact, failed verification, unavailable tool, or conflicting sources.

Each example must include:

```text
Example type:
Manifest:
- domain:
- risk class:
- authority rung:
- evidence source:
- checkpoint trigger:
Input:
Expected behavior:
Expected output shape:
Why:
Do not learn:
Source: real / synthetic / inferred
Confidence:
Maps to clauses:
```

Few-shot safety checks:

- Prefer real examples from artifacts.
- Label synthetic examples clearly.
- Ask the user to validate synthetic examples before autonomous execution.
- Redact private data.
- Avoid encoding stale policy as permanent behavior.
- Include negative and boundary examples, not only success examples.
- State what the model should not learn from the example.
- Keep examples short enough to fit in the final prompt.
- Remove examples that only teach formatting already defined elsewhere.
- Reject examples that demonstrate behavior no contract clause authorizes.
- Label exception examples so they do not become the default path.
- Include at least one pause/escalation example for risky rungs: execute, publish, money, production, customer-visible, destructive, policy/compliance.
- Preserve failure evidence in recovery examples; do not rewrite partial success into a clean success story.

Example-to-clause trace:

```text
Example:
Teaches:
Final prompt clause:
Acceptance stamp: accepted / rejected / needs validation
Reason:
```

## Business Fact Ledger

Do not turn business facts into agent authority unless they have provenance.

```text
Fact:
Evidence class: policy / system record / customer artifact / workflow log / expert memory / user guess
Source:
Owner:
Timestamp or freshness:
Confidence:
Can authorize action? yes/no
```

Default ranking:

1. current policy or contract
2. live system record
3. workflow log, ticket, approval, or customer artifact
4. documented SOP or template
5. accountable expert memory
6. requester guess
7. agent inference

Only the first four can normally justify autonomous mutation. Expert memory, guesses, and inference can justify drafts, recommendations, or questions.

## Business Exception Probes

Ask about:

- last three times the process went wrong
- outputs that downstream teams reject
- special customers, VIPs, regions, queues, contracts, or account states
- manual overrides and unofficial bypasses
- temporary workarounds that should not become policy
- stale records, duplicate records, expired cases, missing identity, disputed ownership
- billing, renewals, support, legal, compliance, and audit side effects
- business freeze windows: quarter close, launch freeze, incident freeze, legal hold
- actions reversible in the database but irreversible socially: emails, refunds, suspensions, escalations, promises
- KPIs that become harmful when optimized literally

## Permission Ladder

Separate agent authority into rungs:

1. **Observe**: read, inspect, search, list, summarize.
2. **Propose**: draft commands, diffs, replies, plans, or recommendations.
3. **Edit locally**: change local files or local-only state.
4. **Execute**: run commands, queries, migrations, API calls, or workflows.
5. **Publish**: send messages, push commits, deploy, close tickets, refund, change customer/account state, or affect external users.

Each prompt should state the highest autonomous rung and which rungs require approval.

## Evidence Classes

Label important inputs by class:

- user claim
- inspected artifact
- runtime observation
- memory
- inference
- external source

State what evidence may overrule the user's first framing. Default: inspected artifacts and runtime observations can correct the diagnosis, but external side effects still require the user's authority.

### Context

- Does it name the task environment and source of truth?
- Does it state who the output serves?
- Does it separate facts from assumptions?
- Does it include relevant tool, repo, filesystem, runtime, or data boundaries?
- Does it name what context the agent must ignore even if available?
- Does it say what evidence may overrule the user's initial description?
- Does it define ambiguous business nouns with source systems or observable fields?
- Does each business fact that grants authority have provenance and freshness?

### Request

- Is there one primary action?
- Are phases ordered when there are multiple actions?
- Are vague verbs replaced with concrete operations?
- Is success observable without guessing user intent?
- Does it distinguish normal path, exception path, and escalation path?
- Does it reject broad verbs until they have examples, acceptance tests, or explicit boundaries?
- Does it avoid automating a workflow the user cannot describe or evidence?
- Does it classify each action by consequence: observe, draft, recommend, mutate internal state, affect external parties, or create obligation?

### Output Format

- Is the deliverable shape explicit?
- Is the output usable by a downstream human, tool, or process?
- Are required fields, file paths, citations, tests, or validation details named?
- Does the prompt require evidence for important claims: command output, file paths, test results, citations, screenshots, or explicitly marked assumptions?
- Are length or scope limits stated when needed?
- Does it tell the agent what to report when it could not complete the task?
- Does it identify the downstream judge: human, parser, CI job, reviewer, customer, regulator, or another agent?
- Does it include few-shot expected outputs when format judgment is subtle?

### Constraints

- Does it say what not to assume?
- Does it name forbidden side effects: destructive file edits, production changes, memory writes, network calls, credential use, or user-data exposure?
- Does it preserve negative scope instead of letting the agent infer it?
- Does it define what to do with uncertainty?
- Does it bound tools, browsing, local memory, external services, and cross-agent context sharing when relevant?
- Does it cover PII, credentials, customer data, financial data, legal/medical claims, and private business data when relevant?
- Does it name environment boundaries: local/dev/staging/production?
- Does it define whether the agent may send messages, commit code, push branches, deploy, charge money, issue refunds, delete records, or change permissions?
- Does it protect intentional mess: legacy names, weird workflows, compatibility hacks, business rules, or user-owned style?
- Does it block autonomous action when business ownership, approval, or exception handling is unknown?
- Does it prevent invented policy, inferred approvals, undocumented compliance interpretations, and synthetic customer promises?
- Does it prevent few-shot examples from authorizing behavior beyond their source confidence?

### Checkpoint

- Does it specify when to stop and ask?
- Does it avoid stopping for routine uncertainty the agent can resolve?
- Does it include irreversible actions, scope changes, missing user-owned information, conflicting instructions, secrets, destructive operations, and production impact?
- Does it define repair or rollback behavior after a failure?
- Does it say what to do when the user asks for something unsafe, illegal, impossible, or outside the agent's authority?
- Does it include concrete refusal, pause, or escalation cases?

## Failure Smell to Repair Move

| Smell | Likely missing section | Repair move |
| --- | --- | --- |
| Agent does extra work outside the ask | Request / Constraints | Add a single primary action and negative scope. |
| Agent asks too many questions | Checkpoint | Define allowed autonomous continuation and only real stop triggers. |
| Agent guesses missing facts | Context / Constraints | Add source-of-truth and uncertainty policy. |
| Output is hard to use | Output Format | Specify exact structure, fields, file paths, or schema. |
| Agent changes risky state without approval | Constraints / Checkpoint | Add side-effect boundaries and approval gates. |
| Prompt contains nice-sounding contradictions | Constraints | Add precedence, owner, and allowed degradation. |
| Agent cannot self-correct after failure | Checkpoint | Add failure detection, repair, and rollback conditions. |
| Subagent returns unusable prose | Output Format | Require a bounded return schema and evidence surface. |
| Agent claims success without proof | Output Format / Constraints | Require verification artifacts or explicit unverified status. |
| Agent leaks context across roles | Context / Constraints | Limit allowed context and prohibit unrelated memory or thread assumptions. |
| Agent asks low-value questions | Checkpoint / Interaction | Replace with defaults, assumptions, or specific decision-controlling questions. |
| Beginner user gives narrow happy path | Interaction / Constraints | Ask one bad-path question and add failure handling. |
| Agent has unclear write authority | Constraints / Checkpoint | Separate read-only, draft-only, write-with-approval, and autonomous-write modes. |
| Agent touches external users or money | Constraints / Checkpoint | Require explicit approval gates and audit trail. |
| Agent handles private data | Context / Constraints | Add data minimization, masking, retention, and no-training/no-memory clauses. |
| Agent over-delivers into adjacent tasks | Request / Constraints | Add anti-scope and ownership boundaries. |
| Agent simplifies intentional quirks | Constraints | Name what must not be cleaned up or normalized. |
| Agent produces plausible unsupported claims | Output Format / Verification | Require evidence class and live proof or mark unverified. |
| Output will feed another system | Output Format | Add parser/schema/consumer-specific acceptance criteria. |
| Business terms are undefined | Context / Constraints | Build a business map and require source-backed definitions. |
| User cannot explain process | Interaction / Context | Ask for artifacts, examples, status fields, and current handlers. |
| Normal flow hides exceptions | Constraints / Checkpoint | Add exception cases and escalation rules. |
| Ownership is unclear | Constraints / Checkpoint | Restrict to observe/propose mode until authority is known. |
| Business fact lacks provenance | Context / Constraints | Add fact ledger and downgrade to draft/recommendation. |
| Agent invents governance | Constraints / Checkpoint | Require policy, owner, or approval before action. |
| Official workflow misses lived exceptions | Interaction / Constraints | Ask for recent ugly examples, exception queues, and manual workarounds. |
| Action is socially irreversible | Checkpoint | Require approval even if database rollback exists. |
| KPI can be gamed | Request / Constraints | Add business-intent guardrail and anti-metric-gaming rule. |
| Few-shot overfits incidental detail | Examples / Constraints | Add "Do not learn" notes and remove private/stale details. |
| Few-shot set has only good cases | Examples / Checkpoint | Add negative, boundary, counterexample, and recovery cases. |
| Synthetic examples look authoritative | Context / Constraints | Label synthetic source and require validation before autonomy. |

## Constraint Collision Pass

Look for instructions that cannot all be true:

- "Be exhaustive" plus "keep it under 5 bullets."
- "Do not ask questions" plus "never assume missing information."
- "Use latest facts" plus "do not browse."
- "Make code changes" plus "do not touch files."
- "Preserve exact wording" plus "rewrite for clarity."

Resolve each collision with precedence:

```text
If [A] conflicts with [B], prioritize [A] because [reason]. If that makes [B] impossible, state the tradeoff in the final output.
```

## Chain-of-Custody Note

For high-stakes prompts, include a compact note:

```text
Source facts:
- User-provided:
- File-derived:
- Inferred:

Unresolved:
- 

Negative scope:
-
```

## Subagent Handoff Check

Before giving work to a secondary agent, ensure the brief states:

- What exact task it owns.
- What files, systems, or sources it may read.
- What files, systems, or state it may change, if any.
- What it must not infer from missing context.
- What output shape the parent agent can directly consume.
- When it must stop and report instead of continuing.
