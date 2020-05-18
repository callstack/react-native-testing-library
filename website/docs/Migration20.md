---
id: migration20
title: Migration to 2.0
---

This guides describes major steps involved in migrating your testing code from using React Native Testing Library version `1.x` to version `2.0`.


## Removed global `debug` function

Global debug function has been removed in favor of `debug()` method returned from `render()` function.

## Some `byTestId` queries behavior changes

In version `1.x` `getByTestId` and `queryByTestId` could return non-native elements in tests. This was in contrast with other query functions: `getAllByTestId`, `queryAllByTestId`, `findByTestId` and `findAllByTestId` which returned only elements that would be rendered to native components (e.g. `View`, `Text`, etc).

If you relied on setting `testID` for your custom components, you should probably set them on the root element of the returned JSX.

:::caution
In general, you should avoid `byTestId` queries when possible and rather use queries that check things that can been seen by the user (e.g. `byText`, `byPlaceholder`, etc) or accessability queries (e.g. `byA11yHint`, `byA11yLabel`, etc).
:::
