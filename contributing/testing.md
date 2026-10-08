# Testing Conventions

Every change in `src/` should come with tests. Tests use Jest and live next to the code in `src/**/__tests__/`.

## Writing tests

- Use `test`, not `it`.
- Group related tests with `describe`, but don't nest `describe` blocks.
- Don't wrap a whole file in a single `describe`, and don't create a `describe` for just one test.

## Setup

- Shared setup lives in `jest-setup.ts`.
- Auto-cleanup between tests comes from `src/index.ts`.
- Coverage is collected from `src/`, excluding tests and `src/test-utils/`.

## Event systems

`userEvent` works with both event systems (`configure({ eventSystem })`), so `jest.config.js` has two projects:

- `legacy` runs all tests with the default `'legacy'` event system.
- `modern` runs `src/user-event/` tests again with `'modern'` (`jest-setup-modern.ts`).

Both projects share the same snapshots. `createEventLogger()` entries print only the `nativeEvent` of event payloads (`src/test-utils/event-serializer.ts`), so a snapshot is the same for a legacy event object and a modern `SyntheticEvent`, and a difference between the two systems fails the snapshot. Use `--selectProjects legacy` or `--selectProjects modern` to run one of them.

When a test expects different behavior in the two systems, e.g. events bubbling to a parent, branch on `getConfig().eventSystem` inside the test instead of skipping it.
