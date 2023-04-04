import { ReactTestRendererJSON } from 'react-test-renderer';
import { mapPropsForQueryError } from '../helpers/mapProps';

const node: ReactTestRendererJSON = {
  type: 'View',
  props: {},
  children: null,
};

describe('mapPropsForQueryError', () => {
  test('preserves props that hide an element', () => {
    const result = mapPropsForQueryError(
      {
        accessibilityElementsHidden: true,
        importantForAccessibility: 'no-hide-descendants',
        style: [{ flex: 1 }, { borderWidth: 2, display: 'none' }],
      },
      node
    );

    expect(result).toStrictEqual({
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no-hide-descendants',
      style: { display: 'none' },
    });
  });

  test('removes undefined keys from accessibilityState', () => {
    const result = mapPropsForQueryError(
      {
        accessibilityState: { checked: undefined, selected: true },
      },
      node
    );

    expect(result).toStrictEqual({
      accessibilityState: { selected: true },
    });
  });

  test('does not fail if accessibilityState is a string, passes through', () => {
    const result = mapPropsForQueryError({ accessibilityState: 'foo' }, node);
    expect(result).toStrictEqual({ accessibilityState: 'foo' });
  });

  test('does not fail if accessibilityState is an array, passes through', () => {
    const result = mapPropsForQueryError({ accessibilityState: [1] }, node);
    expect(result).toStrictEqual({ accessibilityState: [1] });
  });

  test('does not fail if accessibilityState is null, passes through', () => {
    const result = mapPropsForQueryError({ accessibilityState: null }, node);
    expect(result).toStrictEqual({ accessibilityState: null });
  });

  test('does not fail if accessibilityState is nested object, passes through', () => {
    const accessibilityState = { 1: { 2: 3 }, 2: undefined };
    const result = mapPropsForQueryError({ accessibilityState }, node);
    expect(result).toStrictEqual({ accessibilityState: { 1: { 2: 3 } } });
  });

  test('does not preserve props that do not hide', () => {
    const result = mapPropsForQueryError(
      {
        style: [{ flex: 1 }, { display: 'flex' }],
        onPress: () => null,
        key: 'foo',
      },
      node
    );

    expect(result).toStrictEqual({});
  });
});
