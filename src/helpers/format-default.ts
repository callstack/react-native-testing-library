import { StyleSheet } from 'react-native';
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
  const accessibilityState = removeUndefinedKeys(props.accessibilityState);
  const accessibilityValue = removeUndefinedKeys(props.accessibilityValue);

  const styles = StyleSheet.flatten(props.style) as any;

  // perform custom prop mappings
  const result: Record<string, unknown> = {
    ...(styles?.display === 'none' ? { style: { display: 'none' } } : {}),
    ...(accessibilityState !== undefined ? { accessibilityState } : {}),
    ...(accessibilityValue !== undefined ? { accessibilityValue } : {}),
  };

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
  Object.keys(prop).forEach((propName) => {
    if (prop[propName] !== undefined) {
      result[propName] = prop[propName];
    }
  });

  // If object does not have any props we will ignore it.
  if (Object.keys(result).length === 0) {
    return undefined;
  }

  return result;
}
