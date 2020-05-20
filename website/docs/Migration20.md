---
id: migration-v2
title: Migration to 2.0
---

This guides describes major steps involved in migrating your testing code from using React Native Testing Library version `1.x` to version `2.0`.

## Dropping Node 8

Node 8 reached its EOL more than 5 months ago, so it's about time to target the library to Node 10. If you used lower version, you'll have to upgrade to v10, but we suggest using the latest LTS version.

## Auto Cleanup

`cleanup()` function is now called automatically after every test, if your testing framework supports `afterEach` hook (like Jest, mocha, and Jasmine).

You should be able to safely remove all `afterEach(cleanup)` calls in your code.

This change might break your code, if you tests are not isolated, i.e. you call `render` outside `test` block. Generally, you should [keep your tests isolated](https://kentcdodds.com/blog/test-isolation-with-react), but if you can't or don't want to do this right away you can prevent this behavior using any of the following ways:

1. by importing `'react-native-testing-library/pure'` instead of `'react-native-testing-library'`

2. by importing `'react-native-testing-library/dont-cleanup-after-each'` before importing `'react-native-testing-library'`. You can do it in a global way by using Jest's `setupFiles` like this:

```js
{
  setupFiles: ['react-native-testing-library/dont-cleanup-after-each'];
}
```

3. by setting `RTNL_SKIP_AUTO_CLEANUP` env variable to `true`. You can do this with `cross-evn` like this:

```sh
cross-env RNTL_SKIP_AUTO_CLEANUP=true jest
```

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

## Removed global `debug` function

Global `debug()` function has been removed in favor of `debug()` method returned from `render()` function.

## Removed global `shallow` function

Global `shallow()` functions which has been previously deprecated has been removed.

Shallow rendering React component is usually not a good idea, so we decided to remove the API. However, if you find it useful or need to support legacy tests, feel free to implement it yourself. Here's a sample implementation:

```js
import ShallowRenderer from 'react-test-renderer/shallow';

export function shallow(instance: ReactTestInstance | React.Element<any>) {
  const renderer = new ShallowRenderer();
  renderer.render(React.createElement(instance.type, instance.props));

  return { output: renderer.getRenderOutput() };
}
```

## Removed functions

Following query functions have been removed after being deprecated for more than a year now:

- `getByName`
- `getAllByName`
- `queryByName`
- `queryAllByName`

The `*ByType` and `*ByProps` queries has been prefixed with `UNSAFE_`. You can safely rename them using global search/replace in your project:

- `getByType` -> `UNSAFE_getByType`
- `getAllByType` -> `UNSAFE_getAllByType`
- `queryByType` -> `UNSAFE_queryByType`
- `queryAllByType` -> `UNSAFE_queryAllByType`
- `getByProps` -> `UNSAFE_getByProps`
- `getAllByProps` -> `UNSAFE_getAllByProps`
- `queryByProps` -> `UNSAFE_queryByProps`
- `queryAllByProps` -> `UNSAFE_queryAllByProps`

## Some `byTestId` queries behavior changes

In version `1.x` `getByTestId` and `queryByTestId` could return non-native elements in tests. This was in contrast with other query functions: `getAllByTestId`, `queryAllByTestId`, `findByTestId` and `findAllByTestId` which returned only elements that would be rendered to native components (e.g. `View`, `Text`, etc).

If you relied on setting `testID` for your custom components, you should probably set them on the root element of the returned JSX.

:::caution
In general, you should avoid `byTestId` queries when possible and rather use queries that check things that can been seen by the user (e.g. `byText`, `byPlaceholder`, etc) or accessability queries (e.g. `byA11yHint`, `byA11yLabel`, etc).
:::
