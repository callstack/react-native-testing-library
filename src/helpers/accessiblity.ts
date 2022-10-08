import { AccessibilityState, StyleSheet } from 'react-native';
import { ReactTestInstance } from 'react-test-renderer';
import { getHostSiblings } from './component-tree';

type IsAnaccessibleOptions = {
  isSubtreeInaccessible: (element: ReactTestInstance | null) => boolean;
};

export type AccessibilityStateKey = keyof AccessibilityState;

export const accessibilityStateKeys: AccessibilityStateKey[] = [
  'disabled',
  'selected',
  'checked',
  'busy',
  'expanded',
];

const defaultIsInaccessibleOptions = { isSubtreeInaccessible };

export function isInaccessible(
  element: ReactTestInstance | null,
  {
    isSubtreeInaccessible,
  }: IsAnaccessibleOptions = defaultIsInaccessibleOptions
): boolean {
  if (element == null) {
    return true;
  }

  let current: ReactTestInstance | null = element;
  while (current) {
    if (isSubtreeInaccessible(current)) {
      return true;
    }

    current = current.parent;
  }

  return false;
}

export function isSubtreeInaccessible(
  element: ReactTestInstance | null
): boolean {
  if (element == null) {
    return true;
  }

  // iOS: accessibilityElementsHidden
  // See: https://reactnative.dev/docs/accessibility#accessibilityelementshidden-ios
  if (element.props.accessibilityElementsHidden) {
    return true;
  }

  // Android: importantForAccessibility
  // See: https://reactnative.dev/docs/accessibility#importantforaccessibility-android
  if (element.props.importantForAccessibility === 'no-hide-descendants') {
    return true;
  }

  // Note that `opacity: 0` is not treated as inaccessible on iOS
  const flatStyle = StyleSheet.flatten(element.props.style) ?? {};
  if (flatStyle.display === 'none') return true;

  // iOS: accessibilityViewIsModal
  // See: https://reactnative.dev/docs/accessibility#accessibilityviewismodal-ios
  const hostSiblings = getHostSiblings(element);
  if (hostSiblings.some((sibling) => sibling.props.accessibilityViewIsModal)) {
    return true;
  }

  return false;
}
