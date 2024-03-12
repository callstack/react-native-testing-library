import { AccessibilityState } from 'react-native';
import { ReactTestInstance } from 'react-test-renderer';
import { accessibilityStateKeys, getAccessibilityState } from '../accessiblity';

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

/**
 * Default accessibility state values based on experiments using accessibility
 * inspector/screen reader on iOS and Android.
 *
 * @see https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State
 */
const defaultState: AccessibilityState = {
  disabled: false,
  selected: false,
  checked: undefined,
  busy: false,
  expanded: undefined,
};

export function matchAccessibilityState(
  node: ReactTestInstance,
  matcher: AccessibilityStateMatcher,
) {
  const state = getAccessibilityState(node);
  return accessibilityStateKeys.every((key) => matchState(matcher, state, key));
}

function matchState(
  matcher: AccessibilityStateMatcher,
  state: AccessibilityState | undefined,
  key: keyof AccessibilityState,
) {
  return matcher[key] === undefined || matcher[key] === (state?.[key] ?? defaultState[key]);
}
