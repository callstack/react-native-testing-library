# RNTL example app for React Navigation

This example shows how to write integration tests using React Navigation without mocking it.

There are two types of tests:
* integration tests operating on whole navigators, they should use `renderNavigator` helper. It is useful when you want to test navigation between pages.
* screen tests operating on single screen with real navigation connected where you can pass route params. These use `renderScreenWithParams`

> Note that this example applies `includeHiddenElements: false` by default, so all queries will ignore elements on the hidden screens, e.g. inactive tabs or screens present in stack navigators. This option is enabled in `jest-setup.js` file, using `defaultIncludeHiddenElements: false` option to `configure` function.
