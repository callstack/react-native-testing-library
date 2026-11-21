# Large changes

Use this procedure for Stage 1 when the change touches more than ~30 files or ~1,500 changed lines, not counting generated files, lockfiles, snapshots, and vendored code. The rest of the skill (Stage 2, output) stays the same.

1. **Classify every file** from the name-status list: core logic, interfaces and types, schema and config, tests, generated, or mechanical (renames, codemods, formatting, import moves). Spot-check a few mechanical files, then collapse each mechanical pattern into one line, e.g. "212 files: import path `a` → `b`". Note any file that breaks the pattern, and read it as core.
2. **Use commits as blocks when the history is clean.** If commit messages tell a story ("add model", "wire API", "migrate callers"), walk them in order with `git log --reverse --stat <base>..<head>`. If the history is noise ("wip", "fix"), ignore it and group by purpose.
3. **Map per block, then reduce.** Spawn one subagent per big block (at most 6, in parallel). Give each its file list, the diff refs, and the intent sources, and ask for exactly: what the block does, its interface to the rest of the change, structural decisions, assumptions (stated or inferred), and files read in depth vs. skimmed. Write the facts from those block summaries; read code yourself only where blocks conflict or connect. Without subagent support, do the blocks one at a time and keep a short note per block before moving on.
4. **Read by priority within a budget.** Within each block: new public interfaces, types, and schemas first, then deleted code, then entry points, then core logic. Stop when the block's picture stops changing, and record what was left unread.

Coverage matters most here: a reader can work with a partial summary only if they know which parts are partial.

If the blocks are unrelated to each other (for example a refactor, a feature, and a dependency bump), state that plainly in the summary's opening.
