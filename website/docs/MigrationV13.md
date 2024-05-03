## @@ -0,0 +1,20 @@

id: migration-v13
title: Migration to 13.0

---

import TOCInline from '@theme/TOCInline';

Migration to React Native Testing Library version 13 from version 12.x.

<TOCInline toc={toc} />

# Breaking changes

## Removed deprecated \*ByAccessibilityState queries

This deprecated query has been removed as is typically too general to give meaningful results. Use one of the following options:

- [`*ByRole`](#by-role) query with relevant state options: `disabled`, `selected`, `checked`, `expanded` and `busy`
- use built-in Jest matchers to check the state of element found using some other query:
  - enabled state: [`toBeEnabled()` / `toBeDisabled()`](jest-matchers#tobeenabled)
  - checked state: [`toBeChecked()` / `toBePartiallyChecked()`](jest-matchers#tobechecked)
  - selected state: [`toBeSelected()`](jest-matchers#tobeselected)
  - expanded state: [`toBeExpanded()` / `toBeCollapsed()`](jest-matchers#tobeexpanded)
  - busy state: [`toBeBusy()`](jest-matchers#tobebusy)

```ts
// Replace this
const view = screen.getByAccessibilityState({ disabled: true });

// with this (getByRole query)
const view = screen.getByRole('<proper role here>', { disabled: true });

// or this (Jest matcher)
const view = screen.getBy*(...); // Find the element using any query: *ByRole, *ByText, *ByTestId
expect(view).toBeDisabled(); // Assert its accessibility state
```

## Removed deprecated \*ByAccessibilityValue queries

This deprecated query has been removed as is typically too general to give meaningful results. Use one of the following options:

- [`toHaveAccessibilityValue()`](jest-matchers#tohaveaccessibilityvalue) Jest matcher to check the state of element found using some other query
- [`*ByRole`](#by-role) query with `value` option

```ts
// Replace this
const view = screen.getByAccessibilityValue({ now: 50, min: 0, max: 50 });

// with this (getByRole query)
const view = screen.getByRole('<proper role here>', { value: { now: 50, min: 0, max: 50 } });

// or this (Jest matcher)
const view = screen.getBy*(...); // Find the element using any query: *ByRole, *ByText, *ByTestId
expect(view).toHaveAccessibilityValue({ now: 50, min: 0, max: 50 }); // Assert its accessibility value
```

## Full Changelog

https://github.com/callstack/react-native-testing-library/compare/v12.5.0...v13.0.0