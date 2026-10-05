# Testing Conventions

Every change in `src/` should come with tests. Tests use Jest and live next to the code in `src/**/__tests__/`.

## Writing tests

- Use `test`, not `it`.
- Group related tests with `describe`, but don't nest `describe` blocks.
- Don't wrap a whole file in a single `describe`, and don't create a `describe` for just one test.

## Setup

- Shared setup lives in `jest-setup.ts`.
- Auto-cleanup between tests comes from `src/index.ts`.
