import type { TestInstance } from 'test-renderer';

import {
  computeAriaBusy,
  computeAriaChecked,
  computeAriaDisabled,
  computeAriaExpanded,
  computeAriaSelected,
} from '../accessibility';

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

export function matchAccessibilityState(instance: TestInstance, matcher: AccessibilityStateMatcher) {
  if (matcher.busy !== undefined && matcher.busy !== computeAriaBusy(instance)) {
    return false;
  }
  if (matcher.checked !== undefined && matcher.checked !== computeAriaChecked(instance)) {
    return false;
  }
  if (matcher.disabled !== undefined && matcher.disabled !== computeAriaDisabled(instance)) {
    return false;
  }
  if (matcher.expanded !== undefined && matcher.expanded !== computeAriaExpanded(instance)) {
    return false;
  }
  if (matcher.selected !== undefined && matcher.selected !== computeAriaSelected(instance)) {
    return false;
  }

  return true;
}
