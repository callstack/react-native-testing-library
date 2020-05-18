---
id: migration20
title: Migration to 2.0
---

This guides describes major steps involved in migrating your testing code from using React Native Testing Library version `1.x` to version `2.0`.

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

## Some `byTestId` queries behavior changes
