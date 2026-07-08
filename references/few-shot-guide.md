# Few-Shot Construction Guide

Use this guide when the user does not know how to write few-shot examples. Few-shot examples are demonstrations inside the prompt: they teach the model by showing input -> desired behavior -> desired output. They are not fine-tuning and they do not replace clear instructions.

## When to Use Few-Shot

Start with clear zero-shot instructions first. Add few-shot examples when the model must learn one of these:

- exact output shape or field naming
- tone, style, length, or structure
- business classification or routing
- judgment calls with fuzzy boundaries
- refusal, escalation, or pause behavior
- tool-use boundaries and recovery from failed verification
- distinctions between similar-looking cases

Do not add examples only to make the prompt look richer. Each example must change behavior.

## Beginner Workflow

When the user cannot write examples, do not ask "give me few-shots." Guide them through sorting tiny cases:

```text
Please sort these cases into three piles:
- YES: the agent may handle this normally.
- ASK FIRST: the agent should pause, ask, or escalate.
- NEVER: the agent must refuse or only draft.
```

Then convert each sorted case into a structured example.

Ask for:

1. A normal case that should succeed.
2. A tempting case that must not be acted on.
3. A messy or incomplete case where the agent should ask.
4. Two similar-looking cases that should produce different outcomes.
5. A case where verification fails or evidence is missing.

If the user has no examples, synthesize examples and label them `synthetic; needs validation`.

## Five-Minute Interview Script

When the user is a beginner, run this script before asking for formal examples:

1. "Tell me one ordinary request where the agent should help without drama."
2. "Tell me one request that sounds reasonable but the agent must not execute."
3. "Tell me one messy case where a careful human would ask a follow-up."
4. "Tell me two cases that look almost the same, but one is allowed and one is not."
5. "Tell me where the truth would come from: a file, database, ticket, customer message, policy, manager, legal rule, or nobody yet."
6. "Tell me what the agent must not copy from this example: names, amounts, tone, temporary policy, private data, formatting, or exception."

If the user cannot answer, propose tiny candidate cases and ask them to sort into `YES`, `ASK FIRST`, and `NEVER`. Treat the user's sorting as business discovery, not just prompt writing.

## Good Example Shape

Use a consistent block format. XML-like, YAML-style, or clear bullets are all acceptable as long as every example has the same fields.

```text
<example>
type: positive | negative | boundary | counterexample | recovery
manifest:
  domain:
  risk_class:
  authority_rung:
  evidence_source:
  checkpoint_trigger:
input:
expected_behavior:
expected_output:
why:
do_not_learn:
source: real | synthetic | inferred
confidence:
maps_to_clauses:
</example>
```

For simple format-only prompting, a lighter input/output pair is enough:

```text
<example>
input:
output:
</example>
```

For agent prompts, use the full shape because examples can accidentally grant authority.

## Example Intake and Quarantine

Before accepting an example into the prompt, classify it:

```text
example_status: accepted | needs_redaction | needs_owner | stale | synthetic | rejected
owner:
last_verified:
expiry_trigger:
privacy_status:
authority_source:
behavior_it_teaches:
```

Rules:

- Real examples are preferred, but only after private data is removed.
- Synthetic examples may teach drafts and discussion, but must not authorize autonomous execution until validated.
- Stale examples can be recycled for structure, not policy.
- Examples with hidden owners, unclear authority, private data, or conflicting rules go into quarantine.
- Quarantined examples become questions for the user; do not silently smooth them into the final prompt.

## Selection Rules

Prefer examples that are:

- **Relevant**: close to the real workflow, not generic demos.
- **Diverse**: cover happy path, edge cases, and failure cases.
- **Specific**: include concrete input and expected output.
- **Balanced**: avoid a majority of one label or one outcome.
- **Source-backed**: real artifacts beat memory; memory beats guesses.
- **Short**: small enough to fit and update.
- **Consistent**: same delimiter and field format across examples.

Default to 3-5 examples for one behavior cluster. For complex agent behavior, use several small clusters rather than one long mixed example list.

## Safety Requirements for Agent Prompts

Every few-shot set for an agent must include:

- at least one positive example
- at least one negative example
- at least one boundary or escalation example
- at least one recovery example if tools or verification are involved
- a `do_not_learn` note for each example
- a source/confidence label
- an example-to-clause trace

Never let an example authorize behavior that the prompt contract does not authorize.

## Example-to-Clause Trace

After selecting examples, map each one to the final prompt:

```text
example:
teaches:
final_prompt_clause:
accepted: yes | no | needs validation
reason:
```

Reject examples that cannot map to Context, Request, Output Format, Constraints, or Checkpoint.

## Ordering and Bias Checks

Few-shot prompts can be sensitive to example choice, order, label names, and class balance.

Use these defenses:

- Do not put all examples of one class at the end.
- Do not include many more examples of one label than another unless that imbalance is intentional.
- Avoid label names that carry unintended bias or everyday meaning.
- Test at least one alternate order for high-stakes classifiers.
- Keep the final live input clearly separated from the examples.
- Do not add more examples just because performance is unstable; too many can overfit.

## Near-Twin and Mutation Checks

For any risky positive example, add a near-twin counterexample that differs by one load-bearing fact:

```text
allowed_case:
blocked_case:
only_difference:
expected_behavior_difference:
prompt_clause_that_explains_difference:
```

Then mutate the accepted examples:

- Swap requester authority.
- Swap evidence source.
- Change freshness from current to stale.
- Change environment from staging to production.
- Remove one required artifact.
- Make the output parser stricter.
- Change a reversible internal action into an external promise.

If the expected behavior should change, the prompt needs a clause explaining why. If the behavior should not change, add `do_not_learn` text so the model ignores the mutated surface detail.

Use formatting decoys when output shape matters: show the same decision in two valid output shapes, and two different decisions in the same output shape. This prevents the model from mistaking layout for business logic.

## Evaluation Loop

Few-shot construction is not done until it survives checks.

1. Run the prompt against the examples.
2. Run at least one held-out example that was not included in the prompt.
3. Grade with rubrics or target responses.
4. Convert failed outputs into negative, boundary, or recovery examples.
5. Re-run after every meaningful prompt change.

Rubric format:

```text
example:
rubrics:
- output follows required schema
- cites source evidence
- does not take unauthorized action
- escalates missing authority
passed:
- true
- true
- false
- true
repair:
```

## Common Mistakes

- Only showing success examples.
- Using fake examples without labeling them synthetic.
- Letting examples include private or stale data.
- Teaching incidental names, dollar values, wording, or formatting quirks.
- Using one exception as if it were the normal rule.
- Mixing too many behaviors in one example.
- Explaining rules in prose but giving examples that contradict them.
- Using decisive tone as if it were approval.
- Forgetting a recovery example for missing tools or failed verification.

## Compressed Prompt Clause

When embedding examples in the final prompt, keep them compact:

```text
Use the examples as behavior anchors. Learn the decision boundaries and output shape, not incidental names, numbers, temporary policies, or wording. If a live case resembles a negative, boundary, or recovery example, prefer draft-only output, explicit uncertainty, and escalation over autonomous action.
```

## Placement in the Prompt

Keep examples in a dedicated `Examples` section, separate from live input and tool output.

For agent systems:

- Put role, autonomy, and safety boundaries in the main instruction contract.
- Put examples in concise YAML-style, XML-like, or bullet blocks.
- Keep live user input after the examples and label it clearly.
- Do not rely on examples to grant permissions; permissions must live in Constraints or Checkpoint.
- Version examples like code and re-run evals whenever they change.

## Source-Backed Notes

- OpenAI recommends starting with zero-shot, then adding a couple of examples when needed, and using examples to articulate desired output format.
- OpenAI prompt management guidance recommends keeping few-shot examples concise in YAML-style or bulleted blocks and re-running evals after changes.
- Anthropic recommends examples that are relevant, diverse, and structured; it suggests 3-5 examples and using tags to distinguish examples from instructions.
- Google Gemini guidance says few-shot examples should accompany clear instructions, use consistent formatting and XML-like markup, and be tuned for count because too few may not change behavior and too many may overfit.
- Google few-shot optimization guidance uses prompt, model response, rubrics/evaluations, or target responses as optimization inputs.
- Few-shot research shows example selection and ordering can strongly affect results; majority-label, recency, and common-token biases are real risks.

Sources consulted:

- OpenAI Help: https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api
- OpenAI API prompting guide: https://developers.openai.com/api/docs/guides/prompting
- Anthropic prompting best practices: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- Google Gemini few-shot examples: https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/prompts/few-shot-examples
- Brown et al., "Language Models are Few-Shot Learners": https://arxiv.org/abs/2005.14165
- Zhao et al., "Calibrate Before Use": https://arxiv.org/abs/2102.09690
