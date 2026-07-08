# Agent Prompt Builder Examples

## Example 1: Code Agent

Rough ask:

```text
Fix the login redirect bug.
```

Agent-ready prompt:

```text
Context:
You are working in the current repository. Users sometimes land on the wrong page after successful login. The goal is to find and fix the real redirect-chain bug without changing unrelated auth behavior.

Request:
Trace the login-success redirect path, identify the root cause, implement the smallest correct fix, and verify it.

Output Format:
Return a concise summary with:
1. Root cause.
2. Files changed.
3. Key logic change.
4. Verification commands and results.

Constraints:
Do not rewrite the auth module broadly.
Do not change public APIs unless the existing API is the root cause.
Do not delete or revert user-owned local changes.
If backend configuration or unavailable services are required, state the dependency and continue with code-level verification where possible.

Checkpoint:
Stop before database migrations, destructive git operations, production changes, secret handling, or public API changes. Otherwise continue through implementation and verification before reporting.
```

## Example 2: Product Agent

Rough ask:

```text
Help design the collaboration feature.
```

Agent-ready prompt:

```text
Context:
We are designing an MVP database collaboration feature for small engineering and data teams. Users include developers, analysts, and team leads. The goal is safer sharing of queries, SQL review, and reusable analysis views.

Request:
Design the MVP product proposal.

Output Format:
Return:
1. One-sentence positioning.
2. Target users and core scenarios.
3. MVP feature list.
4. Explicit non-goals.
5. Key screens and workflow.
6. Risks and validation plan.

Constraints:
Do not write marketing copy.
Do not design a broad platform.
Optimize for a version that can ship in 4 weeks.
Separate personal usage, team sharing, and admin approval permissions.
Do not hand-wave security or permission behavior as future work.

Checkpoint:
If org structure, current permission model, or deadline is unknown, mark assumptions and continue. Stop only if a decision would require changing existing product commitments.
```

## Example 3: Prompt Autopsy

Failed behavior:

```text
The agent kept asking whether it should proceed after every small discovery.
```

Diagnosis:

```text
Weak section: Checkpoint.
The prompt said "ask me if anything is unclear" but never separated routine ambiguity from real approval boundaries.
```

Repair snippet:

```text
Checkpoint:
Do not stop for routine implementation choices that can be resolved from local code, tests, or documentation. Stop only for destructive operations, scope changes, missing user-owned business decisions, production impact, secrets, or conflicting instructions. Otherwise make a reasonable assumption, record it, complete the task, and report the assumption at the end.
```

## Example 4: Skill Prompt

Rough ask:

```text
Make this folder of prompt screenshots into a skill for future agent prompt design.
```

Agent-ready prompt:

```text
Context:
The source folder contains screenshots describing an Agent-era Prompt structure: Context, Request, Output Format, Constraints, and Checkpoint. The goal is to create a reusable Codex skill that future agents can use when designing, repairing, or evaluating agent-system prompts.

Request:
Create a Codex skill named agent-prompt-builder that turns rough agent behavior requests into robust runtime-contract prompts and can diagnose failed prompts.

Output Format:
Create:
1. SKILL.md with concise workflow instructions and trigger description.
2. references/checklist.md for audit and repair checks.
3. references/examples.md with reusable examples.
Then validate the skill structure and report created paths.

Constraints:
Do not create a README inside the skill.
Do not turn the screenshots into long prose.
Preserve the five-section structure as the central workflow.
Include Checkpoint behavior as stop/repair/rollback gates, not progress updates.
Label missing screenshot pages or OCR uncertainty if relying on image-derived content.

Checkpoint:
Stop before overwriting an existing skill with the same name or deleting existing user files. Otherwise create the skill and validate it.
```

## Example 5: Subagent Handoff Brief

Rough ask:

```text
Ask another agent to review this prompt.
```

Agent-ready prompt:

```text
Context:
You are a secondary review agent. Your only source material is the prompt text included below. Do not assume hidden product goals, repository state, or prior conversation context.

Request:
Audit the prompt as an agent runtime contract and identify weaknesses in Context, Request, Output Format, Constraints, and Checkpoint.

Output Format:
Return:
1. Top 5 issues, ordered by severity.
2. For each issue: weak section, failure mode, and exact repair snippet.
3. A final verdict: usable, usable with edits, or not usable.

Constraints:
Do not rewrite the entire prompt unless a repair snippet requires it.
Do not introduce new product requirements.
Do not claim a risk exists unless it follows from the provided prompt text.
Mark uncertainty explicitly when the source prompt does not provide enough information.

Checkpoint:
If the prompt requires external files, private context, or domain facts not provided here, report the missing source and stop. Otherwise complete the audit.
```

## Example 6: Interactive Question Pack

Rough ask:

```text
帮我设计一个能自动处理客户工单的 agent prompt。
```

Question pack:

```text
I need these answers before the prompt can be reliable:

1. Which system is the source of truth for tickets and customer identity?
   Controls: Context and tool permissions.
   If I guess: the agent may read or update the wrong customer record.
   Default if unanswered: treat the ticket text provided by the user as the only source of truth and forbid external updates.

2. What actions may the agent perform without human approval?
   Controls: Constraints and Checkpoint.
   If I guess: the agent may refund, close, escalate, or message customers beyond its authority.
   Default if unanswered: allow drafting replies only; require approval before sending messages, closing tickets, refunds, credits, or account changes.

3. What must the final output look like for an operator?
   Controls: Output Format and verification.
   If I guess: the result may be hard to review or paste into the support workflow.
   Default if unanswered: output a short summary, recommended action, drafted customer reply, confidence level, and escalation reason.
```

## Example 7: Guided Interview Round

Rough ask:

```text
我想要一个 agent 自动帮我处理数据库问题。
```

## Example 7.5: Business Discovery First

Rough ask:

```text
我想让 agent 自动判断哪些客户应该跟进，但我也不太确定我们现在销售是怎么判定的。
```

Good response:

```text
Current mode: Business discovery

Current business map:
- Actors: sales / customer / maybe manager. Unknown: who approves follow-up priority.
- Objects: customer or lead. Unknown: source system and fields.
- Workflow: unknown.
- Rules: unknown.
- Exceptions: unknown.
- Evidence: unknown.
- Authority: unknown.

I need these before writing an autonomous prompt:

1. Can you show one real customer/lead record and one example of a "should follow up" result?
   Controls: business object, source fields, and output format.
   If I guess: the agent may invent a scoring rule that does not match sales reality.
   Default if unanswered: the agent may only draft a proposed rubric, not classify real customers.

2. Where is the source of truth: CRM, spreadsheet, database, chat notes, email, or something else?
   Controls: evidence and tool permissions.
   If I guess: the agent may use stale or unofficial information.
   Default if unanswered: use only user-provided examples and mark all classifications as unverified.

3. What cases should always be escalated to a human?
   Controls: exceptions and Checkpoint.
   If I guess: the agent may mishandle VIP customers, churn risk, refunds, complaints, legal issues, or duplicate accounts.
   Default if unanswered: escalate VIP, complaint, refund, legal, duplicate, missing-contact, and high-value cases.

Temporary safety rule:
Until the business map is validated, the agent should observe and propose only. It should not update CRM, contact customers, assign owners, or change lead status.
```

## Example 7.6: Business Fact Ledger

```text
Business fact ledger:

Fact: A lead is "high priority" when contract value is above 50k and last activity is within 14 days.
Evidence class: expert memory
Source: sales lead's description in this chat
Owner: unknown
Timestamp or freshness: unknown
Confidence: medium-low
Can authorize action? no

Prompt consequence:
The agent may use this as a draft scoring hypothesis, but must not update CRM priority, assign sales owners, or message customers until confirmed by CRM fields, policy, or an accountable owner.
```

## Example 7.7: Unknown Business Rule Safety Clause

```text
Constraints:
Do not invent business policy, compliance interpretation, customer promises, approvals, eligibility rules, or escalation rules.
If a business rule is not backed by policy, system record, workflow artifact, or an accountable owner, treat it as an assumption.
Assumptions may support drafts and recommendations only; they may not authorize external messages, state changes, billing actions, refunds, account changes, or customer commitments.
```

## Example 7.8: Few-Shot Calibration Set

```text
Few-shot calibration:

Positive example
Manifest: domain=support billing; risk class=customer/private; authority rung=propose; evidence source=CRM identity match; checkpoint trigger=operator review before send.
Input: Customer asks for invoice resend and identity matches the billing contact in the CRM.
Expected behavior: Draft a concise reply and mark it safe to send after operator review.
Expected output shape: summary, drafted reply, evidence used, approval needed.
Why: Low-risk request, identity matched, no money movement.
Do not learn: Do not assume all billing requests are low-risk.
Source: synthetic
Confidence: needs validation
Maps to clauses: Context source of truth, Output Format approval field, Checkpoint review before send.

Negative example
Manifest: domain=support billing; risk class=money/customer; authority rung=publish/execute forbidden; evidence source=missing order evidence; checkpoint trigger=refund or promise.
Input: Customer asks for a refund and the ticket has no order ID.
Expected behavior: Do not promise refund or update billing. Ask for missing order evidence and escalate if refund policy is unclear.
Expected output shape: blocker, missing evidence, draft clarification, escalation reason.
Why: Money movement and missing identity/order evidence.
Do not learn: Do not refuse all refund-related tickets; refuse autonomous refund action.
Source: synthetic
Confidence: needs validation
Maps to clauses: Constraints no money movement, Checkpoint escalate refund, Output Format blocker.

Boundary example
Manifest: domain=support billing; risk class=VIP/money/conflicting sources; authority rung=propose only; evidence source=CRM and payment system conflict; checkpoint trigger=source conflict.
Input: VIP customer reports duplicate charges, CRM and payment system disagree.
Expected behavior: Mark as high-risk, collect evidence, escalate to billing owner, do not send final customer promise.
Expected output shape: risk summary, conflicting sources, next evidence, escalation path.
Why: VIP, money, contradictory systems, customer-visible trust risk.
Do not learn: Do not treat all VIP tickets as unhandleable; escalate when authority or evidence conflicts.
Source: synthetic
Confidence: needs validation
Maps to clauses: Evidence precedence, Constraints no customer promises, Checkpoint source conflict.

Recovery example
Manifest: domain=support billing; risk class=verification failure; authority rung=propose only; evidence source=unavailable API; checkpoint trigger=tool unavailable.
Input: Payment API is unavailable during verification.
Expected behavior: Stop before conclusion, report unavailable tool, provide draft-only response and required verification step.
Expected output shape: unverified status, attempted check, fallback draft, next required input.
Why: Verification failed; confident answer would be unsafe.
Do not learn: Do not retry indefinitely or invent payment status.
Source: synthetic
Confidence: needs validation
Maps to clauses: Output Format unverified status, Checkpoint failed verification.
```

Compressed prompt clause:

```text
Use the examples as behavior anchors only. Learn the decision boundaries, not names, amounts, temporary policies, or incidental phrasing. If a case resembles a negative or boundary example, prefer draft-only output, explicit uncertainty, and escalation over autonomous action.
```

Example-to-clause trace:

```text
Example: Refund request without order ID
Teaches: money movement requires evidence and approval
Final prompt clause: Constraints forbid autonomous refunds; Checkpoint escalates missing order evidence
Acceptance stamp: needs validation
Reason: synthetic example based on common support risk, not confirmed business policy
```

## Example 7.9: Incident Few-Shot Contrast

```text
Positive example
Manifest: domain=incident ops; risk class=internal cleanup; authority rung=propose/edit notes only; evidence source=incident timeline; checkpoint trigger=none if notes only.
Input: "Clean up the incident notes."
Expected behavior: Dedupe notes, group evidence, propose owners, preserve failure and recovery evidence.
Do not learn: Do not close incident tickets, silence alerts, change thresholds, or update status pages.

Negative example
Manifest: domain=incident ops; risk class=production/customer-visible; authority rung=publish/execute forbidden; evidence source=vague user request; checkpoint trigger=external notification or alert changes.
Input: "Make this incident quiet."
Expected behavior: Group noisy alerts and recommend suppression candidates, but do not change alert thresholds or close pages.
Do not learn: Do not treat fatigue language as permission to weaken detection.

Boundary example
Manifest: domain=incident ops; risk class=stale runbook/conflicting live state; authority rung=observe/propose; evidence source=runbook plus live status conflict; checkpoint trigger=source contradiction.
Input: Runbook says restart service A, but live dashboard shows service B owns the failing dependency.
Expected behavior: Freeze mutation, produce contradiction packet, identify evidence needed and likely owners.
Do not learn: Do not blindly follow runbook or mutate either service before ownership is established.
```

## Example 8: Permission Ladder Clause

```text
Permission ladder:
- Observe: autonomous. The agent may inspect provided files, local logs, and read-only command output.
- Propose: autonomous. The agent may draft SQL, commands, code diffs, customer replies, and rollback plans.
- Edit locally: requires explicit instruction unless the task is clearly a local code-edit request.
- Execute: requires approval for database writes, migrations, service restarts, API calls, or expensive operations.
- Publish: always requires approval for external messages, deploys, pushes, ticket closure, refunds, account changes, or customer-visible actions.
```

## Example 9: Final Receipt

```text
Contract receipt:
- Assumptions used: production is out of scope; user wants draft-only customer replies.
- Permission gates crossed: observe and propose only.
- Evidence required: ticket text, customer account status, relevant policy snippet.
- Refusal/escalation cases: refund request, legal threat, abusive content, missing identity match, account deletion.
- Unresolved authority gaps: who may approve sending the final customer message.
```

Good response:

```text
Current round: Authority and environment

What we already know:
- You want an agent for database troubleshooting.
- The dangerous part is that database work can read private data, change records, run expensive queries, or affect production.

1. Which environments may the agent touch: local, dev, staging, or production?
   Controls: Context, Constraints, and Checkpoint.
   If I guess: the agent may run queries against production when you only wanted diagnosis.
   Default if unanswered: local/dev read-only only; production requires explicit approval.

2. What may it do without approval: inspect schema, run SELECT queries, modify data, create indexes, restart services, or only draft commands?
   Controls: Request and tool authority.
   If I guess: it may perform irreversible or expensive operations.
   Default if unanswered: inspect schema and draft SQL only; no writes, restarts, migrations, or index changes.

3. What proof should it return when it says the issue is fixed or diagnosed?
   Controls: Output Format and verification.
   If I guess: it may claim success without enough evidence.
   Default if unanswered: include query text, sanitized output summary, affected tables, risk level, and recommended next action.
```
