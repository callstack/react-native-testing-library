---
id: migration-jest-native
title: Migration from Jest Native matchers
---

This guide describes steps necessary to migrate from [legacy Jest Native matchers v5](https://github.com/testing-library/jest-native) to [built-in Jest matchers](jest-matchers). 

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

You can use the built-in matchers alongside with legacy Jest Native matchers by changing their import in your `jest-setup.ts` file:

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
* [`toBeEmptyElement()`](jest-matchers#tobeemptyelement)
* [`toBeEnabled()` / `toBeDisabled()`](jest-matchers#tobeenabled)
* [`toBeOnTheScreen()`](jest-matchers#tobeonthescreen)
* [`toBeVisible()`](jest-matchers#tobevisible)
* [`toContainElement()`](jest-matchers#tocontainelement)
* [`toHaveAccessibilityValue()`](jest-matchers#tohaveaccessibilityvalue)
* [`toHaveDisplayValue()`](jest-matchers#tohavedisplayvalue)
* [`toHaveProp()`](jest-matchers#tohaveprop)
* [`toHaveStyle()`](jest-matchers#tohavestyle)
* [`toHaveTextContent()`](jest-matchers#tohavetextcontent)
  
### Replaced matchers

`toHaveAccessibilityState()` matcher has been replaced by following matchers:
* enabled state: [`toBeEnabled()` / `toBeDisabled()`](jest-matchers#tobeenabled)
* checked state: [`toBeChecked()` / `toBePartiallyChecked()`](jest-matchers#tobechecked)
* selected state: [`toBeSelected()`](jest-matchers#tobeselected)
* expanded state: [`toBeExpanded()` / `toBeCollapsed()`](jest-matchers#tobeexpanded)
* busy state: [`toBeBusy()`](jest-matchers#tobebusy)

The new matchers support both `accessbililityState` and `aria-*` props.

### Added matchers

New [`toHaveAccessibleName()`](jest-matchers#tohaveaccessiblename) has been added.

### Noteworthy details

You should be aware of following changes:
* [`toBeEnabled()` / `toBeDisabled()`](jest-matchers#tobeenabled) matchers also check the disabled state for element ancestors and not only the element itself
* [`toBeChecked()`](jest-matchers#tobechecked) matcher supports only elements with `checkbox` or `radio` role
* [`toBePartiallyChecked()`](jest-matchers#tobechecked) matchers supports only elements with `checkbox` role
