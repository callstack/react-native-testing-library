# Code Assistant Context

`@testing-library/react-native` is a TypeScript/Jest library for testing React Native components with user-focused testing patterns.

> [!IMPORTANT]
> Don't commit, push, or change the index or history on your own initiative. Do it only when the human asks, directly or through a skill or command they invoked. See [Agent rules](#agent-rules).

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

`refs/` holds upstream sources as shallow git submodules. Search them to see how upstream implements something (event dispatch, renderer internals, query semantics) instead of guessing or fetching from the web.

- `refs/react-native/`: [facebook/react-native](https://github.com/facebook/react-native) (core components in `packages/react-native/Libraries/`)
- `refs/react/`: [facebook/react](https://github.com/facebook/react) (reconciler and RN renderer in `packages/`). RNTL renders through [`test-renderer`](https://github.com/mdjastrzebski/test-renderer), not the deprecated `react-test-renderer` found here.
- `refs/dom-testing-library/`: [testing-library/dom-testing-library](https://github.com/testing-library/dom-testing-library) (queries, `fireEvent`, `waitFor`)
- `refs/react-testing-library/`: [testing-library/react-testing-library](https://github.com/testing-library/react-testing-library) (`render`, `act` integration)
- `refs/expensify-app/`: [Expensify/App](https://github.com/Expensify/App), about 1,000 test files using this library (`tests/ui/`, `tests/unit/`, `tests/perf-test/`). Use it to see real-world API usage and judge the impact of changes. It is on RNTL v13 (see its `package.json`), so syntax differs from v14: `render` and `fireEvent` are sync there.

Notes:

- `refs/` is read-only. Never edit it or import from it in `src/`.
- Submodules are pinned to fixed commits and can differ from `node_modules/`. For behavior this library runs against, check `node_modules/`.
- Refresh with `git submodule update --remote --depth 1`. Moved refs show as modified pointers in `git status`. Bump them in their own PR, never in unrelated work.
- If `refs/` is empty, ask the human to run `git submodule update --init --depth 1`.
- Tooling ignores `refs/` (Jest, ESLint, oxfmt, `tsc`). Keep it that way when changing configs.

## Agent rules

### Git restrictions

- Without an instruction, don't run git commands that create commits, push, or modify the index/history. These include (non-exhaustive): `git commit`, `git push`, `git add`, `git rm`, `git mv`, `git restore --staged`, `git reset`, `git rebase`, `git merge`, `git cherry-pick`, `git stash`, `git commit --amend`, and `git tag`.
- When the human asks for commits, either directly or through a skill or command they invoked (for example one that commits after each fix), create them on the current branch. Stage only the files that belong to that change, and never stage `PR.txt` or an unrelated `refs/` pointer.
- Pushing, rewriting history (`rebase`, `reset`, `--amend`), and discarding work (`stash`, `reset --hard`) each need an explicit request for that specific action. A request to commit doesn't cover them.
- Read-only inspection is always fine: `git status`, `git log`, `git diff`, `git show`, `git blame`.
- Without an instruction to commit, leave changes in the working tree and hand off to the human. Describe the exact commands you would run instead of running them.

### PR draft

- Maintain `PR.txt` at the repository root using the structure from `.github/PULL_REQUEST_TEMPLATE.md`.
- Keep `PR.txt` aligned with the current branch diff relative to `origin/main`.
- Include tests actually run and any known validation gaps in `PR.txt`.
- Do not commit `PR.txt`.
