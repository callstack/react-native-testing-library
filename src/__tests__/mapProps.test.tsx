import { ReactTestRendererJSON } from 'react-test-renderer';
import { mapVisibilityRelatedProps } from '../helpers/mapProps';

const node: ReactTestRendererJSON = {
  type: 'View',
  props: {},
  children: null,
};

describe('mapVisibilityRelatedProps', () => {
  test('preserves props that hide an element', () => {
    const result = mapVisibilityRelatedProps(
      {
        accessibilityElementsHidden: true,
        importantForAccessibility: 'no-hide-descendants',
        style: [{ flex: 1 }, { borderWidth: 2, display: 'none' }],
      },
      node
    );

    expect(result).toEqual({
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no-hide-descendants',
      style: { display: 'none' },
    });
  });

  test('does not preserve props that do not hide', () => {
    const result = mapVisibilityRelatedProps(
      {
        accessibilityElementsHidden: false,
        importantForAccessibility: 'auto',
        style: [{ flex: 1 }, { display: 'flex' }],
        testID: 'my-component',
      },
      node
    );

    expect(result).toEqual({});
  });
});
