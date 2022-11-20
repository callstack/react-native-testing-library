import React from 'react';
import { View, Text, TextInput, Pressable, Switch } from 'react-native';
import { render, isHiddenFromAccessibility, isInaccessible } from '../..';
import { isAccessibilityElement } from '../accessiblity';

describe('isHiddenFromAccessibility', () => {
  test('returns false for accessible elements', () => {
    expect(
      isHiddenFromAccessibility(
        render(<View testID="subject" />).getByTestId('subject')
      )
    ).toBe(false);

    expect(
      isHiddenFromAccessibility(
        render(<Text testID="subject">Hello</Text>).getByTestId('subject')
      )
    ).toBe(false);

    expect(
      isHiddenFromAccessibility(
        render(<TextInput testID="subject" />).getByTestId('subject')
      )
    ).toBe(false);
  });

  test('returns true for null elements', () => {
    expect(isHiddenFromAccessibility(null)).toBe(true);
  });

  test('detects elements with accessibilityElementsHidden prop', () => {
    const view = render(<View testID="subject" accessibilityElementsHidden />);
    expect(isHiddenFromAccessibility(view.getByTestId('subject'))).toBe(true);
  });

  test('detects nested elements with accessibilityElementsHidden prop', () => {
    const view = render(
      <View accessibilityElementsHidden>
        <View testID="subject" />
      </View>
    );
    expect(isHiddenFromAccessibility(view.getByTestId('subject'))).toBe(true);
  });

  test('detects deeply nested elements with accessibilityElementsHidden prop', () => {
    const view = render(
      <View accessibilityElementsHidden>
        <View>
          <View>
            <View testID="subject" />
          </View>
        </View>
      </View>
    );
    expect(isHiddenFromAccessibility(view.getByTestId('subject'))).toBe(true);
  });

  test('detects elements with importantForAccessibility="no-hide-descendants" prop', () => {
    const view = render(
      <View testID="subject" importantForAccessibility="no-hide-descendants" />
    );
    expect(isHiddenFromAccessibility(view.getByTestId('subject'))).toBe(true);
  });

  test('detects nested elements with importantForAccessibility="no-hide-descendants" prop', () => {
    const view = render(
      <View importantForAccessibility="no-hide-descendants">
        <View testID="subject" />
      </View>
    );
    expect(isHiddenFromAccessibility(view.getByTestId('subject'))).toBe(true);
  });

  test('detects elements with display=none', () => {
    const view = render(<View testID="subject" style={{ display: 'none' }} />);
    expect(isHiddenFromAccessibility(view.getByTestId('subject'))).toBe(true);
  });

  test('detects nested elements with display=none', () => {
    const view = render(
      <View style={{ display: 'none' }}>
        <View testID="subject" />
      </View>
    );
    expect(isHiddenFromAccessibility(view.getByTestId('subject'))).toBe(true);
  });

  test('detects deeply nested elements with display=none', () => {
    const view = render(
      <View style={{ display: 'none' }}>
        <View>
          <View>
            <View testID="subject" />
          </View>
        </View>
      </View>
    );
    expect(isHiddenFromAccessibility(view.getByTestId('subject'))).toBe(true);
  });

  test('detects elements with display=none with complex style', () => {
    const view = render(
      <View
        testID="subject"
        style={[
          { display: 'flex' },
          [{ display: 'flex' }],
          { display: 'none' },
        ]}
      />
    );
    expect(isHiddenFromAccessibility(view.getByTestId('subject'))).toBe(true);
  });

  test('is not trigged by opacity = 0', () => {
    const view = render(<View testID="subject" style={{ opacity: 0 }} />);
    expect(isHiddenFromAccessibility(view.getByTestId('subject'))).toBe(false);
  });

  test('detects siblings of element with accessibilityViewIsModal prop', () => {
    const view = render(
      <View>
        <View accessibilityViewIsModal />
        <View testID="subject" />
      </View>
    );
    expect(isHiddenFromAccessibility(view.getByTestId('subject'))).toBe(true);
  });

  test('detects deeply nested siblings of element with accessibilityViewIsModal prop', () => {
    const view = render(
      <View>
        <View accessibilityViewIsModal />
        <View>
          <View>
            <View testID="subject" />
          </View>
        </View>
      </View>
    );
    expect(isHiddenFromAccessibility(view.getByTestId('subject'))).toBe(true);
  });

  test('is not triggered for element with accessibilityViewIsModal prop', () => {
    const view = render(
      <View>
        <View accessibilityViewIsModal testID="subject" />
      </View>
    );
    expect(isHiddenFromAccessibility(view.getByTestId('subject'))).toBe(false);
  });

  test('is not triggered for child of element with accessibilityViewIsModal prop', () => {
    const view = render(
      <View>
        <View accessibilityViewIsModal>
          <View testID="subject" />
        </View>
      </View>
    );
    expect(isHiddenFromAccessibility(view.getByTestId('subject'))).toBe(false);
  });

  test('is not triggered for descendent of element with accessibilityViewIsModal prop', () => {
    const view = render(
      <View>
        <View accessibilityViewIsModal>
          <View>
            <View>
              <View testID="subject" />
            </View>
          </View>
        </View>
      </View>
    );
    expect(isHiddenFromAccessibility(view.getByTestId('subject'))).toBe(false);
  });

  test('has isInaccessible alias', () => {
    expect(isInaccessible).toBe(isHiddenFromAccessibility);
  });
});

describe('isAccessibilityElement', () => {
  describe('when accessible prop is not defined', () => {
    test('returns true for Text component', () => {
      const element = render(<Text testID="text">Hey</Text>).getByTestId(
        'text'
      );
      expect(isAccessibilityElement(element)).toEqual(true);
    });

    test('returns true for TextInput component', () => {
      const element = render(<TextInput testID="input" />).getByTestId('input');
      expect(isAccessibilityElement(element)).toEqual(true);
    });

    test('returns true for Pressable component', () => {
      const element = render(<Pressable testID="pressable" />).getByTestId(
        'pressable'
      );
      expect(isAccessibilityElement(element)).toEqual(true);
    });

    test('returns true for Switch component', () => {
      const element = render(<Switch testID="switch" />).getByTestId('switch');
      expect(isAccessibilityElement(element)).toEqual(true);
    });

    test('returns false for View component', () => {
      const element = render(<View testID="element" />).getByTestId('element');
      expect(isAccessibilityElement(element)).toEqual(false);
    });
  });

  describe('when accessible prop is defined', () => {
    test('returns false when accessible prop is set to false', () => {
      const element = render(
        <TextInput accessible={false} testID="input">
          Hey
        </TextInput>
      ).getByTestId('input');
      expect(isAccessibilityElement(element)).toEqual(false);
    });

    test('returns true when accessible prop is set to true', () => {
      const element = render(
        <View accessible={true} testID="view" />
      ).getByTestId('view');
      expect(isAccessibilityElement(element)).toEqual(true);
    });
  });

  test('returns false when given null', () => {
    expect(isAccessibilityElement(null)).toEqual(false);
  });
});
