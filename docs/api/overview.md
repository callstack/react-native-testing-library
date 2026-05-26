# API Overview

React Native Testing Library consists of following APIs:

- [`render` function](./render.md) - render your UI components for testing purposes
- [`screen` object](./screen.md) - access rendered UI:
  - [Queries](./queries.md) - find relevant components by various predicates: role, text, test ids, etc
  - Lifecycle methods: [`rerender`](./screen.md#rerender), [`unmount`](./screen.md#unmount)
  - Helpers: [`debug`](./screen.md#debug), [`toJSON`](./screen.md#tojson), [`root`](./screen.md#root)
- [Jest matchers](./jest-matchers.md) - validate assumptions about your UI
- [User Event](./user-event.md) - simulate common user interactions like [`press`](./user-event.md#press) or [`type`](./user-event.md#type) in a realistic way
- [Fire Event](./fire-event.md) - simulate any component event in a simplified way purposes
- Misc APIs:
  - [`renderHook` function](./render-hook.md) - render hooks for testing
  - [Async utils](./async-utilities.md): `findBy*` queries, `waitFor`, `waitForElementToBeRemoved`
  - [Configuration](./configuration.md): `configure`, `resetToDefaults`
  - [Accessibility](./accessibility.md): `isHiddenFromAccessibility`
  - [Other](./other-helpers.md): `within`, `act`, `cleanup`
