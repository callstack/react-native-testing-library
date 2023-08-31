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

  // See: https://reactnative.dev/docs/accessibility#aria-hidden
  if (element.props['aria-hidden']) {
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

  // iOS: accessibilityViewIsModal or aria-modal
  // See: https://reactnative.dev/docs/accessibility#accessibilityviewismodal-ios
  const hostSiblings = getHostSiblings(element);
  if (hostSiblings.some((sibling) => getAccessibilityViewIsModal(sibling))) {
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

export function getAccessibilityRole(element: ReactTestInstance) {
  return element.props.role ?? element.props.accessibilityRole;
}

export function getAccessibilityViewIsModal(element: ReactTestInstance) {
  return element.props['aria-modal'] ?? element.props.accessibilityViewIsModal;
}

export function getAccessibilityLabel(
  element: ReactTestInstance
): string | undefined {
  return element.props['aria-label'] ?? element.props.accessibilityLabel;
}

export function getAccessibilityLabelledBy(
  element: ReactTestInstance
): string | undefined {
  return (
    element.props['aria-labelledby'] ?? element.props.accessibilityLabelledBy
  );
}

export function getAccessibilityState(element: ReactTestInstance) {
  const {
    accessibilityState,
    'aria-busy': ariaBusy,
    'aria-checked': ariaChecked,
    'aria-disabled': ariaDisabled,
    'aria-expanded': ariaExpanded,
    'aria-selected': ariaSelected,
  } = element.props;

  const hasAnyAccessibilityStateProps =
    accessibilityState != null ||
    ariaBusy != null ||
    ariaChecked != null ||
    ariaDisabled != null ||
    ariaExpanded != null ||
    ariaSelected != null;

  if (!hasAnyAccessibilityStateProps) {
    return undefined;
  }

  return {
    busy: ariaBusy ?? accessibilityState?.busy,
    checked: ariaChecked ?? accessibilityState?.checked,
    disabled: ariaDisabled ?? accessibilityState?.disabled,
    expanded: ariaExpanded ?? accessibilityState?.expanded,
    selected: ariaSelected ?? accessibilityState?.selected,
  };
}
