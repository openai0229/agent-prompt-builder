# Question Bank for Novice Users

Use this reference when building prompts with users who do not know what boundaries matter. Ask in small rounds. Pick only questions that change the prompt contract.

## Question Format

```text
[Question in plain language]
Controls: [Context / Request / Output Format / Constraints / Checkpoint]
If I guess: [concrete failure]
Default if unanswered: [safe assumption]
```

## Round 1: Outcome

1. Who will use the agent's output, and what will they do with it next?
   Controls: Context and Output Format.
   If I guess: the output may be too verbose, too technical, or unusable in the real workflow.
   Default if unanswered: write for a human operator who needs a concise decision summary plus evidence.

2. What counts as success: a draft, a recommendation, an executed change, or a verified result?
   Controls: Request and Verification.
   If I guess: the agent may stop too early or take actions you only wanted suggested.
   Default if unanswered: produce a draft/recommendation, not an executed external change.

3. What is the single most important thing the agent must not get wrong?
   Controls: Constraints and Checkpoint.
   If I guess: the prompt may optimize for convenience while missing the real risk.
   Default if unanswered: protect user data and avoid irreversible actions.

4. What would make you say "wait, that is not what I meant" after the agent finishes?
   Controls: Request and Constraints.
   If I guess: the agent may over-deliver into work you did not want.
   Default if unanswered: keep scope narrow and report adjacent opportunities instead of acting on them.

5. What is the smallest toy version of success, and what is the messy real-world version?
   Controls: Context and Request.
   If I guess: the prompt may only handle demos or may be too broad for first use.
   Default if unanswered: build for the smallest useful workflow and mark production assumptions.

## Round 0: Business Discovery

Use this round when the user cannot clearly describe the business, workflow, or domain.

1. Can you show one real example of what comes in and one example of what a good result looks like?
   Controls: Context, Request, and Output Format.
   If I guess: the prompt may optimize for an imagined workflow instead of the real one.
   Default if unanswered: build a draft-only prompt that asks the agent to request examples before acting.

2. Who touches this process before the agent, and who touches it after the agent?
   Controls: Actors, downstream consumer, and Checkpoint.
   If I guess: the agent may skip a required reviewer, owner, customer, operator, or approver.
   Default if unanswered: assume a human operator must review before any external effect.

3. What object is actually changing: ticket, order, account, file, database row, customer message, code, money, permission, or status?
   Controls: Objects and permission ladder.
   If I guess: the agent may change the wrong artifact or underestimate side effects.
   Default if unanswered: no changes; observe and propose only.

4. What statuses, fields, labels, or handoff steps exist today?
   Controls: Workflow and source of truth.
   If I guess: the prompt may invent a process that does not match the system.
   Default if unanswered: ask the agent to inspect available artifacts or request screenshots/docs.

5. What cases currently get handled manually, escalated, or argued about?
   Controls: Exceptions and Checkpoint.
   If I guess: the agent may automate the dangerous edge cases first.
   Default if unanswered: escalate ambiguous, disputed, missing-data, money, legal, abuse, fraud, and identity cases.

6. Where would someone verify the truth if two people disagree?
   Controls: Evidence and authority.
   If I guess: the agent may trust the loudest or latest claim instead of the authoritative source.
   Default if unanswered: treat claims as unverified and require source-backed evidence.

7. Who would be harmed, surprised, billed, blocked, audited, or blamed by this output?
   Controls: stakeholders and downstream risk.
   If I guess: the prompt may ignore people affected by the agent but absent from the request.
   Default if unanswered: require human review before external or cross-team effects.

8. Who can quietly block, reinterpret, or punish this output even if they are not the requester?
   Controls: hidden authority and Checkpoint.
   If I guess: the agent may satisfy the requester but fail the real approver.
   Default if unanswered: mark hidden approval as unknown and keep publish/execute gated.

9. What are the last three ugly examples where this process failed, got rejected, or needed rework?
   Controls: exceptions and verification.
   If I guess: the agent may implement the official story and fail the real workflow.
   Default if unanswered: ask for artifacts before automating exception handling.

10. Which terms sound generic but have a special meaning here?
   Controls: business vocabulary.
   If I guess: the agent may normalize local jargon into the wrong general meaning.
   Default if unanswered: define business terms from examples or keep them quoted and unresolved.

11. Which KPI becomes harmful if the agent optimizes it literally?
   Controls: Request and Constraints.
   If I guess: the agent may improve throughput, conversion, freshness, or cost by violating real intent.
   Default if unanswered: prioritize correctness, user trust, and reviewability over metric maximization.

12. Which customer-visible action is technically reversible but socially irreversible?
   Controls: Checkpoint.
   If I guess: the agent may rely on rollback while causing trust, obligation, or escalation damage.
   Default if unanswered: gate all customer-visible actions.

13. Are there freeze windows or legal holds: quarter-close, launch freeze, incident freeze, audit, contract review, or litigation?
   Controls: temporal boundaries.
   If I guess: correct routine cleanup may happen at the wrong business moment.
   Default if unanswered: ask before cleanup, reconciliation, publish, or state-changing work.

## Round 1.5: Evidence

1. Which facts may the agent trust: your description, inspected files, runtime output, memory, external sources, or its own inference?
   Controls: Context and verification.
   If I guess: guesses, stale memory, screenshots, and live evidence may be treated as equal.
   Default if unanswered: prioritize inspected artifacts and runtime observations; mark inference as unverified.

2. What evidence is allowed to overrule your first description?
   Controls: Context and Checkpoint.
   If I guess: the agent may either obey stale framing or contradict you without explanation.
   Default if unanswered: inspected artifacts can refine diagnosis, but scope and authority still come from the user.

3. When the agent seems to know the answer but lacks proof, what should it do?
   Controls: Verification and Checkpoint.
   If I guess: it may produce polished false confidence.
   Default if unanswered: label the claim unverified and state what evidence would prove it.

## Round 1.7: Few-Shot Calibration

Use this round after the business map has enough shape to discuss examples.

1. Can you provide 2-3 real examples where the agent should act normally?
   Controls: positive examples and Output Format.
   If I guess: the agent may learn an imagined happy path.
   Default if unanswered: synthesize examples and label them as unvalidated.

2. Can you provide examples where the agent must not act, even if it looks helpful?
   Controls: negative examples and Checkpoint.
   If I guess: the agent may over-help into unauthorized work.
   Default if unanswered: create negative examples for money, production, customer-visible, legal, privacy, and destructive actions.

3. What is a borderline case where a human should decide?
   Controls: boundary examples and escalation.
   If I guess: the prompt may turn ambiguous business judgment into automation.
   Default if unanswered: use missing identity, conflicting records, VIP/customer complaint, disputed ownership, and stale data as boundary examples.

4. What two cases look similar but should lead to different outcomes?
   Controls: counterexamples.
   If I guess: the agent may classify by surface similarity instead of the real rule.
   Default if unanswered: ask the agent to mark similar-looking cases as uncertain until source-backed criteria exist.

5. What should the agent do when verification fails or a required artifact is missing?
   Controls: recovery example.
   If I guess: the agent may hide failure or invent a result.
   Default if unanswered: report missing evidence, attempt one bounded repair, then stop with next required input.

6. What should the agent not learn from these examples?
   Controls: anti-overfit.
   If I guess: the agent may copy names, numbers, formatting quirks, or temporary policy as permanent rules.
   Default if unanswered: learn only the decision rule, not specific names, values, or incidental wording.

7. Which examples involve high-risk labels: money, customer, private data, production, deletion, policy, legal, boss/reviewer, or external message?
   Controls: manifest and checkpoint trigger.
   If I guess: risky examples may train normal behavior instead of pause/escalation behavior.
   Default if unanswered: tag those examples as escalation-required.

8. Which example is an exception, not the normal rule?
   Controls: exception-to-default prevention.
   If I guess: a rare override may become the default operating path.
   Default if unanswered: label overrides as edge cases and require explicit evidence before applying them.

9. Which final prompt clause does each example teach?
   Controls: example-to-clause trace.
   If I guess: examples may smuggle in behavior the prompt never authorized.
   Default if unanswered: exclude examples that cannot map to Context, Request, Output Format, Constraints, or Checkpoint.

## Round 2: Authority

1. Who can authorize, override, revoke, and audit each class of agent action?
   Controls: authority ledger.
   If I guess: the prompt may give control to the wrong person or nobody.
   Default if unanswered: only the current user can authorize; all external or irreversible actions need explicit approval.

2. What may the agent read: local files, databases, browser pages, user messages, private docs, or external APIs?
   Controls: Context and Constraints.
   If I guess: the agent may use an untrusted or unauthorized source.
   Default if unanswered: only use materials explicitly provided in the task.

3. What may the agent change without approval?
   Controls: Constraints and Checkpoint.
   If I guess: the agent may edit, send, delete, deploy, refund, or update records beyond its authority.
   Default if unanswered: read and draft only; require approval before external side effects.

4. Can the agent remember anything for future runs?
   Controls: memory boundaries.
   If I guess: private or temporary data may be retained when it should not be.
   Default if unanswered: do not write memory; use only the current task context.

5. Which permission rung is autonomous: observe, propose, edit locally, execute, or publish?
   Controls: Constraints and Checkpoint.
   If I guess: investigation may turn into mutation or publication.
   Default if unanswered: observe and propose only.

## Round 3: Data and Privacy

1. Could the agent see personal, customer, financial, health, legal, credential, or confidential business data?
   Controls: Constraints.
   If I guess: the prompt may omit masking, minimization, and approval rules.
   Default if unanswered: treat input as potentially sensitive and avoid exposing raw data.

2. Should the agent quote raw source data, summarize it, or redact it?
   Controls: Output Format and Constraints.
   If I guess: the output may leak information or lose necessary evidence.
   Default if unanswered: summarize and include only minimal evidence snippets.

3. Is any data allowed to leave the local environment or current tool?
   Controls: tool and network boundaries.
   If I guess: the agent may paste private data into external services.
   Default if unanswered: keep data local and do not send it to external services.

## Round 4: Tools and Environment

1. Which environment is safe to touch: local, dev, staging, or production?
   Controls: Context, Constraints, and Checkpoint.
   If I guess: the agent may change production state while thinking it is in a sandbox.
   Default if unanswered: local/read-only only.

2. Which tools are allowed: shell, browser, database, API clients, issue trackers, email, chat, deploy tools?
   Controls: tool permissions.
   If I guess: the agent may use a tool that is unavailable, unsafe, or unauthorized.
   Default if unanswered: use only local inspection tools and ask before external systems.

3. Are there cost, rate limit, time, token, or compute limits?
   Controls: Constraints.
   If I guess: the agent may run expensive or slow operations.
   Default if unanswered: prefer low-cost inspection and ask before expensive operations.

4. Which adjacent systems, people, or workflows might be touched one or two steps away from the main task?
   Controls: blast radius.
   If I guess: the prompt may miss downstream side effects.
   Default if unanswered: do not touch adjacent systems; only report them as risks.

5. What should the agent refuse to clean up, simplify, rename, overwrite, skip, fetch, remember, or generalize?
   Controls: negative scope.
   If I guess: it may erase intentional business rules or compatibility quirks.
   Default if unanswered: preserve existing names, formats, workflows, and user-owned style unless explicitly asked.

## Round 5: Failure and Recovery

1. What is the blast radius if the agent is confidently wrong?
   Controls: Constraints and Checkpoint.
   If I guess: the prompt may protect the wrong thing and miss production, data, reputation, or workflow damage.
   Default if unanswered: no irreversible changes, no external messages, no data loss.

2. What is the 3am page you never want to receive because of this agent?
   Controls: Failure and Checkpoint.
   If I guess: the prompt may omit the real incident boundary.
   Default if unanswered: prevent production impact, private-data exposure, and user-visible actions without approval.

3. If the agent gets conflicting instructions, which source wins?
   Controls: precedence.
   If I guess: the agent may silently choose the wrong authority.
   Default if unanswered: system/developer instructions, then explicit user instruction, then repository/docs, then inferred intent.

4. If the task cannot be completed, what should the agent return?
   Controls: Output Format and Checkpoint.
   If I guess: the agent may hide failure or produce a misleading partial result.
   Default if unanswered: report blocker, attempted steps, evidence, and next required input.

5. Name cases where the agent must decline, pause, or escalate before doing any work.
   Controls: refusal rehearsal.
   If I guess: refusal becomes an afterthought instead of part of the contract.
   Default if unanswered: pause for illegal/unsafe requests, secrets, production impact, external messages, money, data deletion, and authority conflicts.

## Round 6: Verification

1. What downstream person, tool, automation, customer, reviewer, regulator, or agent will act on this output next?
   Controls: Output Format.
   If I guess: the format may look fine to you but fail the actual consumer.
   Default if unanswered: optimize for a human reviewer and include machine-readable structure only when requested.

2. What evidence should prove the work is done: tests, command output, screenshots, citations, logs, metrics, or reviewer approval?
   Controls: Output Format and Verification.
   If I guess: the agent may claim success without acceptable proof.
   Default if unanswered: include concrete artifacts such as file paths, commands, test output, or explicit unverified status.

3. Who reviews the agent's work before it affects users or production?
   Controls: Checkpoint.
   If I guess: the agent may bypass human review.
   Default if unanswered: require human approval before user-visible or production changes.

4. What should the agent do after verification fails?
   Controls: Checkpoint and repair behavior.
   If I guess: the agent may loop, over-edit, or stop without useful context.
   Default if unanswered: attempt one bounded repair, then report failure with evidence and next options.

## Round 7: Multi-Agent and Handoff

1. What should a subagent know, and what should it not know?
   Controls: Context and cross-agent boundaries.
   If I guess: the subagent may receive too much private context or too little to work.
   Default if unanswered: give only task-local context and source files required for the subtask.

2. May subagents edit files or only return analysis?
   Controls: Constraints.
   If I guess: parallel agents may create conflicting or unwanted changes.
   Default if unanswered: analysis-only unless an explicit write scope is assigned.

3. What format must subagents return so the parent agent can integrate results?
   Controls: Output Format.
   If I guess: results may be too vague to merge.
   Default if unanswered: findings, evidence, changed paths if any, risks, and recommended next step.

## Edge Cases to Probe

- User says "just make it work" but the task can mutate files, send messages, deploy, spend money, or change customer state.
- User gives only the happy path and no failure handling.
- User wants full autonomy but also no risk.
- User asks for latest facts but forbids browsing.
- User wants exactness but provides screenshots or incomplete OCR.
- User asks for code changes in a dirty worktree.
- User wants a reusable agent prompt but gives one-off examples only.
- User asks for "learning" or memory but includes private data.
- User wants subagents but does not define ownership or write scopes.
- User wants output for both humans and machines but gives one format.
- User says "do not ask" but omits destructive-action permissions.
- User asks for production work without environment, rollback, or approval rules.
- User says the agent should "clean up" without saying what legacy quirks are intentional.
- User asks for autonomy but cannot identify who audits the agent.
- User asks for a human-readable response but another tool or agent will consume it.
- User's initial description conflicts with inspected evidence.
- User asks the agent to remember preferences while handling sensitive or temporary data.
