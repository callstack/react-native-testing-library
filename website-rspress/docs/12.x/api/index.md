---
uri: /api
---
# API Overview

React Native Testing Library consists of following APIs:

- [`render` function](api/core/render) - render your UI components for testing purposes
- [`screen` object](api/core/screen) - access rendered UI:
  - [Queries](api/core/queries) - find relevant components by various predicates: role, text, test ids, etc
  - Lifecycle methods: [`rerender`](api/core/screen#rerender), [`unmount`](api/core/screen#unmount)
  - Helpers: [`debug`](api/core/screen#debug), [`toJSON`](api/core/screen#tojson), [`root`](api/core/screen#root)
- [Jest matchers](api/jest-matchers) - validate assumptions about your UI
- [User Event](api/events/user-event) - simulate common user interactions like [`press`](api/events/user-event#press) or [`type`](api/events/user-event#type) in a realistic way
- [Fire Event](api/events/fire-event) - simulate any component event in a simplified way
purposes
- Misc APIs:
  - [`renderHook` function](api/misc/render-hook) - render hooks for testing 
  - [Async utils](api/misc/async): `findBy*` queries, `wait`, `waitForElementToBeRemoved`
  - [Configuration](api/misc/config): `configure`, `resetToDefaults`
  - [Accessibility](api/misc/accessibility): `isHiddenFromAccessibility`
  - [Other](api/misc/other): `within`, `act`, `cleanup`
