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

## Reference sources

Upstream sources are checked out as shallow git submodules under `refs/` for code research. Read and search them to see how upstream implements something (event dispatch, renderer internals, query semantics) instead of guessing or fetching from the web.

- `refs/react-native/`: [facebook/react-native](https://github.com/facebook/react-native) (core components in `packages/react-native/Libraries/`)
- `refs/react/`: [facebook/react](https://github.com/facebook/react) (reconciler, test renderer, and RN renderer in `packages/`)
- `refs/dom-testing-library/`: [testing-library/dom-testing-library](https://github.com/testing-library/dom-testing-library) (queries, `fireEvent`, `waitFor`)
- `refs/react-testing-library/`: [testing-library/react-testing-library](https://github.com/testing-library/react-testing-library) (`render`, `act` integration)
- `refs/expensify-app/`: [Expensify/App](https://github.com/Expensify/App), a large production React Native app with about 1,000 test files that use this library (in `tests/ui/`, `tests/unit/`, `tests/perf-test/`). Use it to see how real-world tests call the API and to judge the impact of behavior or API changes. Check its `package.json` for the version it uses.

Notes:

- Treat `refs/` as read-only. Never edit files there or import from it in `src/`.
- Submodules track upstream `main`, which can differ from the versions installed in `node_modules/`. For behavior that must match what this library runs against, check the installed package in `node_modules/` too.
- If `refs/` is empty, ask the human to run `git submodule update --init --depth 1`.
- Tooling ignores `refs/` (Jest, ESLint, oxfmt, `tsc`). Keep it that way when changing configs.

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
