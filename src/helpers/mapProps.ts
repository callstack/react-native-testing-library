import { StyleSheet } from 'react-native';
import { MapPropsFunction } from './format';

/**
 * Preserve props that would cause an element to not be visible while stripping
 * the rest
 */
export const mapVisibilityRelatedProps: MapPropsFunction = ({
  accessibilityElementsHidden,
  accessibilityViewIsModal,
  importantForAccessibility,
  style,
}) => {
  const styles = StyleSheet.flatten(style as any) ?? {};

  return {
    ...(accessibilityElementsHidden
      ? { accessibilityElementsHidden }
      : undefined),
    ...(accessibilityViewIsModal ? { accessibilityViewIsModal } : undefined),
    ...(importantForAccessibility === 'no-hide-descendants'
      ? { importantForAccessibility }
      : undefined),
    ...(styles.display === 'none' ? { style: { display: 'none' } } : undefined),
  };
};
