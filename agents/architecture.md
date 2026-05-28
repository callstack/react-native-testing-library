# Architecture And API Design

## Project overview

`@testing-library/react-native` provides utilities for testing React Native components in ways that resemble real usage and avoid implementation details.

- Tech stack: TypeScript, React Native, Jest
- Core principle: the closer tests are to real usage, the more confidence they provide
- Runtime model: the library simulates the React Native runtime on top of `test-renderer`

## API design principles

- Prefer a small public API surface.
- Expose underlying React and `react-reconciler` capabilities when Testing Libraries need them.
- Render host elements only.
- Provide escape hatches to fibers when needed.

## Key entry points

- `src/pure.ts`: side-effect-free core logic without auto-cleanup
- `src/index.ts`: main entry point that re-exports `pure` and adds auto-cleanup side effects
