import { StyleSheet, ViewStyle } from 'react-native';

const propsToDisplay = [
  'accessibilityElementsHidden',
  'accessibilityHint',
  'accessibilityLabel',
  'accessibilityLabelledBy',
  'accessibilityRole',
  'accessibilityViewIsModal',
  'aria-busy',
  'aria-checked',
  'aria-disabled',
  'aria-expanded',
  'aria-hidden',
  'aria-label',
  'aria-labelledby',
  'aria-selected',
  'defaultValue',
  'importantForAccessibility',
  'nativeID',
  'placeholder',
  'role',
  'testID',
  'title',
  'value',
];

const stylePropsToDisplay = ['display', 'opacity'] as const;

/**
 * Preserve props that are helpful in diagnosing test failures, while stripping rest
 */
export function defaultMapProps(
  props: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  const styles = StyleSheet.flatten(props.style as ViewStyle);
  const styleToDisplay = extractStyle(styles);
  if (styleToDisplay !== undefined) {
    result.style = styleToDisplay;
  }

  const accessibilityState = removeUndefinedKeys(props.accessibilityState);
  if (accessibilityState !== undefined) {
    result.accessibilityState = accessibilityState;
  }

  const accessibilityValue = removeUndefinedKeys(props.accessibilityValue);
  if (accessibilityValue !== undefined) {
    result.accessibilityValue = accessibilityValue;
  }

  propsToDisplay.forEach((propName) => {
    if (propName in props) {
      result[propName] = props[propName];
    }
  });

  return result;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function removeUndefinedKeys(prop: unknown) {
  if (!isObject(prop)) {
    return prop;
  }

  let hasKeys = false;
  const result: Record<string, unknown> = {};
  Object.entries(prop).forEach(([key, value]) => {
    if (value !== undefined) {
      result[key] = value;
      hasKeys = true;
    }
  });

  return hasKeys ? result : undefined;
}

function extractStyle(style: ViewStyle | undefined) {
  if (style == null) {
    return undefined;
  }

  const result: Record<string, unknown> = {};
  let hasAnyStyle = false;

  stylePropsToDisplay.forEach((styleProp) => {
    if (styleProp in style) {
      result[styleProp] = style[styleProp];
      hasAnyStyle = true;
    }
  });

  return hasAnyStyle ? result : undefined;
}
