# Agent Prompt Builder

`agent-prompt-builder` is a Codex skill for building reliable prompts for autonomous agent systems. It treats an agent prompt as a runtime contract, not as a loose instruction blob.

The skill guides the user through five required sections:

- `Context`: business background, actors, objects, state, source of truth, and why the work matters
- `Request`: what the agent must do, when it should act, and what success means
- `Output Format`: exact deliverable shape, fields, schemas, and reporting style
- `Constraints`: permissions, forbidden assumptions, tool boundaries, data boundaries, and quality bar
- `Checkpoint`: when the agent must pause, ask, escalate, repair, or stop

## What It Solves

Most users do not know how to write agent prompts. They often describe only the happy path, miss permission boundaries, forget failure cases, and confuse "the agent sounds confident" with "the agent is allowed to act."

This skill forces the missing parts into the conversation:

- business discovery before prompt writing
- high-quality questions at every stage
- permission ladder for autonomous actions
- evidence and source-of-truth mapping
- boundary, refusal, escalation, and recovery behavior
- few-shot examples that teach judgment without granting unsafe authority
- final linting before the prompt is accepted

## Why It Matters

Agent prompts are operational specs. A weak prompt can make an agent mutate state, contact customers, leak private data, follow stale rules, or silently invent business logic.

This skill makes the prompt auditable. Every behavior should trace back to a clause, example, permission rung, or checkpoint. If the user does not know the business well, the skill downgrades autonomy and turns unknowns into explicit questions.

## How To Learn It

Start with the main flow in `SKILL.md`:

1. Build the business map: actors, objects, workflow, rules, exceptions, evidence, authority.
2. Build the few-shot calibration set: positive, negative, boundary, counterexample, and recovery cases.
3. Draft the five-part prompt contract.
4. Run the checklist and repair weak assumptions.
5. Produce a final prompt plus a receipt explaining what changed and what still needs validation.

Use the references when needed:

- `references/question-bank.md`: question packs for beginner users and unclear business domains
- `references/few-shot-guide.md`: how to teach users to build useful few-shot examples
- `references/checklist.md`: audit checklist for finished or failed prompts
- `references/examples.md`: reusable examples and patterns

## Few-Shot Guidance

Few-shot examples should not be decorative. They should teach a behavior boundary.

A useful set usually includes:

- a normal case the agent may handle
- a tempting case the agent must not execute
- an ambiguous case where the agent asks or escalates
- a near-twin counterexample that looks similar but requires a different decision
- a recovery case for missing evidence, failed tools, or stale context

Each agent-grade example should include:

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

If the user cannot write examples, do not ask for "few-shot examples." Ask them to sort tiny cases into:

- `YES`: the agent may handle this normally
- `ASK FIRST`: the agent should pause, ask, or escalate
- `NEVER`: the agent must refuse or only draft

Then convert the sorted cases into structured examples.

## Example Invocation

```text
Use $agent-prompt-builder to build a prompt for an agent that reviews refund requests and drafts customer replies.
The user is not sure which refund cases are safe to approve automatically.
```

Expected skill behavior:

- ask who can approve refunds and what systems are source of truth
- separate draft-only replies from irreversible refund actions
- ask for normal, refused, borderline, and recovery examples
- require evidence for policy, transaction state, and customer identity
- produce a prompt with explicit permission and checkpoint rules

## Example Output Skeleton

```text
Context:
[Business domain, actors, systems, source of truth, authority owners.]

Request:
[Agent task, success definition, workflow, and decision boundaries.]

Output Format:
[Required fields, schemas, tone, and delivery format.]

Constraints:
[Forbidden actions, tool limits, privacy rules, autonomy level, uncertainty policy.]

Checkpoint:
[When to ask, escalate, stop, repair, or return draft-only output.]
```

## Research Basis

The few-shot guidance was informed by current public prompting guidance and few-shot research:

- OpenAI prompt engineering best practices: https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api
- OpenAI API prompting guide: https://developers.openai.com/api/docs/guides/prompting
- Anthropic multishot prompting: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting
- Google Gemini few-shot examples: https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/few-shot-examples
- Brown et al., "Language Models are Few-Shot Learners": https://arxiv.org/abs/2005.14165
- Zhao et al., "Calibrate Before Use": https://arxiv.org/abs/2102.09690

## Install From GitHub

Fastest install:

```bash
mkdir -p "${CODEX_SKILLS_DIR:-$HOME/.agents/skills}"
rm -rf "${CODEX_SKILLS_DIR:-$HOME/.agents/skills}/agent-prompt-builder"
git clone https://github.com/openai0229/agent-prompt-builder.git \
  "${CODEX_SKILLS_DIR:-$HOME/.agents/skills}/agent-prompt-builder"
```

Then invoke it in Codex with:

```text
$agent-prompt-builder
```

Update:

```bash
git -C "${CODEX_SKILLS_DIR:-$HOME/.agents/skills}/agent-prompt-builder" pull --ff-only
```

Uninstall:

```bash
rm -rf "${CODEX_SKILLS_DIR:-$HOME/.agents/skills}/agent-prompt-builder"
```

If your Codex installation still uses the legacy `$CODEX_HOME/skills` location, install there instead:

```bash
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
rm -rf "${CODEX_HOME:-$HOME/.codex}/skills/agent-prompt-builder"
git clone https://github.com/openai0229/agent-prompt-builder.git \
  "${CODEX_HOME:-$HOME/.codex}/skills/agent-prompt-builder"
```

## Install With Codex Skill Installer

From inside Codex, ask:

```text
Use $skill-installer to install https://github.com/openai0229/agent-prompt-builder/tree/main
```

Or, if you have the built-in installer script available locally:

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo openai0229/agent-prompt-builder \
  --path . \
  --name agent-prompt-builder
```

## Install With npx

This repository is structured as an npm package, so it can be installed directly from GitHub:

```bash
npx github:openai0229/agent-prompt-builder --force
```

Install into the legacy `.codex` skills directory:

```bash
npx github:openai0229/agent-prompt-builder --force \
  --dest "${CODEX_HOME:-$HOME/.codex}/skills"
```

After the package is published to npm, the shorter command will be:

```bash
npx agent-prompt-builder-skill --force
```

To publish the npm package:

```bash
npm login
npm publish --access public
```

## Install With Homebrew

The repository includes a Homebrew formula at `Formula/agent-prompt-builder-skill.rb`.

The public Homebrew tap is:

```text
openai0229/homebrew-agent-prompt-builder
```

Users can install with:

```bash
brew tap openai0229/agent-prompt-builder
brew install --HEAD agent-prompt-builder-skill
agent-prompt-builder-skill --force
```

Without a tap, users can still install from the raw formula URL:

```bash
brew install --HEAD \
  https://raw.githubusercontent.com/openai0229/agent-prompt-builder/main/Formula/agent-prompt-builder-skill.rb
agent-prompt-builder-skill --force
```

Install Homebrew-managed files into legacy `.codex` skills:

```bash
agent-prompt-builder-skill --force --dest "${CODEX_HOME:-$HOME/.codex}/skills"
```

## Public Distribution Checklist

- GitHub repository: already published at https://github.com/openai0229/agent-prompt-builder
- npm package: run `npm login`, then `npm publish --access public`
- Homebrew tap: already published at https://github.com/openai0229/homebrew-agent-prompt-builder
- Skill directory: users can always install through `git clone`, `npx github:...`, or `$skill-installer`
