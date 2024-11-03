import { HostComponent } from 'universal-test-renderer';
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

export function matchAccessibilityState(node: HostComponent, matcher: AccessibilityStateMatcher) {
  if (matcher.busy !== undefined && matcher.busy !== computeAriaBusy(node)) {
    return false;
  }
  if (matcher.checked !== undefined && matcher.checked !== computeAriaChecked(node)) {
    return false;
  }
  if (matcher.disabled !== undefined && matcher.disabled !== computeAriaDisabled(node)) {
    return false;
  }
  if (matcher.expanded !== undefined && matcher.expanded !== computeAriaExpanded(node)) {
    return false;
  }
  if (matcher.selected !== undefined && matcher.selected !== computeAriaSelected(node)) {
    return false;
  }

  return true;
}
