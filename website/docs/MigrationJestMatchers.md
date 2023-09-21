---
id: migration-jest-native
title: Migration from Jest Native matchers
---

This guide describes steps necessary to migrate from [legacy Jest Native matchers](https://github.com/testing-library/jest-native) `v5` to [built-in Jest matchers](JestMatchers.md). 

import TOCInline from '@theme/TOCInline';

<TOCInline toc={toc} />

## General notes

All of built-in Jest matchers provided by React Native Testing Library are supporting only host elements. This should not be an issue, as all RNTL v12 queries already return only host elements. When this guide states that given matcher should work the same it assumes behavior only only host elements. If you need to assert status of composite elements use Jest Native matchers in [legacy mode](#gradual-migration).

## Usage 

You can use the built-in matchers by adding following line to your `jest-setup.ts` file:

```ts
import '@testing-library/react-native/extend-expect';
```

### Gradual migration

You can use the built-in matchers alongside with legacy Jest Native matchers by chaning their import in your `jest-setup.ts` file:

```ts
// Replace this:
// import '@testing-library/jest-native/extend-expect';

// With this:
import '@testing-library/react-native/extend-expect';
import '@testing-library/jest-native/legacy-extend-expect';
```

In such case legacy matchers will be available using `legacy_` prefix, e.g.:

```ts
expect(element).legacy_toHaveAccessibilityState({ busy: true });
```

## Migration details

### Matchers not requiring changes

Following matchers should work the same:
* [`toBeEmptyElement()`](JestMatchers.md#tobeemptyelement)
* [`toBeEnabled()` / `toBeDisabled()`](JestMatchers.md#tobeenabled)
* [`toBeOnTheScreen()`](JestMatchers.md#tobeonthescreen)
* [`toBeVisible()`](JestMatchers.md#tobevisible)
* [`toContainElement()`](JestMatchers.md#tocontainelement)
* [`toHaveDisplayValue()`](JestMatchers.md#tohavedisplayvalue)
* [`toHaveProp()`](JestMatchers.md#tohaveprop)
* [`toHaveStyle()`](JestMatchers.md#tohavestyle)
* [`toHaveTextContent()`](JestMatchers.md#tohavetextcontent)
  
### Renamed matchers

`toHaveAccessibilityValue()` matcher has been renamed to [`toHaveAccessibleValue()`](JestMatchers.md#tohaveaccessiblevalue) but otherwise should work the same.

### Removed matchers

`toHaveAccessibilityState()` matcher has been replaced by following matchers:
* enabled state: [`toBeEnabled()` / `toBeDisabled()`](JestMatchers.md#tobeenabled)
* checked state: [`toBeChecked()` / `toBePartiallyChecked()`](JestMatchers.md#tobechecked)
* selected state: [`toBeSelected()`](JestMatchers.md#tobeselected)
* expanded state: [`toBeExpanded()` / `toBeCollapsed()`](JestMatchers.md#tobeexpanded)
* busy state: [`toBeBusy()`](JestMatchers.md#tobebusy)

The new matchers support both `accessbililityState` and `aria-*` props.

You should be aware of following changes:
* [`toBeEnabled()` / `toBeDisabled()`](JestMatchers.md#tobeenabled) matchers also check the disabled state for element ancestors and not only the element itself
* [`toBeChecked()`](JestMatchers.md#tobechecked) matcher supports only elements with `checkbox` or `radio` role
* [`toBePartiallyChecked()`](JestMatchers.md#tobechecked) matchers supports only elements with `checkbox` role
