import React from 'react';
import { Pressable, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { isHiddenFromAccessibility, isInaccessible, render, screen } from '../..';
import { computeAriaDisabled, computeAriaLabel, isAccessibilityElement } from '../accessibility';

describe('isHiddenFromAccessibility', () => {
  test('returns false for accessible elements', () => {
    expect(
      isHiddenFromAccessibility(
        render(<View testID="subject" />).getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(false);

    expect(
      isHiddenFromAccessibility(
        render(<Text testID="subject">Hello</Text>).getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(false);

    expect(
      isHiddenFromAccessibility(
        render(<TextInput testID="subject" />).getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(false);
  });

  test('returns true for null elements', () => {
    expect(isHiddenFromAccessibility(null)).toBe(true);
  });

  test('detects elements with aria-hidden prop', () => {
    render(<View testID="subject" aria-hidden />);
    expect(
      isHiddenFromAccessibility(
        screen.getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(true);
  });

  test('detects nested elements with aria-hidden prop', () => {
    render(
      <View aria-hidden>
        <View testID="subject" />
      </View>,
    );
    expect(
      isHiddenFromAccessibility(
        screen.getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(true);
  });

  test('detects elements with accessibilityElementsHidden prop', () => {
    render(<View testID="subject" accessibilityElementsHidden />);
    expect(
      isHiddenFromAccessibility(
        screen.getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(true);
  });

  test('detects nested elements with accessibilityElementsHidden prop', () => {
    render(
      <View accessibilityElementsHidden>
        <View testID="subject" />
      </View>,
    );
    expect(
      isHiddenFromAccessibility(
        screen.getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(true);
  });

  test('detects deeply nested elements with accessibilityElementsHidden prop', () => {
    render(
      <View accessibilityElementsHidden>
        <View>
          <View>
            <View testID="subject" />
          </View>
        </View>
      </View>,
    );
    expect(
      isHiddenFromAccessibility(
        screen.getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(true);
  });

  test('detects elements with importantForAccessibility="no-hide-descendants" prop', () => {
    render(<View testID="subject" importantForAccessibility="no-hide-descendants" />);
    expect(
      isHiddenFromAccessibility(
        screen.getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(true);
  });

  test('detects nested elements with importantForAccessibility="no-hide-descendants" prop', () => {
    render(
      <View importantForAccessibility="no-hide-descendants">
        <View testID="subject" />
      </View>,
    );
    expect(
      isHiddenFromAccessibility(
        screen.getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(true);
  });

  test('detects elements with display=none', () => {
    render(<View testID="subject" style={{ display: 'none' }} />);
    expect(
      isHiddenFromAccessibility(
        screen.getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(true);
  });

  test('detects nested elements with display=none', () => {
    render(
      <View style={{ display: 'none' }}>
        <View testID="subject" />
      </View>,
    );
    expect(
      isHiddenFromAccessibility(
        screen.getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(true);
  });

  test('detects deeply nested elements with display=none', () => {
    render(
      <View style={{ display: 'none' }}>
        <View>
          <View>
            <View testID="subject" />
          </View>
        </View>
      </View>,
    );
    expect(
      isHiddenFromAccessibility(
        screen.getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(true);
  });

  test('detects elements with display=none with complex style', () => {
    render(
      <View
        testID="subject"
        style={[{ display: 'flex' }, [{ display: 'flex' }], { display: 'none' }]}
      />,
    );
    expect(
      isHiddenFromAccessibility(
        screen.getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(true);
  });

  test('is not trigged by opacity = 0', () => {
    render(<View testID="subject" style={{ opacity: 0 }} />);
    expect(
      isHiddenFromAccessibility(
        screen.getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(false);
  });

  test('detects siblings of element with accessibilityViewIsModal prop', () => {
    render(
      <View>
        <View accessibilityViewIsModal />
        <View testID="subject" />
      </View>,
    );
    expect(
      isHiddenFromAccessibility(
        screen.getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(true);
  });

  test('detects deeply nested siblings of element with accessibilityViewIsModal prop', () => {
    render(
      <View>
        <View accessibilityViewIsModal />
        <View>
          <View>
            <View testID="subject" />
          </View>
        </View>
      </View>,
    );
    expect(
      isHiddenFromAccessibility(screen.getByTestId('subject', { includeHiddenElements: true })),
    ).toBe(true);
  });

  test('detects siblings of element with "aria-modal" prop', () => {
    render(
      <View>
        <View aria-modal />
        <View testID="subject" />
      </View>,
    );
    expect(
      isHiddenFromAccessibility(screen.getByTestId('subject', { includeHiddenElements: true })),
    ).toBe(true);
  });

  test('is not triggered for element with accessibilityViewIsModal prop', () => {
    render(<View accessibilityViewIsModal testID="subject" />);
    expect(isHiddenFromAccessibility(screen.getByTestId('subject'))).toBe(false);
  });

  test('is not triggered for child of element with accessibilityViewIsModal prop', () => {
    render(
      <View accessibilityViewIsModal>
        <View testID="subject" />
      </View>,
    );
    expect(isHiddenFromAccessibility(screen.getByTestId('subject'))).toBe(false);
  });

  test('is not triggered for descendent of element with accessibilityViewIsModal prop', () => {
    render(
      <View accessibilityViewIsModal>
        <View>
          <View>
            <View testID="subject" />
          </View>
        </View>
      </View>,
    );
    expect(isHiddenFromAccessibility(screen.getByTestId('subject'))).toBe(false);
  });

  test('has isInaccessible alias', () => {
    expect(isInaccessible).toBe(isHiddenFromAccessibility);
  });

  test('is not triggered for element with "aria-modal" prop', () => {
    render(<View aria-modal testID="subject" />);
    expect(isHiddenFromAccessibility(screen.getByTestId('subject'))).toBe(false);
  });
});

describe('isAccessibilityElement', () => {
  test('matches View component properly', () => {
    render(
      <View>
        <View testID="default" />
        <View testID="true" accessible />
        <View testID="false" accessible={false} />
      </View>,
    );
    expect(isAccessibilityElement(screen.getByTestId('default'))).toBeFalsy();
    expect(isAccessibilityElement(screen.getByTestId('true'))).toBeTruthy();
    expect(isAccessibilityElement(screen.getByTestId('false'))).toBeFalsy();
  });

  test('matches TextInput component properly', () => {
    render(
      <View>
        <TextInput testID="default" />
        <TextInput testID="true" accessible />
        <TextInput testID="false" accessible={false} />
      </View>,
    );
    expect(isAccessibilityElement(screen.getByTestId('default'))).toBeTruthy();
    expect(isAccessibilityElement(screen.getByTestId('true'))).toBeTruthy();
    expect(isAccessibilityElement(screen.getByTestId('false'))).toBeFalsy();
  });

  test('matches Text component properly', () => {
    render(
      <View>
        <Text testID="default">Default</Text>
        <Text testID="true" accessible>
          True
        </Text>
        <Text testID="false" accessible={false}>
          False
        </Text>
      </View>,
    );
    expect(isAccessibilityElement(screen.getByTestId('default'))).toBeTruthy();
    expect(isAccessibilityElement(screen.getByTestId('true'))).toBeTruthy();
    expect(isAccessibilityElement(screen.getByTestId('false'))).toBeFalsy();
  });

  test('matches Switch component properly', () => {
    render(
      <View>
        <Switch testID="default" />
        <Switch testID="true" accessible />
        <Switch testID="false" accessible={false} />
      </View>,
    );
    expect(isAccessibilityElement(screen.getByTestId('default'))).toBeTruthy();
    expect(isAccessibilityElement(screen.getByTestId('true'))).toBeTruthy();
    expect(isAccessibilityElement(screen.getByTestId('false'))).toBeFalsy();
  });

  test('matches Pressable component properly', () => {
    render(
      <View>
        <Pressable testID="default" />
        <Pressable testID="true" accessible />
        <Pressable testID="false" accessible={false} />
      </View>,
    );
    expect(isAccessibilityElement(screen.getByTestId('default'))).toBeTruthy();
    expect(isAccessibilityElement(screen.getByTestId('true'))).toBeTruthy();
    expect(isAccessibilityElement(screen.getByTestId('false'))).toBeFalsy();
  });

  test('matches TouchableOpacity component properly', () => {
    render(
      <View>
        <TouchableOpacity testID="default" />
        <TouchableOpacity testID="true" accessible />
        <TouchableOpacity testID="false" accessible={false} />
      </View>,
    );
    expect(isAccessibilityElement(screen.getByTestId('default'))).toBeTruthy();
    expect(isAccessibilityElement(screen.getByTestId('true'))).toBeTruthy();
    expect(isAccessibilityElement(screen.getByTestId('false'))).toBeFalsy();
  });

  test('returns false when given null', () => {
    expect(isAccessibilityElement(null)).toEqual(false);
  });
});

describe('computeAriaLabel', () => {
  test('supports basic usage', () => {
    render(
      <View>
        <View testID="label" aria-label="Internal Label" />
        <View testID="label-by-id" aria-labelledby="external-label" />
        <View nativeID="external-label">
          <Text>External Text</Text>
        </View>
        <View testID="no-label" />
        <View testID="text-content">
          <Text>Text Content</Text>
        </View>
      </View>,
    );

    expect(computeAriaLabel(screen.getByTestId('label'))).toEqual('Internal Label');
    expect(computeAriaLabel(screen.getByTestId('label-by-id'))).toEqual('External Text');
    expect(computeAriaLabel(screen.getByTestId('no-label'))).toBeUndefined();
    expect(computeAriaLabel(screen.getByTestId('text-content'))).toBeUndefined();
  });

  test('label priority', () => {
    render(
      <View>
        <View testID="subject" aria-label="Internal Label" aria-labelledby="external-content" />
        <View nativeID="external-content">
          <Text>External Label</Text>
        </View>
      </View>,
    );

    expect(computeAriaLabel(screen.getByTestId('subject'))).toEqual('External Label');
  });
});

describe('computeAriaDisabled', () => {
  test('supports basic usage', () => {
    render(
      <View>
        <View testID="disabled" aria-disabled />
        <View testID="not-disabled" />
        <View testID="disabled-by-state" accessibilityState={{ disabled: true }} />
        <View testID="not-disabled-by-state" accessibilityState={{ disabled: false }} />
      </View>,
    );

    expect(computeAriaDisabled(screen.getByTestId('disabled'))).toBe(true);
    expect(computeAriaDisabled(screen.getByTestId('not-disabled'))).toBe(false);
    expect(computeAriaDisabled(screen.getByTestId('disabled-by-state'))).toBe(true);
    expect(computeAriaDisabled(screen.getByTestId('not-disabled-by-state'))).toBe(false);
  });

  test('supports TextInput', () => {
    render(
      <View>
        <TextInput testID="disabled" editable={false} />
        <TextInput testID="not-disabled" editable />
      </View>,
    );

    expect(computeAriaDisabled(screen.getByTestId('disabled'))).toBe(true);
    expect(computeAriaDisabled(screen.getByTestId('not-disabled'))).toBe(false);
  });

  test('supports Button', () => {
    render(
      <View>
        <Pressable testID="disabled" disabled>
          <Text>Disabled Button</Text>
        </Pressable>
        <Pressable testID="not-disabled">
          <Text>Enabled Button</Text>
        </Pressable>
      </View>,
    );

    expect(computeAriaDisabled(screen.getByTestId('disabled'))).toBe(true);
    expect(computeAriaDisabled(screen.getByTestId('not-disabled'))).toBe(false);
  });

  test('supports Text', () => {
    render(
      <View>
        <Text testID="disabled" disabled>
          Disabled Text
        </Text>
        <Text testID="aria-disabled" aria-disabled>
          Disabled Text
        </Text>
        <Text testID="not-disabled">Enabled Text</Text>
      </View>,
    );

    expect(computeAriaDisabled(screen.getByTestId('disabled'))).toBe(true);
    expect(computeAriaDisabled(screen.getByTestId('aria-disabled'))).toBe(true);
    expect(computeAriaDisabled(screen.getByTestId('not-disabled'))).toBe(false);
  });
});
