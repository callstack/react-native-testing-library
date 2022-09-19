import { StyleSheet } from 'react-native';
import { ReactTestInstance } from 'react-test-renderer';
import { getHostChildren } from './component-tree';

export function isInaccessible(instance: ReactTestInstance | null): boolean {
  if (instance == null) {
    return true;
  }

  // Android: importantForAccessibility
  // See: https://reactnative.dev/docs/accessibility#importantforaccessibility-android
  if (instance.props.importantForAccessibility === 'no') return true;

  let current: ReactTestInstance | null = instance;
  while (current) {
    if (isSubtreeInaccessible(current)) {
      return true;
    }

    current = current.parent;
  }

  return false;
}

function isSubtreeInaccessible(
  instance: ReactTestInstance | null | undefined
): boolean {
  if (instance == null) {
    return true;
  }

  // iOS: accessibilityElementsHidden
  // See: https://reactnative.dev/docs/accessibility#accessibilityelementshidden-ios
  if (instance.props.accessibilityElementsHidden) {
    return true;
  }

  // Android: importantForAccessibility
  // See: https://reactnative.dev/docs/accessibility#importantforaccessibility-android
  if (instance.props.importantForAccessibility === 'no-hide-descendants') {
    return true;
  }

  // Note that `opacity: 0` is not threated as inassessible on iOS ()
  const flatStyle = StyleSheet.flatten(instance.props.style) ?? {};
  if (flatStyle.display === 'none') return true;

  // iOS: accessibilityViewIsModal
  // See: https://reactnative.dev/docs/accessibility#accessibilityviewismodal-ios
  const hostChildren = getHostChildren(instance);
  if (hostChildren.some((child) => child.props.accessibilityViewIsModal)) {
    return true;
  }

  return false;
}
