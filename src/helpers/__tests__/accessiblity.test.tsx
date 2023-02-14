import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { render, isHiddenFromAccessibility, isInaccessible } from '../..';
import { isAccessibilityElement } from '../accessiblity';

describe('isHiddenFromAccessibility', () => {
  test('returns false for accessible elements', () => {
    expect(
      isHiddenFromAccessibility(
        render(<View testID="subject" />).getByTestId('subject', {
          includeHiddenElements: true,
        })
      )
    ).toBe(false);

    expect(
      isHiddenFromAccessibility(
        render(<Text testID="subject">Hello</Text>).getByTestId('subject', {
          includeHiddenElements: true,
        })
      )
    ).toBe(false);

    expect(
      isHiddenFromAccessibility(
        render(<TextInput testID="subject" />).getByTestId('subject', {
          includeHiddenElements: true,
        })
      )
    ).toBe(false);
  });

  test('returns true for null elements', () => {
    expect(isHiddenFromAccessibility(null)).toBe(true);
  });

  test('detects elements with accessibilityElementsHidden prop', () => {
    const view = render(<View testID="subject" accessibilityElementsHidden />);
    expect(
      isHiddenFromAccessibility(
        view.getByTestId('subject', {
          includeHiddenElements: true,
        })
      )
    ).toBe(true);
  });

  test('detects nested elements with accessibilityElementsHidden prop', () => {
    const view = render(
      <View accessibilityElementsHidden>
        <View testID="subject" />
      </View>
    );
    expect(
      isHiddenFromAccessibility(
        view.getByTestId('subject', {
          includeHiddenElements: true,
        })
      )
    ).toBe(true);
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
    expect(
      isHiddenFromAccessibility(
        view.getByTestId('subject', {
          includeHiddenElements: true,
        })
      )
    ).toBe(true);
  });

  test('detects elements with importantForAccessibility="no-hide-descendants" prop', () => {
    const view = render(
      <View testID="subject" importantForAccessibility="no-hide-descendants" />
    );
    expect(
      isHiddenFromAccessibility(
        view.getByTestId('subject', {
          includeHiddenElements: true,
        })
      )
    ).toBe(true);
  });

  test('detects nested elements with importantForAccessibility="no-hide-descendants" prop', () => {
    const view = render(
      <View importantForAccessibility="no-hide-descendants">
        <View testID="subject" />
      </View>
    );
    expect(
      isHiddenFromAccessibility(
        view.getByTestId('subject', {
          includeHiddenElements: true,
        })
      )
    ).toBe(true);
  });

  test('detects elements with display=none', () => {
    const view = render(<View testID="subject" style={{ display: 'none' }} />);
    expect(
      isHiddenFromAccessibility(
        view.getByTestId('subject', {
          includeHiddenElements: true,
        })
      )
    ).toBe(true);
  });

  test('detects nested elements with display=none', () => {
    const view = render(
      <View style={{ display: 'none' }}>
        <View testID="subject" />
      </View>
    );
    expect(
      isHiddenFromAccessibility(
        view.getByTestId('subject', {
          includeHiddenElements: true,
        })
      )
    ).toBe(true);
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
    expect(
      isHiddenFromAccessibility(
        view.getByTestId('subject', {
          includeHiddenElements: true,
        })
      )
    ).toBe(true);
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
    expect(
      isHiddenFromAccessibility(
        view.getByTestId('subject', {
          includeHiddenElements: true,
        })
      )
    ).toBe(true);
  });

  test('is not trigged by opacity = 0', () => {
    const view = render(<View testID="subject" style={{ opacity: 0 }} />);
    expect(
      isHiddenFromAccessibility(
        view.getByTestId('subject', {
          includeHiddenElements: true,
        })
      )
    ).toBe(false);
  });

  test('detects siblings of element with accessibilityViewIsModal prop', () => {
    const view = render(
      <View>
        <View accessibilityViewIsModal />
        <View testID="subject" />
      </View>
    );
    expect(
      isHiddenFromAccessibility(
        view.getByTestId('subject', {
          includeHiddenElements: true,
        })
      )
    ).toBe(true);
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
    expect(
      isHiddenFromAccessibility(
        view.getByTestId('subject', {
          includeHiddenElements: true,
        })
      )
    ).toBe(true);
  });

  test('is not triggered for element with accessibilityViewIsModal prop', () => {
    const view = render(
      <View>
        <View accessibilityViewIsModal testID="subject" />
      </View>
    );
    expect(
      isHiddenFromAccessibility(
        view.getByTestId('subject', {
          includeHiddenElements: true,
        })
      )
    ).toBe(false);
  });

  test('is not triggered for child of element with accessibilityViewIsModal prop', () => {
    const view = render(
      <View>
        <View accessibilityViewIsModal>
          <View testID="subject" />
        </View>
      </View>
    );
    expect(
      isHiddenFromAccessibility(
        view.getByTestId('subject', {
          includeHiddenElements: true,
        })
      )
    ).toBe(false);
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
    expect(
      isHiddenFromAccessibility(
        view.getByTestId('subject', {
          includeHiddenElements: true,
        })
      )
    ).toBe(false);
  });

  test('has isInaccessible alias', () => {
    expect(isInaccessible).toBe(isHiddenFromAccessibility);
  });
});

describe('isAccessibilityElement', () => {
  test('matches View component properly', () => {
    const { getByTestId } = render(
      <View>
        <View testID="default" />
        <View testID="true" accessible />
        <View testID="false" accessible={false} />
      </View>
    );
    expect(isAccessibilityElement(getByTestId('default'))).toBeFalsy();
    expect(isAccessibilityElement(getByTestId('true'))).toBeTruthy();
    expect(isAccessibilityElement(getByTestId('false'))).toBeFalsy();
  });

  test('matches TextInput component properly', () => {
    const { getByTestId } = render(
      <View>
        <TextInput testID="default" />
        <TextInput testID="true" accessible />
        <TextInput testID="false" accessible={false} />
      </View>
    );
    expect(isAccessibilityElement(getByTestId('default'))).toBeTruthy();
    expect(isAccessibilityElement(getByTestId('true'))).toBeTruthy();
    expect(isAccessibilityElement(getByTestId('false'))).toBeFalsy();
  });

  test('matches Text component properly', () => {
    const { getByTestId } = render(
      <View>
        <Text testID="default">Default</Text>
        <Text testID="true" accessible>
          True
        </Text>
        <Text testID="false" accessible={false}>
          False
        </Text>
      </View>
    );
    expect(isAccessibilityElement(getByTestId('default'))).toBeTruthy();
    expect(isAccessibilityElement(getByTestId('true'))).toBeTruthy();
    expect(isAccessibilityElement(getByTestId('false'))).toBeFalsy();
  });

  test('matches Switch component properly', () => {
    const { getByTestId } = render(
      <View>
        <Switch testID="default" />
        <Switch testID="true" accessible />
        <Switch testID="false" accessible={false} />
      </View>
    );
    expect(isAccessibilityElement(getByTestId('default'))).toBeTruthy();
    expect(isAccessibilityElement(getByTestId('true'))).toBeTruthy();
    expect(isAccessibilityElement(getByTestId('false'))).toBeFalsy();
  });

  test('matches Pressable component properly', () => {
    const { getByTestId } = render(
      <View>
        <Pressable testID="default" />
        <Pressable testID="true" accessible />
        <Pressable testID="false" accessible={false} />
      </View>
    );
    expect(isAccessibilityElement(getByTestId('default'))).toBeTruthy();
    expect(isAccessibilityElement(getByTestId('true'))).toBeTruthy();
    expect(isAccessibilityElement(getByTestId('false'))).toBeFalsy();
  });

  test('matches TouchableOpacity component properly', () => {
    const { getByTestId } = render(
      <View>
        <TouchableOpacity testID="default" />
        <TouchableOpacity testID="true" accessible />
        <TouchableOpacity testID="false" accessible={false} />
      </View>
    );
    expect(isAccessibilityElement(getByTestId('default'))).toBeTruthy();
    expect(isAccessibilityElement(getByTestId('true'))).toBeTruthy();
    expect(isAccessibilityElement(getByTestId('false'))).toBeFalsy();
  });

  test('returns false when given null', () => {
    expect(isAccessibilityElement(null)).toEqual(false);
  });
});
