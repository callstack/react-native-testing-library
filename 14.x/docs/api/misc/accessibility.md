# Accessibility

## `isHiddenFromAccessibility`

```ts
function isHiddenFromAccessibility(element: HostElement | null): boolean {}
```

Also available as `isInaccessible()` alias for React Testing Library compatibility.

Checks if given element is hidden from assistive technology, e.g. screen readers.

:::note
Like [`isInaccessible`](https://testing-library.com/docs/dom-testing-library/api-accessibility/#isinaccessible) function from DOM Testing Library this function considers both accessibility elements and presentational elements (regular `View`s) to be accessible, unless they are hidden in terms of host platform.

This covers only part of [ARIA notion of Accessibility Tree](https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion), as ARIA excludes both hidden and presentational elements from the Accessibility Tree.
:::

For the scope of this function, element is inaccessible when it, or any of its ancestors, meets any of the following conditions:

- it has `display: none` style
- it has [`aria-hidden`](https://reactnative.dev/docs/accessibility#aria-hidden) prop set to `true`
- it has [`accessibilityElementsHidden`](https://reactnative.dev/docs/accessibility#accessibilityelementshidden-ios) prop set to `true`
- it has [`importantForAccessibility`](https://reactnative.dev/docs/accessibility#importantforaccessibility-android) prop set to `no-hide-descendants`
- it has sibling host element with either [`aria-modal`](https://reactnative.dev/docs/accessibility#aria-modal-ios) or [`accessibilityViewIsModal`](https://reactnative.dev/docs/accessibility#accessibilityviewismodal-ios) prop set to `true`

Specifying `accessible={false}`, `role="none"`, `accessibilityRole="none"`, or `importantForAccessibility="no"` props does not cause the element to become inaccessible.
