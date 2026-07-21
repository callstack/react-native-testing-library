# Git, Releases, And PR Workflow

## Agent git restrictions

- Never run git commands that create commits, push, or modify the index/history. The human owns these actions.
- Forbidden commands include (non-exhaustive): `git commit`, `git push`, `git add`, `git rm`, `git restore --staged`, `git reset`, `git rebase`, `git merge`, `git cherry-pick`, `git stash`, `git commit --amend`, and `git tag`.
- Read-only inspection is fine: `git status`, `git log`, `git diff`, `git show`, `git blame`.
- When conflicts or staging are involved, resolve file contents in the working tree only, then hand off to the human to stage and commit. Describe the exact commands you would run instead of running them.

## Commits and releases

- Use Conventional Commits such as `fix:`, `feat:`, and `chore:`.
- Releases are managed with `release-it`.

## PR draft workflow

- Maintain `PR.txt` at the repository root using the structure from `.github/pull_request_template.md`.
- Keep `PR.txt` aligned with the current branch diff relative to `origin/main`.
- Include tests actually run and any known validation gaps in `PR.txt`.
- Do not commit `PR.txt`.
