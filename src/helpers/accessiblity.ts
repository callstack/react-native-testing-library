import { StyleSheet } from 'react-native';
import { ReactTestInstance } from 'react-test-renderer';

export function isInaccessible(instance: ReactTestInstance | null): boolean {
  if (!instance) {
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
  if (!instance) {
    return true;
  }

  // TODO implement iOS: accessibilityViewIsModal
  // The hard part is to implement this to look only for host views
  // See: https://reactnative.dev/docs/accessibility#accessibilityviewismodal-ios
  //   if (instance.parent?.children.some((child) => child.accessibilityViewIsModal))
  //     return true;

  // iOS: accessibilityElementsHidden
  // See: https://reactnative.dev/docs/accessibility#accessibilityelementshidden-ios
  if (instance.props.accessibilityElementsHidden) return true;

  // Android: importantForAccessibility
  // See: https://reactnative.dev/docs/accessibility#importantforaccessibility-android
  if (instance.props.importantForAccessibility === 'no-hide-descendants')
    return true;

  const flatStyle = StyleSheet.flatten(instance.props.style);
  if (flatStyle.display === 'none') return true;
  if (flatStyle.opacity === 0) return true;

  return false;
}
