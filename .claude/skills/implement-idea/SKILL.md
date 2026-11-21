---
name: implement-idea
description: Use when the user brings a rough idea for a feature, fix, refactor, or other change and wants it turned into a spec and built, or says "implement this idea", "I have an idea for…", "grill me on this, then build it". Gets the spec approved, then delegates the build. Use pipeline mode when `factory` invokes the skill or the user explicitly requests it.
metadata:
  version: "0.2.0"
---

# Implement Idea

Turn a rough idea into an approved spec, then hand it to a subagent to build. Five phases, in order: research, grill, approve, delegate, deliver. Do not write code yourself.

## Mode

- **Interactive (default):** follow phases 1–5.
- **Pipeline:** follow the same spec approval gate, then publish a draft PR and return the build result to the caller. Ground the idea as usual. Resolve routine questions as stated assumptions and ask only about a choice that prevents a viable spec. If the caller provides the full spec, its summary, and explicit user approval of that version, resume at phase 4. Any material spec change needs fresh approval.

## 1. Ground yourself first

Before the first question, read enough of the codebase to avoid asking what the code already answers: where the change would live, existing patterns it should follow, how tests and the dev loop work (`AGENTS.md`, `CLAUDE.md`, `README`, package scripts). Never ask the user something you can look up.

## 2. Grill, one question at a time

Interview the user like a sharp senior engineer stress-testing the idea.

- **One question per message.** Wait for the answer before asking the next. Never batch.
- **Most important first.** Order by how much the answer changes the build: goal and success criteria → scope (what's in, what's explicitly out) → user-facing behavior → data and interfaces → edge cases and errors → non-functional (performance, security, compatibility) → polish.
- **Make every question cheap to answer.** Offer 2–4 concrete options and mark your recommendation, e.g. "Should failed syncs retry? (a) no, surface the error (b) 3 retries with backoff — recommended, matches `fetchWithRetry` (c) retry forever in background". Use a structured question tool if the agent has one.
- **Adapt.** Let each answer reshape the remaining questions. Skip anything an earlier answer already settled. Push back when an answer conflicts with an earlier one or with the codebase.
- **Hard cap: 20 questions.** Stop earlier once the remaining unknowns would not change the design. Most ideas need 3–10.
- **Decide the rest yourself.** For every detail not asked, pick the most reasonable option given the codebase and the answers so far, and record it as an assumption.
- If the user says "you decide" or "just build it", stop asking and move to the summary.

## 3. Present the spec for approval

Write two versions of the spec after the last question:

- **Full spec** — the detailed version the subagent will build from (contents listed in phase 4). Write it first and save it to a file outside the repo's tracked files (the agent's scratch or temp directory; otherwise `.implement-idea/<slug>.md` and make sure it is git-ignored).
- **Summary** — the concise version the user reads, short enough to take in under a minute.

Show the summary, give the user an easy way to see the full version, and stop until the user approves:

```markdown
## Spec: <title>

**Goal:** <one or two sentences — what changes and why>

**Scope**
- In: …
- Out: …

**Behavior**
- <concrete, testable statements of what the result does>

**Key decisions** (from your answers)
- <decision> — <short reason>

**Assumptions** (decided by me — correct any)
- <assumption> — <short reason>

**Acceptance criteria**
- <how we'll know it works>

**Implementation difficulty:** <simple | moderate | hard> → <agent and effort picked>

**Full spec:** <path to file> — or say "show full spec" to see it here
```

Approve, edit, or reject — do not start until the user says go. If the user asks to see the full spec, print it in full. If they correct something, update both versions and re-present only the changed parts of the summary.

The two versions must never disagree: the summary is a view of the full spec, not a separate document.

## 4. Delegate to a sized subagent

Pick the subagent's model and reasoning effort from the spec's difficulty. Spend on hard work, save on easy work:

| Difficulty | Signals | Pick (Claude Code example) |
| --- | --- | --- |
| Simple | one or two files, clear pattern to copy, low risk (copy change, config flag, small UI tweak, obvious bug fix) | economical model, low–medium effort — e.g. `haiku`, or `sonnet` at medium |
| Moderate | several files in one area, new but conventional logic, some tests to write | `sonnet` at medium–high effort |
| Hard | cross-cutting or architectural change, concurrency, data migrations, security-sensitive code, subtle algorithms, unfamiliar or poorly structured code | most capable model, high effort — e.g. `opus` at high |

When in doubt between two tiers, pick the higher one. If the agent has no subagent support, implement it yourself following the same brief.

In pipeline mode, do step 1 of [Pipeline delivery](#pipeline-delivery) first, so the build happens on the new branch.

Give the subagent a self-contained brief — it does not see this conversation:

- the approved full spec, verbatim — everything in the summary, plus what the subagent needs to build without guessing:
  - every decision and assumption, with its reasoning
  - concrete behavior per case: inputs, outputs, states, error and empty cases, edge cases raised in the interview
  - interfaces and data shapes: function signatures, props, API contracts, schema or config changes
  - the planned approach: where each piece lives, which existing code to reuse or extend, what to leave untouched
  - acceptance criteria as testable checks, and which tests to add
- the relevant files, patterns, and conventions you found in phase 1
- how to run tests, lint, and typecheck, and the instruction to run them before finishing
- in pipeline mode, the checkout path and branch to work in
- constraints: stay within scope, do not commit or push unless the user asked, do not ask the user questions — make the reasonable call and report it
- what to return: files changed, a summary of the change, any deviations from the spec and why, test results, and steps to try the feature manually

## 5. Deliver the build

When the subagent finishes, verify its claims briefly (look at the diff, confirm tests ran). In interactive mode, report to the user concisely:

- **What changed:** two to four bullets, with key files
- **Deviations:** anything that differs from the spec, or "none"
- **Try it yourself:** the shortest concrete steps to see the feature working — a command to run, a screen to open, input to give, what to expect
- **Checks:** tests/lint/typecheck run and their result

Keep it short. Don't paste the diff or repeat the spec.

### Pipeline delivery

1. After approval and before delegating, resolve the target GitHub repository and base branch (the caller's target or the repository default). Create a new branch from that base in a clean checkout. Use an isolated checkout if needed to preserve existing work. Keep the worker's usual restriction on committing and pushing.
2. After verifying the build, stage only the approved build changes, commit them, and push the branch. If there is no build to publish, or a required check or publication step fails, return the blocker and the last completed step to the caller.
3. Open a draft PR against the chosen base using authenticated `gh pr create --draft --base <base> --head <branch> --title <title> --body-file <file>` or the equivalent GitHub MCP operation. Put the approved spec summary first, then the complete approved spec inside `<details>` with a `<summary>Full spec</summary>` and blank lines around the spec. Keep local scratch paths out of the summary. Verify the draft PR and its refs. Before retrying PR creation, look up an existing PR for the same head and base.
4. Return the PR number and URL, repository, base and head branches, build commit, checkout path, approved spec summary and full spec, deviations, checks, and steps to try the build. Continue in the calling workflow. For direct pipeline requests, return the same result to the user.
