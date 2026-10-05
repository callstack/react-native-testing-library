# Build, Validation, And Repo Layout

Run `yarn install` once, then `yarn validate` before you push. It runs the same checks as CI: type check, tests, lint, and formatting.

## Commands

| Command                                 | What it does                                                   |
| --------------------------------------- | -------------------------------------------------------------- |
| `yarn test`                             | Run tests                                                      |
| `yarn typecheck`                        | Type check                                                     |
| `yarn lint`                             | Run ESLint on `src/`                                           |
| `yarn format:check` / `yarn format:fix` | Check or fix formatting                                        |
| `yarn validate`                         | All of the above                                               |
| `yarn validate:all`                     | Also validate the examples, website, and generated docs        |
| `yarn build`                            | Clean `dist/`, compile with Babel, then emit type declarations |
| `yarn docs:generate`                    | Regenerate package docs from the website                       |

## Documentation

Edit docs in `website/docs/`. The `docs/` folder is generated from it and ships to npm for coding agents, so never edit it by hand.

After changing docs, run `yarn docs:generate` and commit the result together with your `website/` changes. CI fails if they are out of sync.

## Repo layout

- `src/`: library source and tests
- `docs/`: generated package docs (do not edit)
- `website/`: documentation site
- `examples/`: example Expo apps
- `codemods/`: codemods for upgrading user code
- `contributing/`: these guides
