---
id: jest-matchers
title: Jest Matchers
---

:::note
Built-in Jest matchers require RNTL v12.4.0 or later.
:::

This guide describes built-in Jest matchers, we recommend using these matchers as they provide more readable tests, better accessibility support and better developer experience.

If you are already using legacy Jest Native matchers we have a [migration guide](migration-jest-native) for moving to the built-in matchers.

import TOCInline from '@theme/TOCInline';

<TOCInline toc={toc} />

## Element Existence

### `toBeOnTheScreen()`

```ts
expect(element).toBeOnTheScreen()
```

This allows you to assert whether element is attached to the element tree or not. If you hold a reference to an element and it gets unmounted during the test it will no longer pass this assertion.

## Element Content

### `toHaveTextContent()`

```ts
expect(element).toHaveTextContent(t
  text: string | RegExp,
  options?: {
    exact?: boolean;
    normalizer?: (text: string) => string;
  },
)
```

This allows you to assert whether the given element has a text content or not. It accepts either `string` or `RegExp` matchers, as well as [text match options](Queries.md#text-match-options) of `exact` and `normalizer`.

When `text` parameter is `undefined` it will only check for existence of text content, and when `text` is defined it will check if the actual text content matches passed value.

### `toContainElement()`

```ts
expect(container).toContainElement(
  element: ReactTestInstance | null,
)
```

This allows you to assert whether the given container element does contain another host element.

### `toBeEmptyElement()`

```ts
expect(element).toBeEmptyElement()
```

This allows you to assert whether the given element does not have any host child elements nor text content.





## Element State

### `toHaveDisplayValue()`

```ts
expect(element).toHaveDisplayValue(
  value: string | RegExp,
  options?: {
    exact?: boolean;
    normalizer?: (text: string) => string;
  },
)
```

This allows you to assert whether the given `TextInput` element has specified display value. It accepts either `string` or `RegExp` matchers, as well as [text match options](Queries.md#text-match-options) of `exact` and `normalizer`.

### `toHaveAccessibilityValue()`

```ts
expect(element).toHaveAccessibilityValue(
  value: {
    min?: number;
    max?: number;
    now?: number;
    text?: string | RegExp;
  },
)
```

This allows you to assert whether the given element has specified accessible value.

This matcher will assert accessibility value based on `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` and `accessibilityValue` props. Only defined value entires will be used in the assertion,  the element might have additional accessibility value entries and still be matched.

When querying by `text` entry a string or `RegExp` might be used.


### `toBeEnabled()` / `toBeDisabled` {#tobeenabled}

```ts
expect(element).toBeEnabled()
expect(element).toBeDisabled()
```

These allows you to assert whether the given element is enabled or disabled from user's perspective. It relies on accessibility disabled state as set by `aria-disabled` or `accessibilityState.disabled` props. It will considers given element disabled when it or any of its ancestors is disabled.

:::note
This matchers are negation of each other, and both are provided to avoid double negations in your assertions.
:::


### `toBeSelected()`

```ts
expect(element).toBeSelected()
```

This allows you to assert whether the given element is selected from user's perspective. It relies on accessibility selected state as set by `aria-selected` or `accessibilityState.selected` props.


### `toBeChecked()` / `toBePartiallyChecked()` {#tobechecked}

```ts
expect(element).toBeChecked()
expect(element).toBePartiallyChecked()
```

These allows you to assert whether the given element is checked or partially checked from user's perspective. It relies on accessibility checked state as set by `aria-checked` or `accessibilityState.checked` props.

:::note
* `toBeChecked()` matcher works only on elements with `checkbox` or `radio` role.
* `toBePartiallyChecked()` matchers works only on elements with `checkbox` role.
:::

### `toBeExpanded()` /  `toBeCollapsed()` {#tobeexpanded}

```ts
expect(element).toBeExpanded()
expect(element).toBeCollapsed()
```

These allows you to assert whether the given element is expanded or collapsed from user's perspective. It relies on accessibility disabled state as set by `aria-expanded` or `accessibilityState.expanded` props.

:::note
This matchers are negation of each other for expandable elements (elements with explicit `aria-expanded` or `accessibilityState.expanded` props). However, both won't pass for non-expandable elements (ones without explicit `aria-expanded` or `accessibilityState.expanded` props).
:::


### `toBeBusy()`

```ts
expect(element).toBeBusy()
```

This allows you to assert whether the given element is busy from user's perspective. It relies on accessibility selected state as set by `aria-busy` or `accessibilityState.busy` props.

## Element Styles

### `toBeVisible()`

```ts
expect(element).toBeVisible()
```

This allows you to assert whether the given element is visible from user's perspective. 

The element is considered invisibile when it or any of its ancestors has `display: none` or `opacity: 0` styles, as well as when it's hidden from accessbility.

### `toHaveStyle()`

```ts
expect(element).toHaveStyle(
  style: StyleProp<Style>,
)
```

This allows you to assert whether the given element has given styles. 

## Other

### `toHaveAccessibleName()`

```ts
expect(element).toHaveAccessibleName(
  name?: string | RegExp,
  options?: {
    exact?: boolean;
    normalizer?: (text: string) => string;
  },
)
```

This allows you to assert whether the given element has specified accessible name. It accepts either `string` or `RegExp` matchers, as well as [text match options](Queries.md#text-match-options) of `exact` and `normalizer`.

Accessible name will be computed based on `aria-labelledby`, `accessibilityLabelledBy`, `aria-label`, `accessibilityLabel` props, in the absence of these props, element text content will be used.

When `name` parameter is `undefined` it will only check if element has any accessible name.

### `toHaveProp()`

```ts
expect(element).toHaveProp(
  name: string,
  value?: unknown,
)
```

This allows you to assert whether the given element has a given prop. When `value` parameter is `undefined` it will only check for existence of prop, and when `value` is defined it will check if the actual value matches passed value.

:::note
This matchers should be treated as escape hatch to be used when all other matchers are not suitable.
:::