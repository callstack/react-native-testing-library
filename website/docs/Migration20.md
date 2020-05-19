---
id: migration-v2
title: Migration to 2.0
---

This guides describes major steps involved in migrating your testing code from using React Native Testing Library version `1.x` to version `2.0`.

## Dropping Node 8

Node 8 reached its EOL more than 5 months ago, so it's about time to target the library to Node 10. If you used lower version, you'll have to upgrade to v10, but we suggest using the latest LTS version.

## WaitFor API changes

`waitForElement` function has been renamed to `waitFor` for consistency with React Testing Library. Additionally the signature has slightly changed from:

```jsx
export default function waitForElement<T>(
  expectation: () => T,
  timeout?: number,
  interval?: number
 : Promise<T> {
```

to:

```jsx
export default function waitFor<T>(
  expectation: () => T,
  {
    timeout?: number,
    interval?: number
  }
): Promise<T> {
```

Both changes should improve code readibility.

:::note
Please note that in many cases `waitFor` call can be replaced by proper use of `findBy` asynchonous queries resulting in more streamlined test code.
:::

## Removed global debug functions

Global `debug()` and `shallow()` functions have been removed in favor of `debug()` method returned from `render()` function.

## Removed functions

Following query fuctions have been removed after being deprecated:

- `getByName`
- `getAllByName`
- `queryByName`
- `queryAllByName`

Following query functions are still available but have been prefixed with `UNSAFE_`:

- `UNSAFE_getByType`
- `UNSAFE_getAllByType`
- `UNSAFE_queryByType`
- `UNSAFE_queryAllByType`
- `UNSAFE_getByProps`
- `UNSAFE_getAllByProps`
- `UNSAFE_queryByProps`
- `UNSAFE_queryAllByProps`

## Some `byTestId` queries behavior changes

In version `1.x` `getByTestId` and `queryByTestId` could return non-native elements in tests. This was in contrast with other query functions: `getAllByTestId`, `queryAllByTestId`, `findByTestId` and `findAllByTestId` which returned only elements that would be rendered to native components (e.g. `View`, `Text`, etc).

If you relied on setting `testID` for your custom components, you should probably set them on the root element of the returned JSX.

:::caution
In general, you should avoid `byTestId` queries when possible and rather use queries that check things that can been seen by the user (e.g. `byText`, `byPlaceholder`, etc) or accessability queries (e.g. `byA11yHint`, `byA11yLabel`, etc).
:::
