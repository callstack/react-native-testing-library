# Accessibility

## Accessible name \{#accessible-name}

The **accessible name** is the text that assistive technologies (like screen readers) announce for an element. It answers the question: _"what would a screen reader call this element?"_. For instance, a button showing a trash icon might have the accessible name `"Delete"`, so a screen reader user knows what it does.

Testing Library uses the accessible name in the [`*ByRole`](/react-native-testing-library/docs/api/queries.md#by-role) queries `name` option and in the [`toHaveAccessibleName()`](/react-native-testing-library/docs/api/jest-matchers.md#tohaveaccessiblename) matcher. Combining a role with an accessible name is a **semantic query**: it finds an element by what it is (`button`) and what it is called (`"Delete"`), rather than by its implementation details. This matches how users experience your UI.

### How the accessible name is computed \{#how-it-is-computed}

The accessible name is the **first** of these sources to produce a non-empty value. The sources are ordered from highest to lowest importance. An explicit accessibility label that the developer assigned always takes precedence, and the element's own text content is only used when no such label is present.

1. **`aria-labelledby` / `accessibilityLabelledBy`**: the [`nativeID`](https://reactnative.dev/docs/view#nativeid) (or array of IDs) of other elements, whose text content is joined with spaces in the referenced order.
2. **`aria-label` / `accessibilityLabel`**: an explicit label string on the element.
3. **`alt`** (`Image` only): the image's alternative text.
4. **`placeholder`** (`TextInput` only).
5. **Text content**: the element's own text, collected recursively from its children (see [Text content](#text-content) below). This is the fallback when none of the label sources above are set.

### Text content \{#text-content}

When falling back to text content, child text is joined as follows:

- Adjacent inline text (directly inside `Text` elements) is concatenated **without** a separator, matching how it renders on screen.
- Text from separate, non-inline elements, such as sibling `View`s, is joined with a **single space**.

For example:

```jsx
render(
  <Pressable accessibilityRole="button">
    <Text>Hello</Text>
    <Text> World</Text>
  </Pressable>,
);
// Accessible name: "Hello World"
```

### Examples \{#accessible-name-examples}

```jsx
// Explicit label wins over text content
<Pressable accessibilityRole="button" accessibilityLabel="Close dialog">
  <Text>X</Text>
</Pressable>
// Accessible name: "Close dialog"

// Text content is used when no explicit label is set
<Pressable accessibilityRole="button">
  <Text>Submit</Text>
</Pressable>
// Accessible name: "Submit"
```

## `isHiddenFromAccessibility`

```ts
function isHiddenFromAccessibility(instance: TestInstance | null): boolean {}
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
