# Jest matchers

This guide describes built-in Jest matchers. These matchers provide readable assertions with accessibility support.

## Setup

No setup needed. Matchers are available when you import from `@testing-library/react-native`.

## Migration from legacy Jest Native matchers

If you use legacy Jest Native matchers, see the [migration guide](/react-native-testing-library/docs/migration/jest-matchers.md).

## Checking element existence

### `toBeOnTheScreen()`

```ts
expect(element).toBeOnTheScreen();
```

Checks if an element is attached to the element tree. If a referenced element gets unmounted during the test, this assertion fails.

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

Checks if the element has the specified text content. Accepts `string` or `RegExp`, with optional [text match options](/react-native-testing-library/docs/api/queries.md#text-match-options) `exact` and `normalizer`.

### `toContainElement()`

```ts
expect(container).toContainElement(
  element: ReactTestInstance | null,
)
```

Checks if a container element contains another element.

### `toBeEmptyElement()`

```ts
expect(element).toBeEmptyElement();
```

Checks if the element has no child elements or text content.

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

Checks if a `TextInput` has the specified display value. Accepts `string` or `RegExp`, with optional [text match options](/react-native-testing-library/docs/api/queries.md#text-match-options) `exact` and `normalizer`.

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

Checks if the element has a specified accessible value.

Reads from `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`, and `accessibilityValue` props. Only the values you specify are checked, so the element can have other accessibility value entries and still match.

For the `text` entry, you can use `string` or `RegExp`.

### `toBeEnabled()` / `toBeDisabled` \{#tobeenabled}

```ts
expect(element).toBeEnabled();
expect(element).toBeDisabled();
```

Checks if the element is enabled or disabled based on `aria-disabled` or `accessibilityState.disabled` props. An element is disabled when it or any ancestor is disabled.

:::note
These matchers are opposites. Both are provided to avoid double negations in assertions.
:::

### `toBeSelected()`

```ts
expect(element).toBeSelected();
```

Checks if the element is selected based on `aria-selected` or `accessibilityState.selected` props.

### `toBeChecked()` / `toBePartiallyChecked()` \{#tobechecked}

```ts
expect(element).toBeChecked();
expect(element).toBePartiallyChecked();
```

Checks if the element is checked or partially checked based on `aria-checked` or `accessibilityState.checked` props.

:::note

- `toBeChecked()` works only on `Switch` elements and elements with `checkbox`, `radio`, or `switch` role.
- `toBePartiallyChecked()` works only on elements with `checkbox` role.

:::

### `toBeExpanded()` / `toBeCollapsed()` \{#tobeexpanded}

```ts
expect(element).toBeExpanded();
expect(element).toBeCollapsed();
```

Checks if the element is expanded or collapsed based on `aria-expanded` or `accessibilityState.expanded` props.

:::note
These matchers are opposites for expandable elements (those with explicit `aria-expanded` or `accessibilityState.expanded` props). For non-expandable elements, neither matcher passes.
:::

### `toBeBusy()`

```ts
expect(element).toBeBusy();
```

Checks if the element is busy based on `aria-busy` or `accessibilityState.busy` props.

## Checking element style

### `toBeVisible()`

```ts
expect(element).toBeVisible();
```

Checks if the element is visible.

An element is invisible when it or any ancestor has `display: none` or `opacity: 0` styles, or when it's hidden from accessibility.

### `toHaveStyle()`

```ts
expect(element).toHaveStyle(
  style: StyleProp<Style>,
)
```

Checks if the element has specific styles.

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

Checks if the element has the specified accessible name. Accepts `string` or `RegExp`, with optional [text match options](/react-native-testing-library/docs/api/queries.md#text-match-options) `exact` and `normalizer`.

The accessible name comes from `aria-labelledby`, `accessibilityLabelledBy`, `aria-label`, and `accessibilityLabel` props. If none are present, the element's text content is used.

Without a `name` parameter (or with `undefined`), it only checks if the element has any accessible name.

### `toHaveProp()`

```ts
expect(element).toHaveProp(
  name: string,
  value?: unknown,
)
```

Checks if the element has a prop. Without a `value` (or with `undefined`), it only checks if the prop exists. With a `value`, it checks if the prop's value matches.

:::note
Use this matcher as a last resort when other matchers don't fit your needs.
:::
