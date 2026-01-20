# API Overview

React Native Testing Library consists of following APIs:

- [`render` function](/react-native-testing-library/12.x/docs/api/render.md) - render your UI components for testing purposes
- [`screen` object](/react-native-testing-library/12.x/docs/api/screen.md) - access rendered UI:
  - [Queries](/react-native-testing-library/12.x/docs/api/queries.md) - find relevant components by various predicates: role, text, test ids, etc
  - Lifecycle methods: [`rerender`](/react-native-testing-library/12.x/docs/api/screen.md#rerender), [`unmount`](/react-native-testing-library/12.x/docs/api/screen.md#unmount)
  - Helpers: [`debug`](/react-native-testing-library/12.x/docs/api/screen.md#debug), [`toJSON`](/react-native-testing-library/12.x/docs/api/screen.md#tojson), [`root`](/react-native-testing-library/12.x/docs/api/screen.md#root)
- [Jest matchers](/react-native-testing-library/12.x/docs/api/jest-matchers.md) - validate assumptions about your UI
- [User Event](/react-native-testing-library/12.x/docs/api/events/user-event.md) - simulate common user interactions like [`press`](/react-native-testing-library/12.x/docs/api/events/user-event.md#press) or [`type`](/react-native-testing-library/12.x/docs/api/events/user-event.md#type) in a realistic way
- [Fire Event](/react-native-testing-library/12.x/docs/api/events/fire-event.md) - simulate any component event in a simplified way purposes
- Misc APIs:
  - [`renderHook` function](/react-native-testing-library/12.x/docs/api/misc/render-hook.md) - render hooks for testing
  - [Async utils](/react-native-testing-library/12.x/docs/api/misc/async.md): `findBy*` queries, `wait`, `waitForElementToBeRemoved`
  - [Configuration](/react-native-testing-library/12.x/docs/api/misc/config.md): `configure`, `resetToDefaults`
  - [Accessibility](/react-native-testing-library/12.x/docs/api/misc/accessibility.md): `isHiddenFromAccessibility`
  - [Other](/react-native-testing-library/12.x/docs/api/misc/other.md): `within`, `act`, `cleanup`
