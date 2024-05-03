id: migration-v13
title: Migration to 13.0

---

import TOCInline from '@theme/TOCInline';

Migration to React Native Testing Library version 13 from version 12.x.

<TOCInline toc={toc} />

# Breaking changes

## Supported React and React Native versions

This version supports only React 19 and corresponding React Native versions. If you use React 18 or 19, please use latest of v12 versions.

[Note: at the moment there is no React Native for React 19, and React 19 is still in beta, so we use React 18.3 for the time being].

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

## Removed `debug.shallow`

For a time being we didn't support shallow rendering. Now we are removing the last remains of it: `debug.shallow()`. If you are interested in shallow rendering see [here](migration-v2#removed-global-shallow-function).

# Other changes

## Updated `flushMicroTasks` internal method

# This should not break any tests.

## Full Changelog

https://github.com/callstack/react-native-testing-library/compare/v12.5.0...v13.0.0
