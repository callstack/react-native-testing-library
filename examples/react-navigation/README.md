# RNTL example app for React Navigation

This example is shows how to use React Native Testing Library when testing apps using React Navigation.

> Note that this example applies `includeHiddenElements: false` by default, so all queries will ignore elements on the hidden screens, e.g. inactive tabs or screens present in stack navigators. This option is enabled in `jest-setup.js` file, using `defaultIncludeHiddenElements: false` option to `configure` function.
