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

`fireEvent` and `userEvent` work with both event systems (`configure({ unstable_eventSystem })`), so `jest.config.js` has two projects:

- `legacy` runs all tests with the default `'legacy'` event system.
- `modern` runs all tests again with `'modern'` (`jest-setup-modern.ts`).

Both projects share the same snapshots. `createEventLogger()` entries print only the `nativeEvent` of event payloads (`src/test-utils/event-serializer.ts`), so a snapshot is the same for a legacy event object and a modern `SyntheticEvent`, and a difference between the two systems fails the snapshot. Use `--selectProjects legacy` or `--selectProjects modern` to run one of them.

When a test expects different behavior in the two systems, e.g. events bubbling to a parent, branch on `getConfig().unstable_eventSystem` inside the test instead of skipping it, with a short comment saying which system matches React Native. Name the test after the modern behavior, which aims to match React Native, with the legacy difference in a `(legacy: ...)` suffix, e.g. `does not bubble $name (legacy: bubbles with a warning)`. Prefer ternaries in the expectations (`toHaveBeenCalledTimes(isModern ? 0 : 1)`). For assertions only one system can make, like a legacy warning message, end the test with `if (isModern) return;` before them (`jest/no-conditional-expect` forbids `expect()` inside `if` blocks). Generic `fireEvent(element, eventType, event)` calls that run in both systems pass an event object, e.g. `{ nativeEvent: {} }`, as modern `fireEvent` requires one. `src/events/legacy/__tests__/fire-event.test.tsx` runs the public `fireEvent` this way.

Tests that can't run in the modern event system at all can call `runInLegacyEventSystem()` from `src/test-utils/event-system.ts` at the top of the file (or in a `describe()`). They then run in the legacy event system in both projects.
