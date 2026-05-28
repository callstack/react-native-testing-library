import type { AccessibilityRole, AccessibilityState, AccessibilityValue, Role } from 'react-native';
import { StyleSheet } from 'react-native';
import type { TestInstance } from 'test-renderer';

import { getContainerInstance, getInstanceSiblings, isTestInstance } from './component-tree';
import { findAll } from './find-all';
import { isHostImage, isHostSwitch, isHostText, isHostTextInput } from './host-component-names';
import { getTextContent } from './text-content';
import { isEditableTextInput } from './text-input';

type IsInaccessibleOptions = {
  cache?: WeakMap<TestInstance, boolean>;
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
  instance: TestInstance | null,
  { cache }: IsInaccessibleOptions = {},
): boolean {
  if (instance == null) {
    return true;
  }

  let current: TestInstance | null = instance;
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

function isSubtreeInaccessible(instance: TestInstance): boolean {
  // See: https://reactnative.dev/docs/accessibility#aria-hidden
  if (instance.props['aria-hidden']) {
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

  // Note that `opacity: 0` is not treated as inaccessible on iOS
  const flatStyle = StyleSheet.flatten(instance.props.style) ?? {};
  if (flatStyle.display === 'none') return true;

  // iOS: accessibilityViewIsModal or aria-modal
  // See: https://reactnative.dev/docs/accessibility#accessibilityviewismodal-ios
  const hostSiblings = getInstanceSiblings(instance);
  if (hostSiblings.some((sibling) => computeAriaModal(sibling))) {
    return true;
  }

  return false;
}

export function isAccessibilityElement(instance: TestInstance | null): boolean {
  if (instance == null) {
    return false;
  }

  // https://github.com/facebook/react-native/blob/8dabed60f456e76a9e53273b601446f34de41fb5/packages/react-native/Libraries/Image/Image.ios.js#L172
  if (isHostImage(instance) && instance.props.alt !== undefined) {
    return true;
  }

  if (instance.props.accessible !== undefined) {
    return instance.props.accessible;
  }

  return isHostText(instance) || isHostTextInput(instance) || isHostSwitch(instance);
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
 * @param instance
 * @returns
 */
export function getRole(instance: TestInstance): Role | AccessibilityRole {
  const explicitRole = instance.props.role ?? instance.props.accessibilityRole;
  if (explicitRole) {
    return normalizeRole(explicitRole);
  }

  if (isHostText(instance)) {
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

export function computeAriaModal(instance: TestInstance): boolean | undefined {
  return instance.props['aria-modal'] ?? instance.props.accessibilityViewIsModal;
}

export function computeAriaLabel(instance: TestInstance): string | undefined {
  const labelElementIds = getAriaLabelledByIds(instance);
  if (labelElementIds.length > 0) {
    const container = getContainerInstance(instance);
    const labelTexts = labelElementIds
      .map((labelElementId) => {
        const labelInstance = findAll(
          container,
          (node) => isTestInstance(node) && node.props.nativeID === labelElementId,
          { includeHiddenElements: true },
        );

        return labelInstance.length > 0 ? getTextContent(labelInstance[0]) : undefined;
      })
      .filter((labelText): labelText is string => labelText !== undefined);

    if (labelTexts.length > 0) {
      return labelTexts.join(' ').trim().replace(/\s+/g, ' ');
    }
  }

  const explicitLabel = instance.props['aria-label'] ?? instance.props.accessibilityLabel;
  if (explicitLabel) {
    return explicitLabel;
  }

  //https://github.com/facebook/react-native/blob/8dabed60f456e76a9e53273b601446f34de41fb5/packages/react-native/Libraries/Image/Image.ios.js#L173
  if (isHostImage(instance) && instance.props.alt) {
    return instance.props.alt;
  }

  return undefined;
}

function getAriaLabelledByIds(instance: TestInstance): string[] {
  const ariaLabelledBy = instance.props['aria-labelledby'];
  if (typeof ariaLabelledBy === 'string') {
    return [ariaLabelledBy];
  }

  const accessibilityLabelledBy = instance.props.accessibilityLabelledBy;
  if (Array.isArray(accessibilityLabelledBy)) {
    return accessibilityLabelledBy;
  }

  if (typeof accessibilityLabelledBy === 'string') {
    return [accessibilityLabelledBy];
  }

  return [];
}

// See: https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State#busy-state
export function computeAriaBusy({ props }: TestInstance): boolean {
  return props['aria-busy'] ?? props.accessibilityState?.busy ?? false;
}

// See: https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State#checked-state
export function computeAriaChecked(instance: TestInstance): AccessibilityState['checked'] {
  const { props } = instance;

  if (isHostSwitch(instance)) {
    return props.value;
  }

  const role = getRole(instance);
  if (!rolesSupportingCheckedState[role]) {
    return undefined;
  }

  return props['aria-checked'] ?? props.accessibilityState?.checked;
}

// See: https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State#disabled-state
export function computeAriaDisabled(instance: TestInstance): boolean {
  if (isHostTextInput(instance) && !isEditableTextInput(instance)) {
    return true;
  }

  const { props } = instance;

  if (isHostText(instance) && props.disabled) {
    return true;
  }

  return props['aria-disabled'] ?? props.accessibilityState?.disabled ?? false;
}

// See: https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State#expanded-state
export function computeAriaExpanded({ props }: TestInstance): boolean | undefined {
  return props['aria-expanded'] ?? props.accessibilityState?.expanded;
}

// See: https://github.com/callstack/react-native-testing-library/wiki/Accessibility:-State#selected-state
export function computeAriaSelected({ props }: TestInstance): boolean {
  return props['aria-selected'] ?? props.accessibilityState?.selected ?? false;
}

export function computeAriaValue(instance: TestInstance): AccessibilityValue {
  const {
    accessibilityValue,
    'aria-valuemax': ariaValueMax,
    'aria-valuemin': ariaValueMin,
    'aria-valuenow': ariaValueNow,
    'aria-valuetext': ariaValueText,
  } = instance.props;

  return {
    max: ariaValueMax ?? accessibilityValue?.max,
    min: ariaValueMin ?? accessibilityValue?.min,
    now: ariaValueNow ?? accessibilityValue?.now,
    text: ariaValueText ?? accessibilityValue?.text,
  };
}

type ComputeAccessibleNameOptions = {
  root?: boolean;
};

type AccessibleNamePart = {
  text: string;
  isInlineText: boolean;
};

export function computeAccessibleName(
  instance: TestInstance,
  options?: ComputeAccessibleNameOptions,
): string | undefined {
  const label = computeAriaLabel(instance);
  if (label) {
    return label;
  }

  if (isHostTextInput(instance) && instance.props.placeholder && options?.root !== false) {
    return instance.props.placeholder;
  }

  const parts: AccessibleNamePart[] = [];
  for (const child of instance.children) {
    if (typeof child === 'string') {
      if (child) {
        parts.push({ text: child, isInlineText: true });
      }
    } else {
      const childLabel = computeAccessibleName(child, { root: false });
      if (childLabel) {
        parts.push({ text: childLabel, isInlineText: isHostText(child) });
      }
    }
  }

  // Text children are already part of one inline phrase and contain their own spacing.
  // Other elements contribute separate accessible names, so separate them with spaces.
  return parts.reduce((accessibleName, part, index) => {
    if (index === 0) {
      return part.text;
    }

    const previousPart = parts[index - 1];
    const separator = isHostText(instance) && previousPart.isInlineText && part.isInlineText ? '' : ' ';
    return `${accessibleName}${separator}${part.text}`;
  }, '');
}

type RoleSupportMap = Partial<Record<Role | AccessibilityRole, true>>;

export const rolesSupportingCheckedState: RoleSupportMap = {
  checkbox: true,
  radio: true,
  switch: true,
};
