# RNTL example app for React Navigation

This example shows how to write integration tests using React Navigation without mocking it.

There are two types of tests:
1. integration tests operating on whole navigators, they should use `renderNavigator` helper to render a navigator component used in the app. It is useful when you want to test a scenario that includes multiple screens.
2. single screen tests where you would pass mock `navigation` prop, built using `buildNavigationMock()` helper, and `route` prop to the screen component using regular `render` function.

> Note that this example applies `includeHiddenElements: false` by default, so all queries will ignore elements on the hidden screens, e.g. inactive tabs or screens present in stack navigators. This option is enabled in `jest-setup.js` file, using `defaultIncludeHiddenElements: false` option to `configure` function.
