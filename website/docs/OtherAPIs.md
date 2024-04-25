---
id: other-apis
title: Other APIs
---

## Configuration

### `configure`

```ts
type Config = {
  asyncUtilTimeout: number;
  defaultHidden: boolean;
  defaultDebugOptions: Partial<DebugOptions>;
};

function configure(options: Partial<Config>) {}
```

#### `asyncUtilTimeout` option

Default timeout, in ms, for async helper functions (`waitFor`, `waitForElementToBeRemoved`) and `findBy*` queries. Defaults to 1000 ms.

#### `defaultIncludeHiddenElements` option

Default value for [includeHiddenElements](Queries.md#includehiddenelements-option) query option for all queries. The default value is set to `false`, so all queries will not match [elements hidden from accessibility](#ishiddenfromaccessibility). This is because the users of the app would not be able to see such elements.

This option is also available as `defaultHidden` alias for compatibility with [React Testing Library](https://testing-library.com/docs/dom-testing-library/api-configuration/#defaulthidden).

#### `defaultDebugOptions` option

Default [debug options](#debug) to be used when calling `debug()`. These default options will be overridden by the ones you specify directly when calling `debug()`.

### `resetToDefaults()`

```ts
function resetToDefaults() {}
```

### Environment variables

#### `RNTL_SKIP_AUTO_CLEANUP`

Set to `true` to disable automatic `cleanup()` after each test. It works the same as importing `react-native-testing-library/dont-cleanup-after-each` or using `react-native-testing-library/pure`.

```shell
$ RNTL_SKIP_AUTO_CLEANUP=true jest
```

#### `RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS`

Set to `true` to disable auto-detection of fake timers. This might be useful in rare cases when you want to use non-Jest fake timers. See [issue #886](https://github.com/callstack/react-native-testing-library/issues/886) for more details.

```shell
$ RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS=true jest
```


## Accessibility

### `isHiddenFromAccessibility`

```ts
function isHiddenFromAccessibility(
  element: ReactTestInstance | null
): boolean {}
```

Also available as `isInaccessible()` alias for React Testing Library compatibility.

Checks if given element is hidden from assistive technology, e.g. screen readers.

:::note
Like [`isInaccessible`](https://testing-library.com/docs/dom-testing-library/api-accessibility/#isinaccessible) function from DOM Testing Library this function considers both accessibility elements and presentational elements (regular `View`s) to be accessible, unless they are hidden in terms of host platform.

This covers only part of [ARIA notion of Accessiblity Tree](https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion), as ARIA excludes both hidden and presentational elements from the Accessibility Tree.
:::

For the scope of this function, element is inaccessible when it, or any of its ancestors, meets any of the following conditions:

- it has `display: none` style
- it has [`aria-hidden`](https://reactnative.dev/docs/accessibility#aria-hidden) prop set to `true`
- it has [`accessibilityElementsHidden`](https://reactnative.dev/docs/accessibility#accessibilityelementshidden-ios) prop set to `true`
- it has [`importantForAccessibility`](https://reactnative.dev/docs/accessibility#importantforaccessibility-android) prop set to `no-hide-descendants`
- it has sibling host element with either [`aria-modal`](https://reactnative.dev/docs/accessibility#aria-modal-ios) or [`accessibilityViewIsModal`](https://reactnative.dev/docs/accessibility#accessibilityviewismodal-ios) prop set to `true`

Specifying `accessible={false}`, `accessiblityRole="none"`, or `importantForAccessibility="no"` props does not cause the element to become inaccessible.
