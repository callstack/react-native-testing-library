---
id: migration-jest-native
title: Migration from Jest Native matchers
---

This guide describes the steps necessary to migrate from [legacy Jest Native matchers v5](https://github.com/testing-library/jest-native) to [built-in Jest matchers](jest-matchers).

import TOCInline from '@theme/TOCInline';

<TOCInline toc={toc} />

## General notes

All of the built-in Jest matchers provided by the React Native Testing Library support only host elements. This should not be an issue, as all RNTL v12 queries already return only host elements. When this guide states that a given matcher should work the same it assumes behavior only host elements. If you need to assert the status of composite elements use Jest Native matchers in [legacy mode](#gradual-migration).

## Usage

You can use the built-in matchers by adding the following line to your `jest-setup.ts` file (configured using [`setupFilesAfterEnv`](https://jestjs.io/docs/configuration#setupfilesafterenv-array)):

```ts
import '@testing-library/react-native/extend-expect';
```

### Gradual migration

You can use the built-in matchers alongside legacy Jest Native matchers by changing their import in your `jest-setup.ts` file:

```ts
// Replace this:
// import '@testing-library/jest-native/extend-expect';

// With this:
import '@testing-library/react-native/extend-expect';
import '@testing-library/jest-native/legacy-extend-expect';
```

In this case legacy matchers will be available using the `legacy_` prefix, e.g.:

```ts
expect(element).legacy_toHaveAccessibilityState({ busy: true });
```

## Migration details

### Matchers not requiring changes

The following matchers should work the same:

- [`toBeEmptyElement()`](jest-matchers#tobeemptyelement)
- [`toBeEnabled()` / `toBeDisabled()`](jest-matchers#tobeenabled)
- [`toBeOnTheScreen()`](jest-matchers#tobeonthescreen)
- [`toBeVisible()`](jest-matchers#tobevisible)
- [`toContainElement()`](jest-matchers#tocontainelement)
- [`toHaveAccessibilityValue()`](jest-matchers#tohaveaccessibilityvalue)
- [`toHaveDisplayValue()`](jest-matchers#tohavedisplayvalue)
- [`toHaveProp()`](jest-matchers#tohaveprop)
- [`toHaveStyle()`](jest-matchers#tohavestyle)
- [`toHaveTextContent()`](jest-matchers#tohavetextcontent)

### Replaced matchers

The `toHaveAccessibilityState()` matcher has been replaced by the following matchers:

- enabled state: [`toBeEnabled()` / `toBeDisabled()`](jest-matchers#tobeenabled)
- checked state: [`toBeChecked()` / `toBePartiallyChecked()`](jest-matchers#tobechecked)
- selected state: [`toBeSelected()`](jest-matchers#tobeselected)
- expanded state: [`toBeExpanded()` / `toBeCollapsed()`](jest-matchers#tobeexpanded)
- busy state: [`toBeBusy()`](jest-matchers#tobebusy)

The new matchers support both `accessibilityState` and `aria-*` props.

### Added matchers

New [`toHaveAccessibleName()`](jest-matchers#tohaveaccessiblename) has been added.

### Noteworthy details

You should be aware of the following details:

- [`toBeEnabled()` / `toBeDisabled()`](jest-matchers#tobeenabled) matchers also check the disabled state for the element's ancestors and not only the element itself. This is the same as in legacy Jest Native matchers of the same name but differs from the removed `toHaveAccessibilityState()` matcher.
- [`toBeChecked()`](jest-matchers#tobechecked) matcher supports only elements with a `checkbox` or `radio` role
- [`toBePartiallyChecked()`](jest-matchers#tobechecked) matcher supports only elements with `checkbox` role
