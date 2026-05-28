# Build, Validation, And Repo Layout

## Common commands

- Install dependencies: `yarn install`
- Run tests: `yarn test`
- Run tests in CI mode: `yarn test:ci`
- Type check: `yarn typecheck`
- Lint source files: `yarn lint`
- Check formatting: `yarn prettier`
- Validate the main package: `yarn validate`
- Build the package: `yarn build`

## Command notes

- `yarn lint` runs ESLint on `src`.
- `yarn validate` runs typecheck, tests, lint, and Prettier checks for the main package.
- `yarn build` cleans `build/`, transpiles source with Babel, and emits TypeScript declarations.

## Repo layout

- `src/`: source code
- `src/pure.ts`: core logic without side effects
- `src/index.ts`: main entry point with auto-cleanup side effects
- `examples/`: example React Native apps
- `website/`: documentation site
- `codemods/`: codemod implementations and tests
