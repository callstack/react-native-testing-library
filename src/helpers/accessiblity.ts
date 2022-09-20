import { StyleSheet } from 'react-native';
import { ReactTestInstance } from 'react-test-renderer';
import { getHostSiblings } from './component-tree';

export function isInaccessible(node: ReactTestInstance | null): boolean {
  if (node == null) {
    return true;
  }

  // Android: importantForAccessibility
  // See: https://reactnative.dev/docs/accessibility#importantforaccessibility-android
  if (node.props.importantForAccessibility === 'no') return true;

  let current: ReactTestInstance | null = node;
  while (current) {
    if (isSubtreeInaccessible(current)) {
      return true;
    }

    current = current.parent;
  }

  return false;
}

function isSubtreeInaccessible(node: ReactTestInstance | null): boolean {
  if (node == null) {
    return true;
  }

  // iOS: accessibilityElementsHidden
  // See: https://reactnative.dev/docs/accessibility#accessibilityelementshidden-ios
  if (node.props.accessibilityElementsHidden) {
    return true;
  }

  // Android: importantForAccessibility
  // See: https://reactnative.dev/docs/accessibility#importantforaccessibility-android
  if (node.props.importantForAccessibility === 'no-hide-descendants') {
    return true;
  }

  // Note that `opacity: 0` is not threated as inassessible on iOS
  const flatStyle = StyleSheet.flatten(node.props.style) ?? {};
  if (flatStyle.display === 'none') return true;

  // iOS: accessibilityViewIsModal
  // See: https://reactnative.dev/docs/accessibility#accessibilityviewismodal-ios
  const hostSiblings = getHostSiblings(node);
  if (hostSiblings.some((sibling) => sibling.props.accessibilityViewIsModal)) {
    return true;
  }

  return false;
}
