# Testing Conventions

## Test stack

- Test framework: Jest with the `react-native` preset
- Test environment setup: `jest-setup.ts`
- Auto-cleanup is configured from `src/index.ts` unless explicitly skipped

## Test location and coverage

- Library tests are typically colocated under `src/**/__tests__`
- Coverage is collected from `src` and excludes test files

## Test organization

- Use `describe` blocks to group tests by theme.
- Do not put all tests into a single `describe`.
- Avoid nested `describe` blocks.
- If a `describe` would contain only one test, make that test top-level instead.
- Prefer `test` over `it`.
