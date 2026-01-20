# Jest matchers

This guide covers the built-in Jest matchers. These matchers make your tests easier to read and work better with accessibility features.

## Setup

No setup needed. Matchers are available when you import from `@testing-library/react-native`.

## Checking element existence

### `toBeOnTheScreen()`

```ts
expect(element).toBeOnTheScreen();
```

Checks if an element is attached to the element tree. If you have a reference to an element and it gets unmounted during the test, this assertion will fail.

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

Checks if an element has the specified text content. Accepts `string` or `RegExp`, with optional [text match options](/react-native-testing-library/14.x/docs/api/queries.md#text-match-options) like `exact` and `normalizer`.

### `toContainElement()`

```ts
expect(container).toContainElement(
  element: HostElement | null,
)
```

Checks if a container element contains another element.

### `toBeEmptyElement()`

```ts
expect(element).toBeEmptyElement();
```

Checks if an element has no child elements or text content.

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

Checks if a `TextInput` has the specified display value. Accepts `string` or `RegExp`, with optional [text match options](/react-native-testing-library/14.x/docs/api/queries.md#text-match-options) like `exact` and `normalizer`.

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

Checks if an element has the specified accessible value.

The matcher reads accessibility values from `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`, and `accessibilityValue` props. It only checks the values you specify, so the element can have other accessibility value entries and still match.

For the `text` entry, you can use a string or `RegExp`.

### `toBeEnabled()` / `toBeDisabled` \{#tobeenabled}

```ts
expect(element).toBeEnabled();
expect(element).toBeDisabled();
```

Checks if an element is enabled or disabled from `aria-disabled` or `accessibilityState.disabled` props. An element is disabled if it or any ancestor is disabled.

:::note
These matchers are opposites. Both are available so you can avoid double negations like `expect(element).not.toBeDisabled()`.
:::

### `toBeSelected()`

```ts
expect(element).toBeSelected();
```

Checks if an element is selected from `aria-selected` or `accessibilityState.selected` props.

### `toBeChecked()` / `toBePartiallyChecked()` \{#tobechecked}

```ts
expect(element).toBeChecked();
expect(element).toBePartiallyChecked();
```

Checks if an element is checked or partially checked from `aria-checked` or `accessibilityState.checked` props.

:::note

- `toBeChecked()` only works on `Switch` host elements and elements with `checkbox`, `radio`, or `switch` role.
- `toBePartiallyChecked()` only works on elements with `checkbox` role.

:::

### `toBeExpanded()` / `toBeCollapsed()` \{#tobeexpanded}

```ts
expect(element).toBeExpanded();
expect(element).toBeCollapsed();
```

Checks if an element is expanded or collapsed from `aria-expanded` or `accessibilityState.expanded` props.

:::note
These matchers are opposites for expandable elements (those with explicit `aria-expanded` or `accessibilityState.expanded` props). For non-expandable elements, neither matcher will pass.
:::

### `toBeBusy()`

```ts
expect(element).toBeBusy();
```

Checks if an element is busy from `aria-busy` or `accessibilityState.busy` props.

## Checking element style

### `toBeVisible()`

```ts
expect(element).toBeVisible();
```

Checks if an element is visible.

An element is invisible if it or any ancestor has `display: none` or `opacity: 0` styles, or if it's hidden from accessibility.

### `toHaveStyle()`

```ts
expect(element).toHaveStyle(
  style: StyleProp<Style>,
)
```

Checks if an element has specific styles.

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

Checks if an element has the specified accessible name. Accepts `string` or `RegExp`, with optional [text match options](/react-native-testing-library/14.x/docs/api/queries.md#text-match-options) like `exact` and `normalizer`.

The accessible name comes from `aria-labelledby`, `accessibilityLabelledBy`, `aria-label`, and `accessibilityLabel` props. For `Image` elements, the `alt` prop is also used. If none are present, the element's text content is used.

Without a `name` parameter (or with `undefined`), it only checks whether the element has any accessible name.

### `toHaveProp()`

```ts
expect(element).toHaveProp(
  name: string,
  value?: unknown,
)
```

Checks if an element has a prop. Without a `value` (or with `undefined`), it only checks if the prop exists. With a `value`, it checks if the prop's value matches.

:::note
Use this matcher as a last resort when other matchers don't fit your needs.
:::
