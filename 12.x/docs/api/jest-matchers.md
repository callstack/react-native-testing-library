# Jest matchers

:::info RNTL minimal version

Built-in Jest matchers require RNTL v12.4.0 or later.

:::

This guide describes built-in Jest matchers, we recommend using these matchers as they provide readable tests, accessibility support, and a better developer experience.

## Setup

You can use the built-in matchers by adding the following line to your `jest-setup.ts` file (configured using [`setupFilesAfterEnv`](https://jestjs.io/docs/configuration#setupfilesafterenv-array)):

```ts title=jest-setup.ts
import '@testing-library/react-native/extend-expect';
```

Alternatively, you can add above script to your Jest configuration (usually located either in the `jest.config.js` file or in the `package.json` file under the `"jest"` key):

```json title=jest.config.js
{
  "preset": "react-native",
  "setupFilesAfterEnv": ["@testing-library/react-native/extend-expect"]
}
```

## Migration from legacy Jest Native matchers.

If you are already using legacy Jest Native matchers we have a [migration guide](/react-native-testing-library/12.x/docs/migration/jest-matchers.md) for moving to the built-in matchers.

## Checking element existence

### `toBeOnTheScreen()`

```ts
expect(element).toBeOnTheScreen();
```

This allows you to assert whether an element is attached to the element tree or not. If you hold a reference to an element and it gets unmounted during the test it will no longer pass this assertion.

## Element Content

### `toHaveTextContent()`

```ts
expect(element).toHaveTextContent(
  text: string | RegExp,
  options?: {
    exact?: boolean;
    normalizer?: (text: string) => string;
  },
)
```

This allows you to assert whether the given element has the given text content or not. It accepts either `string` or `RegExp` matchers, as well as [text match options](/react-native-testing-library/12.x/docs/api/queries.md#text-match-options) of `exact` and `normalizer`.

### `toContainElement()`

```ts
expect(container).toContainElement(
  element: ReactTestInstance | null,
)
```

This allows you to assert whether the given container element does contain another host element.

### `toBeEmptyElement()`

```ts
expect(element).toBeEmptyElement();
```

This allows you to assert whether the given element does not have any host child elements or text content.

## Checking element state

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

This allows you to assert whether the given `TextInput` element has a specified display value. It accepts either `string` or `RegExp` matchers, as well as [text match options](/react-native-testing-library/12.x/docs/api/queries.md#text-match-options) of `exact` and `normalizer`.

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

This allows you to assert whether the given element has a specified accessible value.

This matcher will assert accessibility value based on `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` and `accessibilityValue` props. Only defined value entries will be used in the assertion, the element might have additional accessibility value entries and still be matched.

When querying by `text` entry a string or `RegExp` might be used.

### `toBeEnabled()` / `toBeDisabled` \{#tobeenabled}

```ts
expect(element).toBeEnabled();
expect(element).toBeDisabled();
```

These allow you to assert whether the given element is enabled or disabled from the user's perspective. It relies on the accessibility disabled state as set by `aria-disabled` or `accessibilityState.disabled` props. It will consider a given element disabled when it or any of its ancestors is disabled.

:::note
These matchers are the negation of each other, and both are provided to avoid double negations in your assertions.
:::

### `toBeSelected()`

```ts
expect(element).toBeSelected();
```

This allows you to assert whether the given element is selected from the user's perspective. It relies on the accessibility selected state as set by `aria-selected` or `accessibilityState.selected` props.

### `toBeChecked()` / `toBePartiallyChecked()` \{#tobechecked}

```ts
expect(element).toBeChecked();
expect(element).toBePartiallyChecked();
```

These allow you to assert whether the given element is checked or partially checked from the user's perspective. It relies on the accessibility checked state as set by `aria-checked` or `accessibilityState.checked` props.

:::note

- `toBeChecked()` matcher works only on `Switch` host elements and accessibility elements with `checkbox`, `radio` or `switch` role.
- `toBePartiallyChecked()` matcher works only on elements with `checkbox` role.

:::

### `toBeExpanded()` / `toBeCollapsed()` \{#tobeexpanded}

```ts
expect(element).toBeExpanded();
expect(element).toBeCollapsed();
```

These allows you to assert whether the given element is expanded or collapsed from the user's perspective. It relies on the accessibility disabled state as set by `aria-expanded` or `accessibilityState.expanded` props.

:::note
These matchers are the negation of each other for expandable elements (elements with explicit `aria-expanded` or `accessibilityState.expanded` props). However, both won't pass for non-expandable elements (ones without explicit `aria-expanded` or `accessibilityState.expanded` props).
:::

### `toBeBusy()`

```ts
expect(element).toBeBusy();
```

This allows you to assert whether the given element is busy from the user's perspective. It relies on the accessibility selected state as set by `aria-busy` or `accessibilityState.busy` props.

## Checking element style

### `toBeVisible()`

```ts
expect(element).toBeVisible();
```

This allows you to assert whether the given element is visible from the user's perspective.

The element is considered invisible when itself or any of its ancestors has `display: none` or `opacity: 0` styles, as well as when it's hidden from accessibility.

### `toHaveStyle()`

```ts
expect(element).toHaveStyle(
  style: StyleProp<Style>,
)
```

This allows you to assert whether the given element has given styles.

## Other matchers

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

This allows you to assert whether the given element has a specified accessible name. It accepts either `string` or `RegExp` matchers, as well as [text match options](/react-native-testing-library/12.x/docs/api/queries.md#text-match-options) of `exact` and `normalizer`.

The accessible name will be computed based on `aria-labelledby`, `accessibilityLabelledBy`, `aria-label`, and `accessibilityLabel` props, in the absence of these props, the element text content will be used.

When the `name` parameter is `undefined` it will only check if the element has any accessible name.

### `toHaveProp()`

```ts
expect(element).toHaveProp(
  name: string,
  value?: unknown,
)
```

This allows you to assert whether the given element has a given prop. When the `value` parameter is `undefined` it will only check for existence of the prop, and when `value` is defined it will check if the actual value matches passed value.

:::note
This matcher should be treated as an escape hatch to be used when all other matchers are not suitable.
:::
