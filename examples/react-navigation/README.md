# RNTL example app for React Navigation

This example shows how to write integration tests using React Navigation without mocking it. Presented approach has been consulted with and influenced by React Navigation team.

## Recommended tests

There are two types of recommeded tests:
1. Tests operating on navigator level - these use `renderNavigator` helper to render a navigator component used in the app. It is useful when you want to test a scenario that includes multiple screens.
2. Tests operating on single screen level - these use regular `render` helper but require refactoring screen components into `Screen` and `ScreenContent` components. Where `Screen` receives React Navigation props and/or uses hooks like `useNavigation` while `ScreenContent` does not have a direct relation to React Navigation API but gets props from `Screen` and calls relevant callbacks to trigger navigation.

## Non-recommended tests

There also exists another popular type of screen level tests, where users mock React Navigation objects like `navigation`, `route` and/or hooks like  `useNavigation`, etc. We don't recommend this way of testing. **Mocking internal parts of the libraries is effectively testing implementation details, which goes against the Testing Library's [Guiding Principles](https://testing-library.com/docs/guiding-principles/)**.

