---
name: summarize-changes
description: Use when the user asks to summarize, explain, or get an overview of a PR, branch, or their current changes — "what does this PR do", "summarize my branch", "big picture of these changes", "is this the right approach" — before or instead of a detailed code review. Defaults to the current branch against the default branch, including uncommitted changes; also takes a PR number or URL, or a branch name. Not for line-level code review.
metadata:
  version: "0.2.0"
---

# Summarize Changes

Summarize a change at the level of approach: what it does in the big picture, which structural decisions it makes, and what it assumes. The goal is to let a reader (reviewer or author, same output) judge whether the big blocks are right before any line-level review.

Two sequential stages. The main agent writes the neutral **facts**. Then a fresh subagent writes a skeptical **evaluation**, because whoever described the decisions tends to rationalize them.

This is not a code review. No style, naming, typos, small bugs, or test nitpicks. If the user wants those, suggest the `code-review` skill. The skill is read-only: it never edits the working tree, commits, or pushes.

## 1. Resolve the target

For each GitHub operation, use an authenticated `gh` when available. Otherwise, use the equivalent GitHub MCP tool. Resolve the repository from the PR URL or the checkout's GitHub remote.

- **PR number or URL:** run `gh pr view N --json number,title,body,baseRefName,headRefName,url,closingIssuesReferences` for intent and refs, then `gh pr diff N`. With MCP, get PR metadata and the diff (for example, `pull_request_read` with methods `get` and `get_diff`). Use local git against the merge-base when you can fetch both refs and need a complete diff. If neither GitHub route can read an explicitly requested PR, ask for the branch name to proceed with local git.
- **Branch name:** diff `merge-base(<default branch>, <branch>)..<branch>`.
- **Nothing given:** the current branch against its merge-base with the default branch, plus uncommitted changes (staged, unstaged, and untracked files; list untracked files and read the relevant ones). Find the default branch with `git symbolic-ref refs/remotes/origin/HEAD`, falling back to `main`, then `master`. On the default branch with no commits ahead, summarize only the uncommitted changes.
- For current-branch PR discovery, use `gh pr view` and confirm the PR is open. With MCP, list open PRs by head owner and branch (for example, `list_pull_requests` with `state=open` and `head=OWNER:BRANCH`, or PR search with the same filters). Verify the head repository and branch, then use the PR description as intent and offer to post the summary in Step 4. If PR discovery is unavailable, continue with the local summary.
- Include uncommitted changes only for the local checkout of the target branch, never for a PR you are not on.
- If there are no changes at all, say so and stop.

**Intent sources:** PR title and description, linked issues if referenced, and commit messages. Open relevant linked issues with `gh issue view URL` or the equivalent GitHub MCP issue reader (for example, `issue_read` with method `get`), including issue links or closing references surfaced by either PR reader. If there are no intent sources, say the intent is inferred from the code.

## 2. Stage 1: facts (main agent)

Read the shape first: `git diff --stat -M` and `git diff --name-status -M` (added, modified, deleted, renamed), plus the commit list. Group files into 2 to 6 big blocks by purpose, not by directory. Read enough of each block (the diff plus surrounding code where needed) to understand what it does structurally. Skim or skip lockfiles, generated files, snapshots, and vendored code, and mention them in one line. On large diffs, prioritize new modules, public interfaces, data and schema changes, config, and deleted code. Do not try to read every line.

Write the facts neutrally: no judgments. Emphasize approach, big blocks, structural decisions, and assumptions over details. Mark each decision and assumption as **stated** (in the PR or commits) or **inferred** (from the code). Keep it readable in about one minute.

**Block diagram (optional):** add a small Mermaid `flowchart` only when there are 4 or more blocks with real data or control flow between them. One node per block, edges labeled with what passes between them, no file-level nodes. Skip it when the blocks are independent or the paragraph already makes the flow obvious.

**For the code review:** end the facts with two navigation aids, still neutral:

- **Read in this order:** one line ordering the blocks for a line-level reviewer, usually contracts first (schemas, types, public APIs), then the code that implements them, then callers and tests.
- **Look closely at:** up to 3 places where line-level review matters most, named by what they touch, not by whether they look wrong: data migrations, auth or permissions, concurrency or ordering, public API or wire-format changes, deleted or changed behavior, security-sensitive input handling. Each with a file reference. Write "none" if nothing qualifies.

Track coverage as you go: which files you read in depth, which you skimmed, and which you collapsed or skipped. It goes on the first line of the output.

The facts must serve two readers: the human, and the evaluator in stage 2. Finalize them before starting stage 2.

**Large changes:** if the change touches more than ~30 files or ~1,500 changed lines (not counting generated files, lockfiles, snapshots, and vendored code), read [references/large-changes.md](references/large-changes.md) and follow it for this stage.

## 3. Stage 2: evaluation (fresh subagent)

Spawn one subagent, after the facts are final. Brief it with:

- the facts section, verbatim
- how to get the diff: base and head refs, PR number, and whether uncommitted changes are included (and that they are in the working tree)
- the intent sources: PR text, linked issues, commit messages, or "none, intent is inferred"
- these instructions:

```text
You are evaluating the approach of a change, not reviewing its lines. You are given a neutral summary of the change. It may be wrong or flattering.

1. Get the diff as described and verify each listed structural decision and assumption against the code before judging it. Read the files relevant to each claim, not the whole diff. If a fact is wrong, correct it and flag the correction.
2. Compare against existing patterns in the repo: does the change fit how this codebase already does similar things?
3. Compare the stated intent against what the code does.
4. Stay at approach level. No line-level findings: no style, naming, typos, small bugs, or test nitpicks.

Reply with exactly these sections, writing "none" for an empty one rather than inventing content:
- Overall: one sentence. Does the approach fit the stated goal and the codebase?
- Concerns: at most 3, most important first. Each one or two sentences: what, why it matters, evidence (file reference). If the blocks are unrelated and the change would review better as separate PRs, make "Consider splitting" one of the concerns.
- Intent vs. code: one or two sentences on mismatches between what the PR says and what the code does (scope creep, missing pieces).
- Questions for the author: at most 3, worth discussing before line-level review.
- Corrections to the facts: anything you found wrong, or "none".
Be terse. No preamble, no restating the facts.
```

**No subagent support:** do stage 2 inline, as a deliberate separate pass after the facts are finalized. Re-read the code for each decision and assumption with a skeptical stance, and follow the same instructions.

Fold any corrections into the facts you present.

## 4. Present

Print in chat, using this template. Label the evaluation as opinion. Aim for one screen.

Length rules:
- One line per bullet. Block descriptions are one sentence; decisions and assumptions are a short clause each.
- At most 5 decisions, 4 assumptions, 3 "Not in this change" items. Pick the ones that shape the design; drop the rest.
- Omit an empty section entirely, except **Concerns** (write "none").
- Don't repeat a point across sections: if it is a decision, don't restate it as an assumption or a concern.

```markdown
## Summary: <target>

### Facts
`<PR # / branch / commit>` · base `<base>` · N files, +X/−Y · uncommitted <included | not included> · <"all files read" | coverage: N in depth, N skimmed, N collapsed (<patterns>), N skipped>

<2–3 sentences: what the change does and why; stated or inferred intent>

**Big blocks**
1. **<name>**: <one sentence>. `key-file`

<optional mermaid flowchart, only for 4+ connected blocks>

**Decisions**
- <decision> (<stated | inferred>); rejects <alternative, when obvious>

**Assumptions**
- <what must be true> (<stated | inferred>)

**Not in this change:** <item>; <item>

**For review:** read <block> → <block> → <block>. Look closely at <what it touches> (`file`); …

### Evaluation (opinion, separate pass)
**Overall:** <one sentence>
**Concerns**
1. <what>: <why it matters>. `file`
**Intent vs. code:** <one or two sentences>
**Questions:** <question>; <question>
```

Then, if the target is or has a GitHub PR, offer once to post the summary as a PR comment, saying the evaluation is left out unless they want it included. Post only on an explicit yes. By default the comment contains only the **Facts** section. Include the evaluation only if the user asks for it, and then head it "AI evaluation (opinion, not verified by the author of this comment)". When an authenticated `gh` is available, write the comment to a temp file outside the repo and run `gh pr comment N --body-file <file>`. Otherwise, use the equivalent GitHub MCP conversation comment tool (for example, `add_issue_comment`) with the PR number and comment body. Never edit the PR description. If there is no PR, or the user declines, stop.

After presenting, the main agent can go deeper on any block on request.

## Avoid

- Line-level review or a file-by-file tour.
- Judgments in the facts section, or facts presented as certain when they are inferred.
- Letting the evaluation simply endorse the facts; it must check them against the code.
- Padding or repetition. A short, accurate "none" beats an invented concern.
- Turning "Look closely at" into findings: it says where review matters, not what is wrong.
- Diagrams for simple changes, or diagrams that restate the block list.
