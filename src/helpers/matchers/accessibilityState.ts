import { AccessibilityState } from 'react-native';
import { ReactTestInstance } from 'react-test-renderer';
import { accessibilityStateKeys } from '../accessiblity';

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
  matcher: AccessibilityState
) {
  const state = node.props.accessibilityState;
  return accessibilityStateKeys.every((key) => matchState(state, matcher, key));
}

function matchState(
  state: AccessibilityState,
  matcher: AccessibilityState,
  key: keyof AccessibilityState
) {
  return (
    matcher[key] === undefined ||
    matcher[key] === (state?.[key] ?? defaultState[key])
  );
}
