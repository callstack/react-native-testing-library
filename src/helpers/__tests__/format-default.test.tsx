import { defaultMapProps } from '../format-default';

describe('mapPropsForQueryError', () => {
  test('preserves props that are helpful for debugging', () => {
    const props = {
      'aria-hidden': true,
      accessibilityElementsHidden: true,
      accessibilityViewIsModal: true,
      importantForAccessibility: 'yes',
      testID: 'TEST_ID',
      nativeID: 'NATIVE_ID',
      accessibilityLabel: 'LABEL',
      accessibilityLabelledBy: 'LABELLED_BY',
      accessibilityRole: 'ROLE',
      accessibilityHint: 'HINT',
      'aria-busy': 'ARIA-BUSY',
      'aria-checked': 'ARIA-CHECKED',
      'aria-disabled': 'ARIA-DISABLED',
      'aria-expanded': 'ARIA-EXPANDED',
      'aria-label': 'ARIA_LABEL',
      'aria-labelledby': 'ARIA_LABELLED_BY',
      'aria-selected': 'ARIA-SELECTED',
      placeholder: 'PLACEHOLDER',
      value: 'VALUE',
      defaultValue: 'DEFAULT_VALUE',
    };

    const result = defaultMapProps(props);
    expect(result).toStrictEqual(props);
  });

  test('does not preserve less helpful props', () => {
    const result = defaultMapProps({
      style: [{ flex: 1 }, { flexDirection: 'row' }],
      onPress: () => null,
      key: 'foo',
    });

    expect(result).toStrictEqual({});
  });

  test('preserves "display" and "opacity" styles but no other style', () => {
    const result = defaultMapProps({
      style: [{ flex: 1 }, { display: 'none', flex: 2 }, { opacity: 0.5 }],
    });

    expect(result).toStrictEqual({
      style: { display: 'none', opacity: 0.5 },
    });
  });

  test('removes undefined keys from accessibilityState', () => {
    const result = defaultMapProps({
      accessibilityState: { checked: undefined, selected: false },
    });

    expect(result).toStrictEqual({
      accessibilityState: { selected: false },
    });
  });

  test('removes accessibilityState if all keys are undefined', () => {
    const result = defaultMapProps({
      accessibilityState: { checked: undefined, selected: undefined },
    });

    expect(result).toStrictEqual({});
  });

  test('does not fail if accessibilityState is a string, passes through', () => {
    const result = defaultMapProps({ accessibilityState: 'foo' });
    expect(result).toStrictEqual({ accessibilityState: 'foo' });
  });

  test('does not fail if accessibilityState is an array, passes through', () => {
    const result = defaultMapProps({ accessibilityState: [1] });
    expect(result).toStrictEqual({ accessibilityState: [1] });
  });

  test('does not fail if accessibilityState is null, passes through', () => {
    const result = defaultMapProps({ accessibilityState: null });
    expect(result).toStrictEqual({ accessibilityState: null });
  });

  test('does not fail if accessibilityState is nested object, passes through', () => {
    const accessibilityState = { 1: { 2: 3 }, 2: undefined };
    const result = defaultMapProps({ accessibilityState });
    expect(result).toStrictEqual({ accessibilityState: { 1: { 2: 3 } } });
  });

  test('removes undefined keys from accessibilityValue', () => {
    const result = defaultMapProps({
      accessibilityValue: { min: 1, max: undefined },
    });

    expect(result).toStrictEqual({ accessibilityValue: { min: 1 } });
  });

  test('removes accessibilityValue if all keys are undefined', () => {
    const result = defaultMapProps({ accessibilityValue: { min: undefined } });

    expect(result).toStrictEqual({});
  });
});
