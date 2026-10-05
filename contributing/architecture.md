# Architecture And API Design

RNTL lets you test React Native components the way users interact with them, not through implementation details. It runs your components on top of `test-renderer`, which simulates the React Native runtime inside Jest.

## API design principles

- Keep the public API small.
- Render host elements only (`View`, `Text`, etc.), not composite components.
- Expose React and `react-reconciler` features when other Testing Libraries need them.
- Offer escape hatches to fibers for the rare cases that need them.

## Entry points

- `src/pure.ts`: the core API, with no side effects.
- `src/index.ts`: re-exports `pure` and registers auto-cleanup after each test. This is what users import by default.

## Host components

Some host components need special handling, like `Text`, `TextInput` or `ScrollView`. RNTL recognizes them by their host `type` name, using the helpers in `src/helpers/host-component-names.ts`. Use these helpers instead of comparing `instance.type` to a string.

The names come from React Native's Jest mocks, not from the native views on a device. A React Native upgrade can change them. `src/__tests__/host-component-names.test.tsx` catches that.
