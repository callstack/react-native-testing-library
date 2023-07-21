import {
  AccessibilityState,
  AccessibilityValue,
  StyleSheet,
} from 'react-native';
import { ReactTestInstance } from 'react-test-renderer';
import { getHostSiblings } from './component-tree';
import { getHostComponentNames } from './host-component-names';

type IsInaccessibleOptions = {
  cache?: WeakMap<ReactTestInstance, boolean>;
};

export const accessibilityStateKeys: (keyof AccessibilityState)[] = [
  'disabled',
  'selected',
  'checked',
  'busy',
  'expanded',
];

export const accessiblityValueKeys: (keyof AccessibilityValue)[] = [
  'min',
  'max',
  'now',
  'text',
];

export function isHiddenFromAccessibility(
  element: ReactTestInstance | null,
  { cache }: IsInaccessibleOptions = {}
): boolean {
  if (element == null) {
    return true;
  }

  let current: ReactTestInstance | null = element;
  while (current) {
    let isCurrentSubtreeInaccessible = cache?.get(current);

    if (isCurrentSubtreeInaccessible === undefined) {
      isCurrentSubtreeInaccessible = isSubtreeInaccessible(current);
      cache?.set(current, isCurrentSubtreeInaccessible);
    }

    if (isCurrentSubtreeInaccessible) {
      return true;
    }

    current = current.parent;
  }

  return false;
}

/** RTL-compatitibility alias for `isHiddenFromAccessibility` */
export const isInaccessible = isHiddenFromAccessibility;

function isSubtreeInaccessible(element: ReactTestInstance): boolean {
  // Null props can happen for React.Fragments
  if (element.props == null) {
    return false;
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

export function isAccessibilityElement(
  element: ReactTestInstance | null
): boolean {
  if (element == null) {
    return false;
  }

  if (element.props.accessible !== undefined) {
    return element.props.accessible;
  }

  const hostComponentNames = getHostComponentNames();
  return (
    element?.type === hostComponentNames?.text ||
    element?.type === hostComponentNames?.textInput ||
    element?.type === hostComponentNames?.switch
  );
}
