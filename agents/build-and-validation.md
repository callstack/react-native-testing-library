# Build, Validation, And Repo Layout

## Common commands

- Install dependencies: `yarn install`
- Run tests: `yarn test`
- Run tests in CI mode: `yarn test:ci`
- Type check: `yarn typecheck`
- Lint source files: `yarn lint`
- Check formatting: `yarn format:check`
- Validate the main package: `yarn validate`
- Build the package: `yarn build`
- Regenerate package docs: `yarn docs:generate`
- Check package docs are in sync: `yarn docs:check`

## Command notes

- `yarn lint` runs ESLint on `src`.
- `yarn validate` runs typecheck, tests, lint, and oxfmt checks for the main package.
- `yarn build` cleans `dist/`, transpiles source with Babel, and emits TypeScript declarations.

## Documentation

- The docs under `website/docs/` are the source of truth. The `docs/api/*.md` files are
  generated from them — never edit those by hand.
- After making any documentation changes, run `yarn docs:generate` to regenerate the package
  docs, and commit the regenerated files alongside your `website/` edits. `yarn docs:check`
  (part of `validate:all`) fails if they are out of sync.

## Repo layout

- `src/`: source code
- `src/pure.ts`: core logic without side effects
- `src/index.ts`: main entry point with auto-cleanup side effects
- `examples/`: example React Native apps
- `website/`: documentation site
- `codemods/`: codemod implementations and tests
