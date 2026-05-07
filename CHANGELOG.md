# Changelog

All notable changes to React Native Testing Library will be documented in this file, starting
with v14.

## 14.0.0

### Migration guide

See the [Migration to 14.x](./website/docs/14.x/docs/start/migration-v14.mdx) guide for
step-by-step upgrade instructions, codemods, and before/after examples.

### Breaking changes

- Dropped support for React 18. React 19.0.0 or newer is now required.
- Raised the minimum supported React Native version to 0.78.
- Replaced the deprecated React Test Renderer with
  [Test Renderer](https://github.com/mdjastrzebski/test-renderer).
- Made the core rendering and event APIs async by default:
  - `render()` now returns `Promise<RenderResult>`.
  - `renderHook()` now returns `Promise<RenderHookResult>`.
  - `fireEvent()` and its helpers now return `Promise<void>`.
  - `act()` now always returns a Promise and should always be awaited.
- Removed the `renderAsync`, `renderHookAsync`, and `fireEventAsync` APIs. Use `render`,
  `renderHook`, and `fireEvent` instead.
- Removed the `update` alias. Use `rerender` instead.
- Removed the `getQueriesForElement` alias. Use `within` instead.
- Removed `UNSAFE_root`. Use `container` for the pseudo-element container or `root` for
  the first rendered host element.
- Removed legacy `UNSAFE_*` queries:
  - `UNSAFE_getAllByType`
  - `UNSAFE_getByType`
  - `UNSAFE_getAllByProps`
  - `UNSAFE_getByProps`
- Removed the `concurrentRoot` render and configuration option. Concurrent rendering is
  always enabled in v14.
- Removed the `unstable_validateStringsRenderedWithinText` render option. Text string
  validation is now always enabled.

### Notable changes

- Reintroduced the `container` API as a safe pseudo-element container, aligned with React
  Testing Library semantics.
- Query results and the rendered element tree now expose host elements only. Composite
  components are no longer visible through the test tree.
- Type definitions now use `TestInstance` from Test Renderer instead of
  `ReactTestInstance` from React Test Renderer.
- Text strings rendered outside of React Native `<Text>` components now throw, matching
  React Native runtime behavior.

### Codemods

Two codemods are available to automate the most common v14 upgrade work:

- `rntl-v14-update-deps` updates dependencies by removing React Test Renderer packages,
  adding Test Renderer, and updating React Native Testing Library.
- `rntl-v14-async-functions` updates test code for async `render`, `renderHook`, `fireEvent`,
  `act`, `rerender`, and `unmount` usage.

### Full changelog

See the full GitHub comparison:
https://github.com/callstack/react-native-testing-library/compare/v13.3.3...v14.0.0
