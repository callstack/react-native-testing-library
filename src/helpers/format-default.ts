import { StyleSheet, ViewStyle } from 'react-native';
import { MapPropsFunction } from './format';

const propsToDisplay = [
  'testID',
  'nativeID',
  'accessibilityElementsHidden',
  'accessibilityViewIsModal',
  'importantForAccessibility',
  'accessibilityRole',
  'accessibilityLabel',
  'accessibilityLabelledBy',
  'accessibilityHint',
  'placeholder',
  'value',
  'defaultValue',
  'title',
];

/**
 * Preserve props that are helpful in diagnosing test failures, while stripping rest
 */
export const defaultMapProps: MapPropsFunction = (props) => {
  const result: Record<string, unknown> = {};

  const styles = StyleSheet.flatten(props.style as ViewStyle);
  if (styles?.display === 'none') {
    result.style = { display: 'none' };
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
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function removeUndefinedKeys(prop: unknown) {
  if (!isObject(prop)) {
    return prop;
  }

  const result: Record<string, unknown> = {};
  Object.entries(prop).forEach(([key, value]) => {
    if (value !== undefined) {
      result[key] = value;
    }
  });

  // If object does not have any props we will ignore it.
  if (Object.keys(result).length === 0) {
    return undefined;
  }

  return result;
}
