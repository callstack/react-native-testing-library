# Accessibility Model

RNTL queries and matchers see the tree the way a screen reader would. The rules live in `src/helpers/accessibility.ts`. `*ByRole`, hiding of inaccessible elements, and the accessibility matchers all build on them.

## Key concepts

- **Hidden elements.** Some props and styles hide an element and its subtree from screen readers, for example `aria-hidden`, `display: 'none'`, or a modal sibling. Queries skip hidden elements by default (`includeHiddenElements` changes this).
- **Accessibility elements.** Only some elements are focusable by a screen reader: those with `accessible`, plus a few host components by default. `*ByRole` matches only these.
- **Role.** Comes from `role` or `accessibilityRole`. Host `Text` defaults to `text`.
- **Accessible name.** Comes from a label (`aria-labelledby`, `aria-label`, …) or, if there isn't one, from the element's text content.
- **State and value.** Disabled, checked, selected, busy, expanded, and value. Each has a `computeAria*()` function.

## Guidelines

- **Follow React Native.** Rules should match RN's documented behavior on iOS and Android. Comments in the code link to the RN docs or source. Keep those links, and note when platforms differ.
- **`aria-*` props win** over the older `accessibilityState`, `accessibilityValue` and `accessibilityLabel` props. Support both forms and test both.
- **Use the helpers.** Read accessibility info only through the functions in `src/helpers/accessibility.ts`, not from props directly. This keeps queries and matchers in agreement.
- **Changes are broad.** A rule change affects many queries and matchers at once. Run the full test suite.
