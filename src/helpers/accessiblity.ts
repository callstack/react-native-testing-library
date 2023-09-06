import {
  AccessibilityState,
  AccessibilityValue,
  StyleSheet,
} from 'react-native';
import { ReactTestInstance } from 'react-test-renderer';
import { getHostSiblings, getUnsafeRootElement } from './component-tree';
import {
  getHostComponentNames,
  isHostText,
  isHostTextInput,
} from './host-component-names';
import { getTextContent } from './text-content';

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

/**
 * Returns the accessibility role for given element. It will return explicit
 * role from either `role` or `accessibilityRole` props if set.
 *
 * If explicit role is not available, it would try to return default element
 * role:
 * - `text` for `Text` elements
 * - `textbox`* for `TextInput` elements.
 *
 * Note: `textbox` is not an official React Native role, you cannot set it
 * explicitly on an element. However, it is an ARIA role that better characterizes
 * TextInput elements than the default `none` role.
 *
 * In all other cases this functions returns `none`.
 *
 * @param element
 * @returns
 */
export function getAccessibilityRole(element: ReactTestInstance) {
  const explicitRole = element.props.role ?? element.props.accessibilityRole;
  if (explicitRole) {
    return explicitRole;
  }

  if (isHostText(element)) {
    return 'text';
  }

  if (isHostTextInput(element)) {
    return 'textbox';
  }

  return 'none';
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

export function getAccessibilityState(
  element: ReactTestInstance
): AccessibilityState | undefined {
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

export function getAccessibilityCheckedState(
  element: ReactTestInstance
): AccessibilityState['checked'] {
  const { accessibilityState, 'aria-checked': ariaChecked } = element.props;
  return ariaChecked ?? accessibilityState?.checked;
}

export function getAccessibilityValue(
  element: ReactTestInstance
): AccessibilityValue | undefined {
  const {
    accessibilityValue,
    'aria-valuemax': ariaValueMax,
    'aria-valuemin': ariaValueMin,
    'aria-valuenow': ariaValueNow,
    'aria-valuetext': ariaValueText,
  } = element.props;

  const hasAnyAccessibilityValueProps =
    accessibilityValue != null ||
    ariaValueMax != null ||
    ariaValueMin != null ||
    ariaValueNow != null ||
    ariaValueText != null;

  if (!hasAnyAccessibilityValueProps) {
    return undefined;
  }

  return {
    max: ariaValueMax ?? accessibilityValue?.max,
    min: ariaValueMin ?? accessibilityValue?.min,
    now: ariaValueNow ?? accessibilityValue?.now,
    text: ariaValueText ?? accessibilityValue?.text,
  };
}

export function isElementBusy(
  element: ReactTestInstance
): NonNullable<AccessibilityState['busy']> {
  const { accessibilityState, 'aria-busy': ariaBusy } = element.props;
  return ariaBusy ?? accessibilityState?.busy ?? false;
}

export function isElementCollapsed(
  element: ReactTestInstance
): NonNullable<AccessibilityState['expanded']> {
  const { accessibilityState, 'aria-expanded': ariaExpanded } = element.props;
  return (ariaExpanded ?? accessibilityState?.expanded) === false;
}

export function isElementExpanded(
  element: ReactTestInstance
): NonNullable<AccessibilityState['expanded']> {
  const { accessibilityState, 'aria-expanded': ariaExpanded } = element.props;
  return ariaExpanded ?? accessibilityState?.expanded ?? false;
}

export function isElementSelected(
  element: ReactTestInstance
): NonNullable<AccessibilityState['selected']> {
  const { accessibilityState, 'aria-selected': ariaSelected } = element.props;
  return ariaSelected ?? accessibilityState?.selected ?? false;
}

export function getAccessibleName(
  element: ReactTestInstance
): string | undefined {
  const label = getAccessibilityLabel(element);
  if (label) {
    return label;
  }

  const labelElementId = getAccessibilityLabelledBy(element);
  if (labelElementId) {
    const rootElement = getUnsafeRootElement(element);
    const labelElement = rootElement?.findByProps({ nativeID: labelElementId });
    if (labelElement) {
      return getTextContent(labelElement);
    }
  }

  return getTextContent(element);
}
