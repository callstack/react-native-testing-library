# Migration to built-in Jest matchers

This guide describes the steps necessary to migrate from [legacy Jest Native matchers v5](https://github.com/testing-library/jest-native) to [built-in Jest matchers](/react-native-testing-library/docs/api/jest-matchers.md).

## General notes

All of the built-in Jest matchers provided by the React Native Testing Library support only host elements. This should not be an issue, as all RNTL v12 queries already return only host elements. When this guide states that a given matcher should work the same it assumes behavior only host elements. If you need to assert the status of composite elements use Jest Native matchers in [legacy mode](#gradual-migration).

## Usage

There is no need to set up the built-in matchers; they are automatically available in your tests when you import anything from `@testing-library/react-native`, e.g., `render`.

### Gradual migration

You can use the built-in matchers alongside legacy Jest Native matchers by changing their import in your `jest-setup.ts` file:

```ts
// Replace this:
// import '@testing-library/jest-native/extend-expect';

// With this:
import '@testing-library/jest-native/legacy-extend-expect';
```

In this case legacy matchers will be available using the `legacy_` prefix, e.g.:

```ts
expect(element).legacy_toHaveAccessibilityState({ busy: true });
```

## Migration details

### Matchers not requiring changes

The following matchers should work the same:

- [`toBeEmptyElement()`](/react-native-testing-library/docs/api/jest-matchers.md#tobeemptyelement)
- [`toBeEnabled()` / `toBeDisabled()`](/react-native-testing-library/docs/api/jest-matchers.md#tobeenabled)
- [`toBeOnTheScreen()`](/react-native-testing-library/docs/api/jest-matchers.md#tobeonthescreen)
- [`toBeVisible()`](/react-native-testing-library/docs/api/jest-matchers.md#tobevisible)
- [`toContainElement()`](/react-native-testing-library/docs/api/jest-matchers.md#tocontainelement)
- [`toHaveAccessibilityValue()`](/react-native-testing-library/docs/api/jest-matchers.md#tohaveaccessibilityvalue)
- [`toHaveDisplayValue()`](/react-native-testing-library/docs/api/jest-matchers.md#tohavedisplayvalue)
- [`toHaveProp()`](/react-native-testing-library/docs/api/jest-matchers.md#tohaveprop)
- [`toHaveStyle()`](/react-native-testing-library/docs/api/jest-matchers.md#tohavestyle)
- [`toHaveTextContent()`](/react-native-testing-library/docs/api/jest-matchers.md#tohavetextcontent)

### Replaced matchers

The `toHaveAccessibilityState()` matcher has been replaced by the following matchers:

- enabled state: [`toBeEnabled()` / `toBeDisabled()`](/react-native-testing-library/docs/api/jest-matchers.md#tobeenabled)
- checked state: [`toBeChecked()` / `toBePartiallyChecked()`](/react-native-testing-library/docs/api/jest-matchers.md#tobechecked)
- selected state: [`toBeSelected()`](/react-native-testing-library/docs/api/jest-matchers.md#tobeselected)
- expanded state: [`toBeExpanded()` / `toBeCollapsed()`](/react-native-testing-library/docs/api/jest-matchers.md#tobeexpanded)
- busy state: [`toBeBusy()`](/react-native-testing-library/docs/api/jest-matchers.md#tobebusy)

The new matchers support both `accessibilityState` and `aria-*` props.

### Added matchers

New [`toHaveAccessibleName()`](/react-native-testing-library/docs/api/jest-matchers.md#tohaveaccessiblename) has been added.

### Noteworthy details

You should be aware of the following details:

- [`toBeEnabled()` / `toBeDisabled()`](/react-native-testing-library/docs/api/jest-matchers.md#tobeenabled) matchers also check the disabled state for the element's ancestors and not only the element itself. This is the same as in legacy Jest Native matchers of the same name but differs from the removed `toHaveAccessibilityState()` matcher.
- [`toBeChecked()`](/react-native-testing-library/docs/api/jest-matchers.md#tobechecked) matcher supports only elements with a `checkbox`, `radio` and 'switch' role
- [`toBePartiallyChecked()`](/react-native-testing-library/docs/api/jest-matchers.md#tobechecked) matcher supports only elements with `checkbox` role
