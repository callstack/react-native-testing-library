---
uri: /api
---

# API Overview

React Native Testing Library consists of following APIs:

- [`render` function](docs/api/render) - render your UI components for testing purposes
- [`screen` object](docs/api/screen) - access rendered UI:
  - [Queries](docs/api/queries) - find relevant components by various predicates: role, text, test ids, etc
  - Lifecycle methods: [`rerender`](docs/api/screen#rerender), [`unmount`](docs/api/screen#unmount)
  - Helpers: [`debug`](docs/api/screen#debug), [`toJSON`](docs/api/screen#tojson), [`root`](docs/api/screen#root)
- [Jest matchers](docs/api/jest-matchers) - validate assumptions about your UI
- [User Event](docs/api/events/user-event) - simulate common user interactions like [`press`](docs/api/events/user-event#press) or [`type`](docs/api/events/user-event#type) in a realistic way
- [Fire Event](docs/api/events/fire-event) - simulate any component event in a simplified way purposes
- Misc APIs:
  - [`renderHook` function](docs/api/misc/render-hook) - render hooks for testing
  - [Async utils](docs/api/misc/async): `findBy*` queries, `wait`, `waitForElementToBeRemoved`
  - [Configuration](docs/api/misc/config): `configure`, `resetToDefaults`
  - [Accessibility](docs/api/misc/accessibility): `isHiddenFromAccessibility`
  - [Other](docs/api/misc/other): `within`, `act`, `cleanup`
