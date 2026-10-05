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
