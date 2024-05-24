---
uri: /api
---
# API Overview

React Native Testing Library consists of following APIs:

- [`render` function](render) - render your UI components for testing purposes
- [`screen` object](screen) - access rendered UI:
  - [Queries](queries) - find relevant components by various predicates: role, text, test ids, etc
  - Lifecycle methods: [`rerender`](screen#rerender), [`unmount`](screen#unmount)
  - Helpers: [`debug`](screen#debug), [`toJSON`](screen#tojson), [`root`](screen#root)
- [Jest matchers](jest-matchers) - validate assumptions about your UI
- [User Event](api/events/user-event) - simulate common user interactions like [`press`](api/events/user-event#press) or [`type`](api/events/user-event#type) in a realistic way
- [Fire Event](fire-event) - simulate any component event in a simplified way
- [`renderHook` function](render-hook) - render hooks for testing purposes
- [Other APIs](other):
  - [Async utils](other#async-utilities): `findBy*` queries, `wait`, `waitForElementToBeRemoved`
  - [Configuration](other#configuration): `configure`, `resetToDefaults`
  - [Accessibility](other#accessibility): `isHiddenFromAccessibility`
  - [Other](other#other-helpers): `within`, `act`, `cleanup`
