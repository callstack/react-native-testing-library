import { ReactTestInstance } from 'react-test-renderer';
import {
  getElementCheckedState,
  isElementBusy,
  isElementDisabled,
  isElementExpanded,
  isElementSelected,
} from '../accessiblity';

// This type is the same as AccessibilityState from `react-native` package
// It is re-declared here due to issues with migration from `@types/react-native` to
// built in `react-native` types.
// See: https://github.com/callstack/react-native-testing-library/issues/1351
export interface AccessibilityStateMatcher {
  disabled?: boolean;
  selected?: boolean;
  checked?: boolean | 'mixed';
  busy?: boolean;
  expanded?: boolean;
}

export function matchAccessibilityState(
  node: ReactTestInstance,
  matcher: AccessibilityStateMatcher
) {
  return (
    matchState(matcher.disabled, isElementDisabled(node)) &&
    matchState(matcher.selected, isElementSelected(node)) &&
    matchState(matcher.checked, getElementCheckedState(node)) &&
    matchState(matcher.busy, isElementBusy(node)) &&
    matchState(matcher.expanded, isElementExpanded(node))
  );
}

function matchState(expectedState?: unknown, receivedState?: unknown) {
  return expectedState === undefined || expectedState === receivedState;
}
