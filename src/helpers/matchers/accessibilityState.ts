import { AccessibilityState } from 'react-native';
import { ReactTestInstance } from 'react-test-renderer';

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
  return (
    matchState(state, matcher, 'disabled') &&
    matchState(state, matcher, 'selected') &&
    matchState(state, matcher, 'checked') &&
    matchState(state, matcher, 'busy') &&
    matchState(state, matcher, 'expanded')
  );
}

function matchState(
  value: AccessibilityState,
  matcher: AccessibilityState,
  key: keyof AccessibilityState
) {
  const valueWithDefault = value?.[key] ?? defaultState[key];
  return matcher[key] === undefined || matcher[key] === valueWithDefault;
}
