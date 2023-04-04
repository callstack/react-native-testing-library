import { StyleSheet } from 'react-native';
import { MapPropsFunction } from './format';

const propsToDisplay = [
  'accessibilityElementsHidden',
  'accessibilityViewIsModal',
  'importantForAccessibility',
  'testID',
  'nativeID',
  'accessibilityLabel',
  'accessibilityLabelledBy',
  'accessibilityRole',
  'accessibilityHint',
  'placeholder',
  'value',
  'defaultValue',
];

function isObject(
  thing: unknown
): thing is Record<string | symbol | number, unknown> {
  return typeof thing === 'object' && !Array.isArray(thing) && thing !== null;
}

function removeEmptyKeys(prop: unknown) {
  if (isObject(prop)) {
    const object = Object.keys(prop).reduce((acc, propName) => {
      return {
        ...acc,
        ...(prop[propName] === undefined ? {} : { [propName]: prop[propName] }),
      };
    }, {});

    if (!Object.values(object).find((val) => val !== undefined)) {
      return undefined;
    }

    return object;
  }

  return prop;
}

/**
 * Preserve props that are helpful in diagnosing test failures, while stripping rest
 */
export const mapPropsForQueryError: MapPropsFunction = (props) => {
  const accessibilityState = removeEmptyKeys(props.accessibilityState);
  const accessibilityValue = removeEmptyKeys(props.accessibilityValue);

  const styles = StyleSheet.flatten(props.style as any) ?? {};

  // perform custom prop mappings
  const mappedProps: Record<string, unknown> = {
    ...(styles.display === 'none' ? { style: { display: 'none' } } : undefined),
    ...(accessibilityState === undefined ? {} : { accessibilityState }),
    ...(accessibilityValue === undefined ? {} : { accessibilityValue }),
  };

  // add props from propsToDisplay without mapping
  return propsToDisplay.reduce((acc, propName) => {
    if (propName in props) {
      return {
        ...acc,
        [propName]: props[propName],
      };
    }

    return acc;
  }, mappedProps);
};
