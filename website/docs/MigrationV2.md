---
id: migration-v2
title: Migration to 2.0
---

This guide describes steps necessary to migrate from React Native Testing Library `v1.x` to `v2.0`.

import TOCInline from '@theme/TOCInline';

<TOCInline toc={toc} />

## Dropping Node 8

Node 8 reached its EOL more than 5 months ago, so it's about time to target the library to Node 10. If you used lower version, you'll have to upgrade to v10, but we recommend using the latest LTS version.

## Auto Cleanup

`cleanup()` function is now called automatically after every test if your testing framework supports `afterEach` hook (like Jest, Mocha, and Jasmine).

You should be able to remove all `afterEach(cleanup)` calls in your code.

This change might break your code, if you tests are not isolated, i.e. you call `render` outside `test` block. Generally, you should [keep your tests isolated](https://kentcdodds.com/blog/test-isolation-with-react). But if you can't or don't want to do this right away you can prevent this behavior using any of the following ways:

- by importing `'react-native-testing-library/pure'` instead of `'react-native-testing-library'`
- by importing `'react-native-testing-library/dont-cleanup-after-each'` before importing `'react-native-testing-library'`. You can do it in a global way by using Jest's `setupFiles` like this:

  ```json
  {
    "setupFiles": ["react-native-testing-library/dont-cleanup-after-each"];
  }
  ```

- by setting `RNTL_SKIP_AUTO_CLEANUP` env variable to `true`. You can do this with `cross-evn` like this:

  ```sh
  cross-env RNTL_SKIP_AUTO_CLEANUP=true jest
  ```

## WaitFor API changes

We renamed `waitForElement` function to `waitFor` for consistency with React Testing Library. Additionally, the signature has slightly changed from:

```jsx
export default function waitForElement<T>(
  expectation: () => T,
  timeout?: number,
  interval?: number
): Promise<T> {}
```

to:

```jsx
export default function waitFor<T>(
  expectation: () => T,
  options: {
    timeout?: number,
    interval?: number,
  }
): Promise<T> {}
```

Both changes should improve code readibility.

`waitFor` calls (and hence also `findBy` queries) are now wrapped in `act` by default, so that you should no longer need to use `act` directly in your tests.

:::tip
You can usually avoid `waitFor` by a proper use of `findBy` asynchronous queries. It will result in more streamlined testing experience.
:::

## Removed global `debug` function

The `debug()` method returned from `render()` function is all you need. We removed the global export to avoid confusion.

## Removed global `shallow` function

Shallow rendering React component is usually not a good idea, so we decided to remove the API. But, if you find it useful or need to support legacy tests, feel free to use this implementation:

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

The `*ByType` and `*ByProps` queries has been prefixed with `UNSAFE_`. These `UNSAFE_` functions are not planned for removal in future versions but their usage is discouraged. You can rename them using global search/replace in your project:

- `getByType` -> `UNSAFE_getByType`
- `getAllByType` -> `UNSAFE_getAllByType`
- `queryByType` -> `UNSAFE_queryByType`
- `queryAllByType` -> `UNSAFE_queryAllByType`
- `getByProps` -> `UNSAFE_getByProps`
- `getAllByProps` -> `UNSAFE_getAllByProps`
- `queryByProps` -> `UNSAFE_queryByProps`
- `queryAllByProps` -> `UNSAFE_queryAllByProps`

## Some `ByTestId` queries behavior changes

In version `1.x` the `getByTestId` and `queryByTestId` queries could return non-native instances. This was a serious bug. Other query functions like `getAllByTestId`, `queryAllByTestId`, `findByTestId` and `findAllByTestId` didn't have this issue. These correctly returned only native components instances (e.g. `View`, `Text`, etc) that got the `testID`.

In v2 we fixed this inconsistency, which may result in failing tests, if you relied on this behavior. There are few ways to handle these failures:

- pass the `testID` prop down so it can reach a native component, like `View` or `Text`
- replace `testID` with proper `accessibilityHint` or `accessibilityLabel` if it benefits the user
- use safe queries like `*ByText` or `*ByA11yHint`

## Deprecated `flushMicrotasksQueue`

We have deprecated `flushMicrotasksQueue` and plan to remove it in the next major. We have better alternatives available for helping you write async tests – `findBy` async queries and `waitFor` helper.

If you can't or don't want to migrate your tests, don't worry. You can use the same implementation we have today:

```js
function flushMicrotasksQueue() {
  return new Promise((resolve) => setImmediate(resolve));
}
```
