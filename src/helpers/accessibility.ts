import type { AccessibilityRole, AccessibilityState, AccessibilityValue, Role } from 'react-native';
import { StyleSheet } from 'react-native';
import type { HostElement } from 'universal-test-renderer';

import { getContainerElement, getHostSiblings, isValidElement } from './component-tree';
import { findAll } from './find-all';
import { isHostImage, isHostSwitch, isHostText, isHostTextInput } from './host-component-names';
import { getTextContent } from './text-content';
import { isEditableTextInput } from './text-input';

type IsInaccessibleOptions = {
  cache?: WeakMap<HostElement, boolean>;
};

export const accessibilityStateKeys: (keyof AccessibilityState)[] = [
  'disabled',
  'selected',
  'checked',
  'busy',
  'expanded',
];

export const accessibilityValueKeys: (keyof AccessibilityValue)[] = ['min', 'max', 'now', 'text'];

export function isHiddenFromAccessibility(
  element: HostElement | null,
  { cache }: IsInaccessibleOptions = {},
): boolean {
  if (element == null) {
    return true;
  }

  let current: HostElement | null = element;
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

/** RTL-compatibility alias for `isHiddenFromAccessibility` */
export const isInaccessible = isHiddenFromAccessibility;

function isSubtreeInaccessible(element: HostElement): boolean {
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
  if (hostSiblings.some((sibling) => computeAriaModal(sibling))) {
    return true;
  }

  return false;
}

export function isAccessibilityElement(element: HostElement | null): boolean {
  if (element == null) {
    return false;
  }

  // https://github.com/facebook/react-native/blob/8dabed60f456e76a9e53273b601446f34de41fb5/packages/react-native/Libraries/Image/Image.ios.js#L172
  if (isHostImage(element) && element.props.alt !== undefined) {
    return true;
  }

  if (element.props.accessible !== undefined) {
    return element.props.accessible;
  }

  return isHostText(element) || isHostTextInput(element) || isHostSwitch(element);
}

/**
 * Returns the accessibility role for given element. It will return explicit
 * role from either `role` or `accessibilityRole` props if set.
 *
 * If explicit role is not available, it would try to return default element
 * role:
 * - `text` for `Text` elements
 *
 * In all other cases this functions returns `none`.
 *
 * @param element
 * @returns
 */
export function getRole(element: HostElement): Role | AccessibilityRole {
  const explicitRole = element.props.role ?? element.props.accessibilityRole;
  if (explicitRole) {
    return normalizeRole(explicitRole);
  }

  if (isHostText(element)) {
    return 'text';
  }

  // Note: host Image elements report "image" role in screen reader only on Android, but not on iOS.
  // It's better to require explicit role for Image elements.

  return 'none';
}

/**
 * There are some duplications between (ARIA) `Role` and `AccessibilityRole` types.
 * Resolve them by using ARIA `Role` type where possible.
 *
 * @param role Role to normalize
 * @returns Normalized role
 */
export function normalizeRole(role: string): Role | AccessibilityRole {
  if (role === 'image') {
    return 'img';
  }

  return role as Role | AccessibilityRole;
}

export function computeAriaModal(element: HostElement): boolean | undefined {
  return element.props['aria-modal'] ?? element.props.accessibilityViewIsModal;
}

export function computeAriaLabel(element: HostElement): string | undefined {
  const labelElementId = element.props['aria-labelledby'] ?? element.props.accessibilityLabelledBy;
  if (labelElementId) {
    const rootElement = getContainerElement(element);
    const labelElement = findAll(
      rootElement,
      (node) => isValidElement(node) && node.props.nativeID === labelElementId,
      {
        includeHiddenElements: true,
      },
    );
    if (labelElement.length > 0) {
      return getTextContent(labelElement[0]);
    }
  }

  const explicitLabel = element.props['aria-label'] ?? element.props.accessibilityLabel;
  if (explicitLabel) {
    return explicitLabel;
  }

  //https://github.com/facebook/react-native/blob/8dabed60f456e76a9e53273b601446f34de41fb5/packages/react-native/Libraries/Image/Image.ios.js#L173
  if (isHostImage(element) && element.props.alt) {
    return element.props.alt;
  }

  return undefined;
}

// See: https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State#busy-state
export function computeAriaBusy({ props }: HostElement): boolean {
  return props['aria-busy'] ?? props.accessibilityState?.busy ?? false;
}

// See: https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State#checked-state
export function computeAriaChecked(element: HostElement): AccessibilityState['checked'] {
  const { props } = element;

  if (isHostSwitch(element)) {
    return props.value;
  }

  const role = getRole(element);
  if (!rolesSupportingCheckedState[role]) {
    return undefined;
  }

  return props['aria-checked'] ?? props.accessibilityState?.checked;
}

// See: https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State#disabled-state
export function computeAriaDisabled(element: HostElement): boolean {
  if (isHostTextInput(element) && !isEditableTextInput(element)) {
    return true;
  }

  const { props } = element;
  return props['aria-disabled'] ?? props.accessibilityState?.disabled ?? false;
}

// See: https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State#expanded-state
export function computeAriaExpanded({ props }: HostElement): boolean | undefined {
  return props['aria-expanded'] ?? props.accessibilityState?.expanded;
}

// See: https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State#selected-state
export function computeAriaSelected({ props }: HostElement): boolean {
  return props['aria-selected'] ?? props.accessibilityState?.selected ?? false;
}

export function computeAriaValue(element: HostElement): AccessibilityValue {
  const {
    accessibilityValue,
    'aria-valuemax': ariaValueMax,
    'aria-valuemin': ariaValueMin,
    'aria-valuenow': ariaValueNow,
    'aria-valuetext': ariaValueText,
  } = element.props;

  return {
    max: ariaValueMax ?? accessibilityValue?.max,
    min: ariaValueMin ?? accessibilityValue?.min,
    now: ariaValueNow ?? accessibilityValue?.now,
    text: ariaValueText ?? accessibilityValue?.text,
  };
}

export function computeAccessibleName(element: HostElement): string | undefined {
  return computeAriaLabel(element) ?? getTextContent(element);
}

type RoleSupportMap = Partial<Record<Role | AccessibilityRole, true>>;

export const rolesSupportingCheckedState: RoleSupportMap = {
  checkbox: true,
  radio: true,
  switch: true,
};
