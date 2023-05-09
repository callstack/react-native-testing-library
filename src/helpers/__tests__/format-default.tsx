import { ReactTestRendererJSON } from 'react-test-renderer';
import { defaultMapProps } from '../format-default';

const node: ReactTestRendererJSON = {
  type: 'View',
  props: {},
  children: null,
};

describe('mapPropsForQueryError', () => {
  test('preserves props that are helpful for debugging', () => {
    const props = {
      accessibilityElementsHidden: true,
      accessibilityViewIsModal: true,
      importantForAccessibility: 'yes',
      testID: 'TEST_ID',
      nativeID: 'NATIVE_ID',
      accessibilityLabel: 'LABEL',
      accessibilityLabelledBy: 'LABELLED_BY',
      accessibilityRole: 'ROLE',
      accessibilityHint: 'HINT',
      placeholder: 'PLACEHOLDER',
      value: 'VALUE',
      defaultValue: 'DEFAULT_VALUE',
    };

    const result = defaultMapProps(props, node);

    expect(result).toStrictEqual(props);
  });

  test('does not preserve less helpful props', () => {
    const result = defaultMapProps(
      {
        style: [{ flex: 1 }, { display: 'flex' }],
        onPress: () => null,
        key: 'foo',
      },
      node
    );

    expect(result).toStrictEqual({});
  });

  test('preserves "display: none" style but no other style', () => {
    const result = defaultMapProps(
      { style: [{ flex: 1 }, { display: 'none', flex: 2 }] },
      node
    );

    expect(result).toStrictEqual({
      style: { display: 'none' },
    });
  });

  test('removes undefined keys from accessibilityState', () => {
    const result = defaultMapProps(
      { accessibilityState: { checked: undefined, selected: false } },
      node
    );

    expect(result).toStrictEqual({
      accessibilityState: { selected: false },
    });
  });

  test('removes accessibilityState if all keys are undefined', () => {
    const result = defaultMapProps(
      { accessibilityState: { checked: undefined, selected: undefined } },
      node
    );

    expect(result).toStrictEqual({});
  });

  test('does not fail if accessibilityState is a string, passes through', () => {
    const result = defaultMapProps({ accessibilityState: 'foo' }, node);
    expect(result).toStrictEqual({ accessibilityState: 'foo' });
  });

  test('does not fail if accessibilityState is an array, passes through', () => {
    const result = defaultMapProps({ accessibilityState: [1] }, node);
    expect(result).toStrictEqual({ accessibilityState: [1] });
  });

  test('does not fail if accessibilityState is null, passes through', () => {
    const result = defaultMapProps({ accessibilityState: null }, node);
    expect(result).toStrictEqual({ accessibilityState: null });
  });

  test('does not fail if accessibilityState is nested object, passes through', () => {
    const accessibilityState = { 1: { 2: 3 }, 2: undefined };
    const result = defaultMapProps({ accessibilityState }, node);
    expect(result).toStrictEqual({ accessibilityState: { 1: { 2: 3 } } });
  });

  test('removes undefined keys from accessibilityValue', () => {
    const result = defaultMapProps(
      { accessibilityValue: { min: 1, max: undefined } },
      node
    );

    expect(result).toStrictEqual({ accessibilityValue: { min: 1 } });
  });

  test('removes accessibilityValue if all keys are undefined', () => {
    const result = defaultMapProps(
      { accessibilityValue: { min: undefined } },
      node
    );

    expect(result).toStrictEqual({});
  });
});
