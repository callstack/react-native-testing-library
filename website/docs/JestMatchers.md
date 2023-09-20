---
id: jest-matchers
title: Jest Matchers
---

# Element Existence

## `toBeOnTheScreen()`

```ts
expect(element).toBeOnTheScreen()
```

This allows you to assert whether element is in the element tree or not.

:::note
This matchers requires element to be attached to the element tree. This might be useful if your holding a reference to an element and the element gets unmounted during the test.
:::

# Element State

## `toHaveTextContent()`

```ts
expect(element).toHaveTextContent(text: TextMatch, options?: TextMatchOptions)
```

This allows you to assert whether the given element has a text content or not. It accepts either `string` or `RegExp` matchers, as well as `TextMatchOptions`.

When `text` parameter is `undefined` it will only check for existence of text content, and when `text` is defined it will check if the actual text content matches passed value.

## `toHaveDisplayValue()`

```ts
expect(element).toHaveDisplayValue(value: TextMatch, options?: TextMatchOptions)
```

This allows you to assert whether the given `TextInput` element has specified display value. It accepts either `string` or `RegExp` matchers, as well as `TextMatchOptions`.

## `toHaveAccessibleValue()`

```ts
expect(element).toHaveAccessibleValue(...)
```

This allows you to assert whether the given element has specified accessible value.

## `toBeEnabled()` / `toBeDisabled`

```ts
expect(element).toBeEnabled()
expect(element).toBeDisabled()
```

These allows you to assert whether the given element is enabled or disabled from user's perspective. It relies on accessibility disabled state as set by `aria-disabled` or `accessibilityState.disabled` props. It will considers given element disabled when it or any of its ancestors is disabled.

:::note
This matchers are direct negation of each other, and both are probivided to avoid double negations in your assertions.
:::


## `toBeSelected()`

```ts
expect(element).toBeSelected()
```

This allows you to assert whether the given element is selected from user's perspective. It relies on accessibility selected state as set by `aria-selected` or `accessibilityState.selected` props.


## `toBeChecked()` / `toBePartiallyChecked()`

```ts
expect(element).toBeChecked()
expect(element).toBePartiallyChecked()
```

These allows you to assert whether the given element is checked or partially checked from user's perspective. It relies on accessibility checked state as set by `aria-checked` or `accessibilityState.checked` props.

:::note
* `toBeChecked()` matcher works only on elements with `checkbox` or `radio` role.
* `toBePartiallyChecked()` matchers works only on elements with `checkbox` role.
:::

## `toBeExpanded()` /  `toBeCollapsed()`

```ts
expect(element).toBeExpanded()
expect(element).toBeCollapsed()
```

These allows you to assert whether the given element is expanded or collapsed from user's perspective. It relies on accessibility disabled state as set by `aria-expanded` or `accessibilityState.expanded` props.

:::note
This matchers are direct negation of each other for expandable elements (elements with explicit `aria-expanded` or `accessibilityState.expanded` props). However, both with fail for non-expandable elements (ones without explicit `aria-expanded` or `accessibilityState.expanded` props).
:::


## `toBeBusy()`

```ts
expect(element).toBeBusy()
```

This allows you to assert whether the given element is busy from user's perspective. It relies on accessibility selected state as set by `aria-busy` or `accessibilityState.busy` props.

# Element Styles

## `toBeVisible()`

```ts
expect(element).toBeVisible()
```

This allows you to assert whether the given element is visible from user's perspective. 

The element is considered invisibile when it or any of its ancestors has `display: none` or `opacity: 0` styles, as well as when it's hidden from accessbility.

## `toHaveStyle()`

```ts
expect(element).toHaveStyle(style: StyleProp<Style>)
```

This allows you to assert whether the given element has given styles. 


# Other

## `toBeEmptyElement()`

```ts
expect(element).toBeEmptyElement()
```

This allows you to assert whether the given element does not have any host child elements nor text content.


## `toContainElement()`

```ts
expect(container).toContainElement(element: ReactTestInstance | null)
```

This allows you to assert whether the given container element does contain another host element.

## `toHaveProp()`

```ts
expect(element).toHaveProp(name: string, value?: unknown)
```

This allows you to assert whether the given element has a given prop. When `value` parameter is `undefined` it will only check for existence of prop, and when `value` is defined it will check if the actual value matches passed value.

:::note
This matchers should be treated as escape hatch to be used when all other matchers are not suitable.
:::