# Code Assistant Context

`@testing-library/react-native` is a TypeScript/Jest library for testing React Native components with user-focused testing patterns.

> [!IMPORTANT]
> Never run git commands that create commits, push, or modify the index/history. The human stages and commits. See [Agent rules](#agent-rules).

- Package manager: `yarn` (`yarn@4.11.0`)
- Common commands:
  - `yarn test`
  - `yarn test:ci`
  - `yarn typecheck`
  - `yarn lint`
  - `yarn format:check`
  - `yarn build`
  - `yarn validate`
- Contributor guides (shared with human contributors, see also [CONTRIBUTING.md](CONTRIBUTING.md)):
  - [Architecture and API design](contributing/architecture.md)
  - [Build, validation, and repo layout](contributing/build-and-validation.md)
  - [TypeScript and code style](contributing/code-style.md)
  - [Testing conventions](contributing/testing.md)
  - [Native event propagation (bubbling vs direct)](contributing/native-events.md)
  - [Native state for uncontrolled components](contributing/native-state.md)
  - [Event dispatch (`fireEvent` vs `userEvent`)](contributing/event-dispatch.md)
  - [Accessibility model](contributing/accessibility.md)
  - [Async, `act`, and timers](contributing/async-and-timers.md)
  - [Example app regeneration](contributing/example-apps.md)
  - [Git, releases, and PR workflow](contributing/git-workflow.md)

## Agent rules

### Git restrictions

- Never run git commands that create commits, push, or modify the index/history. The human owns these actions.
- Forbidden commands include (non-exhaustive): `git commit`, `git push`, `git add`, `git rm`, `git mv`, `git restore --staged`, `git reset`, `git rebase`, `git merge`, `git cherry-pick`, `git stash`, `git commit --amend`, and `git tag`.
- Read-only inspection is fine: `git status`, `git log`, `git diff`, `git show`, `git blame`.
- When conflicts or staging are involved, resolve file contents in the working tree only, then hand off to the human to stage and commit. Describe the exact commands you would run instead of running them.

### PR draft

- Maintain `PR.txt` at the repository root using the structure from `.github/PULL_REQUEST_TEMPLATE.md`.
- Keep `PR.txt` aligned with the current branch diff relative to `origin/main`.
- Include tests actually run and any known validation gaps in `PR.txt`.
- Do not commit `PR.txt`.
