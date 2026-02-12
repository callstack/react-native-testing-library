import React from 'react';
import { Image, Pressable, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { isHiddenFromAccessibility, isInaccessible, render, screen } from '../..';
import {
  computeAccessibleName,
  computeAriaBusy,
  computeAriaChecked,
  computeAriaDisabled,
  computeAriaExpanded,
  computeAriaLabel,
  computeAriaSelected,
  computeAriaValue,
  getRole,
  isAccessibilityElement,
  normalizeRole,
} from '../accessibility';

describe('isHiddenFromAccessibility', () => {
  test('returns false for accessible elements', async () => {
    expect(
      isHiddenFromAccessibility(
        (await render(<View testID="subject" />)).getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(false);

    expect(
      isHiddenFromAccessibility(
        (await render(<Text testID="subject">Hello</Text>)).getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(false);

    expect(
      isHiddenFromAccessibility(
        (await render(<TextInput testID="subject" />)).getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(false);
  });

  test('returns true for null elements', () => {
    expect(isHiddenFromAccessibility(null)).toBe(true);
  });

  test('detects elements with aria-hidden prop', async () => {
    await render(<View testID="subject" aria-hidden />);
    expect(
      isHiddenFromAccessibility(
        screen.getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(true);
  });

  test('detects nested elements with aria-hidden prop', async () => {
    await render(
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

  test('detects elements with accessibilityElementsHidden prop', async () => {
    await render(<View testID="subject" accessibilityElementsHidden />);
    expect(
      isHiddenFromAccessibility(
        screen.getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(true);
  });

  test('detects nested elements with accessibilityElementsHidden prop', async () => {
    await render(
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

  test('detects deeply nested elements with accessibilityElementsHidden prop', async () => {
    await render(
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

  test('detects elements with importantForAccessibility="no-hide-descendants" prop', async () => {
    await render(<View testID="subject" importantForAccessibility="no-hide-descendants" />);
    expect(
      isHiddenFromAccessibility(
        screen.getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(true);
  });

  test('detects nested elements with importantForAccessibility="no-hide-descendants" prop', async () => {
    await render(
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

  test('detects elements with display=none', async () => {
    await render(<View testID="subject" style={{ display: 'none' }} />);
    expect(
      isHiddenFromAccessibility(
        screen.getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(true);
  });

  test('detects nested elements with display=none', async () => {
    await render(
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

  test('detects deeply nested elements with display=none', async () => {
    await render(
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

  test('detects elements with display=none with complex style', async () => {
    await render(
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

  test('is not trigged by opacity = 0', async () => {
    await render(<View testID="subject" style={{ opacity: 0 }} />);
    expect(
      isHiddenFromAccessibility(
        screen.getByTestId('subject', {
          includeHiddenElements: true,
        }),
      ),
    ).toBe(false);
  });

  test('detects siblings of element with accessibilityViewIsModal prop', async () => {
    await render(
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

  test('detects deeply nested siblings of element with accessibilityViewIsModal prop', async () => {
    await render(
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

  test('detects siblings of element with "aria-modal" prop', async () => {
    await render(
      <View>
        <View aria-modal />
        <View testID="subject" />
      </View>,
    );
    expect(
      isHiddenFromAccessibility(screen.getByTestId('subject', { includeHiddenElements: true })),
    ).toBe(true);
  });

  test('is not triggered for element with accessibilityViewIsModal prop', async () => {
    await render(<View accessibilityViewIsModal testID="subject" />);
    expect(isHiddenFromAccessibility(screen.getByTestId('subject'))).toBe(false);
  });

  test('is not triggered for child of element with accessibilityViewIsModal prop', async () => {
    await render(
      <View accessibilityViewIsModal>
        <View testID="subject" />
      </View>,
    );
    expect(isHiddenFromAccessibility(screen.getByTestId('subject'))).toBe(false);
  });

  test('is not triggered for descendent of element with accessibilityViewIsModal prop', async () => {
    await render(
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

  test('uses cache when provided', async () => {
    await render(
      <View>
        <View testID="subject" />
      </View>,
    );
    const element = screen.getByTestId('subject', { includeHiddenElements: true });
    const cache = new WeakMap();

    // First call populates the cache
    isHiddenFromAccessibility(element, { cache });
    // Second call should use the cache
    expect(isHiddenFromAccessibility(element, { cache })).toBe(false);
  });

  test('has isInaccessible alias', () => {
    expect(isInaccessible).toBe(isHiddenFromAccessibility);
  });

  test('is not triggered for element with "aria-modal" prop', async () => {
    await render(<View aria-modal testID="subject" />);
    expect(isHiddenFromAccessibility(screen.getByTestId('subject'))).toBe(false);
  });
});

describe('isAccessibilityElement', () => {
  test('matches View component properly', async () => {
    await render(
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

  test('matches TextInput component properly', async () => {
    await render(
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

  test('matches Text component properly', async () => {
    await render(
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

  test('matches Switch component properly', async () => {
    await render(
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

  test('matches Pressable component properly', async () => {
    await render(
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

  test('matches TouchableOpacity component properly', async () => {
    await render(
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

  test('matches Image component with alt prop', async () => {
    await render(
      <View>
        <Image testID="with-alt" alt="Test image" />
        <Image testID="without-alt" />
      </View>,
    );
    expect(isAccessibilityElement(screen.getByTestId('with-alt'))).toBeTruthy();
    expect(isAccessibilityElement(screen.getByTestId('without-alt'))).toBeFalsy();
  });

  test('returns false when given null', () => {
    expect(isAccessibilityElement(null)).toEqual(false);
  });
});

describe('computeAriaLabel', () => {
  test('supports basic usage', async () => {
    await render(
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

  test('label priority', async () => {
    await render(
      <View>
        <View testID="subject" aria-label="Internal Label" aria-labelledby="external-content" />
        <View nativeID="external-content">
          <Text>External Label</Text>
        </View>
      </View>,
    );

    expect(computeAriaLabel(screen.getByTestId('subject'))).toEqual('External Label');
  });

  test('supports accessibilityLabel', async () => {
    await render(<View testID="subject" accessibilityLabel="Legacy Label" />);
    expect(computeAriaLabel(screen.getByTestId('subject'))).toEqual('Legacy Label');
  });

  test('supports accessibilityLabelledBy', async () => {
    await render(
      <View>
        <View testID="subject" accessibilityLabelledBy="ext-label" />
        <View nativeID="ext-label">
          <Text>External</Text>
        </View>
      </View>,
    );
    expect(computeAriaLabel(screen.getByTestId('subject'))).toEqual('External');
  });

  test('supports Image with alt prop', async () => {
    await render(<Image testID="subject" alt="Image Alt" />);
    expect(computeAriaLabel(screen.getByTestId('subject'))).toEqual('Image Alt');
  });

  test('returns undefined when aria-labelledby references non-existent element', async () => {
    await render(<View testID="subject" aria-labelledby="non-existent-id" />);
    expect(computeAriaLabel(screen.getByTestId('subject'))).toBeUndefined();
  });
});

describe('computeAriaDisabled', () => {
  test('supports basic usage', async () => {
    await render(
      <View>
        <View testID="default" />
        <View testID="disabled" aria-disabled />
        <View testID="disabled-false" aria-disabled={false} />
        <View testID="disabled-by-state" accessibilityState={{ disabled: true }} />
        <View testID="disabled-false-by-state" accessibilityState={{ disabled: false }} />
      </View>,
    );

    expect(computeAriaDisabled(screen.getByTestId('default'))).toBe(false);
    expect(computeAriaDisabled(screen.getByTestId('disabled'))).toBe(true);
    expect(computeAriaDisabled(screen.getByTestId('disabled-false'))).toBe(false);
    expect(computeAriaDisabled(screen.getByTestId('disabled-by-state'))).toBe(true);
    expect(computeAriaDisabled(screen.getByTestId('disabled-false-by-state'))).toBe(false);
  });

  test('supports TextInput', async () => {
    await render(
      <View>
        <TextInput testID="default" />
        <TextInput testID="editable" editable />
        <TextInput testID="editable-false" editable={false} />
      </View>,
    );

    expect(computeAriaDisabled(screen.getByTestId('default'))).toBe(false);
    expect(computeAriaDisabled(screen.getByTestId('editable'))).toBe(false);
    expect(computeAriaDisabled(screen.getByTestId('editable-false'))).toBe(true);
  });

  test('supports Button', async () => {
    await render(
      <View>
        <Pressable testID="default" role="button">
          <Text>Default Button</Text>
        </Pressable>
        <Pressable testID="disabled" role="button" disabled>
          <Text>Disabled Button</Text>
        </Pressable>
        <Pressable testID="disabled-false" role="button" disabled={false}>
          <Text>Disabled False Button</Text>
        </Pressable>
      </View>,
    );

    expect(computeAriaDisabled(screen.getByTestId('default'))).toBe(false);
    expect(computeAriaDisabled(screen.getByTestId('disabled'))).toBe(true);
    expect(computeAriaDisabled(screen.getByTestId('disabled-false'))).toBe(false);
  });

  test('supports Text', async () => {
    await render(
      <View>
        <Text>Default Text</Text>
        <Text disabled>Disabled Text</Text>
        <Text aria-disabled>ARIA Disabled Text</Text>
      </View>,
    );

    expect(computeAriaDisabled(screen.getByText('Default Text'))).toBe(false);
    expect(computeAriaDisabled(screen.getByText('Disabled Text'))).toBe(true);
    expect(computeAriaDisabled(screen.getByText('ARIA Disabled Text'))).toBe(true);
  });
});

describe('getRole', () => {
  test('returns explicit role from "role" prop', async () => {
    await render(<View testID="subject" role="button" />);
    expect(getRole(screen.getByTestId('subject'))).toBe('button');
  });

  test('returns explicit role from "accessibilityRole" prop', async () => {
    await render(<View testID="subject" accessibilityRole="link" />);
    expect(getRole(screen.getByTestId('subject'))).toBe('link');
  });

  test('prefers "role" over "accessibilityRole"', async () => {
    await render(<View testID="subject" role="button" accessibilityRole="link" />);
    expect(getRole(screen.getByTestId('subject'))).toBe('button');
  });

  test('returns "text" for Text elements', async () => {
    await render(<Text testID="subject">Hello</Text>);
    expect(getRole(screen.getByTestId('subject'))).toBe('text');
  });

  test('returns "none" for elements without explicit role', async () => {
    await render(<View testID="subject" />);
    expect(getRole(screen.getByTestId('subject'))).toBe('none');
  });

  test('normalizes "image" role to "img"', async () => {
    await render(<View testID="subject" accessibilityRole="image" />);
    expect(getRole(screen.getByTestId('subject'))).toBe('img');
  });
});

describe('normalizeRole', () => {
  test('converts "image" to "img"', () => {
    expect(normalizeRole('image')).toBe('img');
  });

  test('passes through other roles unchanged', () => {
    expect(normalizeRole('button')).toBe('button');
    expect(normalizeRole('link')).toBe('link');
    expect(normalizeRole('none')).toBe('none');
  });
});

describe('computeAriaBusy', () => {
  test('returns false by default', async () => {
    await render(<View testID="subject" />);
    expect(computeAriaBusy(screen.getByTestId('subject'))).toBe(false);
  });

  test('supports aria-busy prop', async () => {
    await render(<View testID="subject" aria-busy />);
    expect(computeAriaBusy(screen.getByTestId('subject'))).toBe(true);
  });

  test('supports accessibilityState.busy', async () => {
    await render(<View testID="subject" accessibilityState={{ busy: true }} />);
    expect(computeAriaBusy(screen.getByTestId('subject'))).toBe(true);
  });
});

describe('computeAriaChecked', () => {
  test('returns undefined for roles that do not support checked', async () => {
    await render(<View testID="subject" role="button" aria-checked />);
    expect(computeAriaChecked(screen.getByTestId('subject'))).toBeUndefined();
  });

  test('supports aria-checked for checkbox role', async () => {
    await render(
      <View>
        <View testID="checked" role="checkbox" aria-checked />
        <View testID="unchecked" role="checkbox" aria-checked={false} />
        <View testID="mixed" role="checkbox" aria-checked="mixed" />
      </View>,
    );
    expect(computeAriaChecked(screen.getByTestId('checked'))).toBe(true);
    expect(computeAriaChecked(screen.getByTestId('unchecked'))).toBe(false);
    expect(computeAriaChecked(screen.getByTestId('mixed'))).toBe('mixed');
  });

  test('supports accessibilityState.checked for radio role', async () => {
    await render(
      <View testID="subject" accessibilityRole="radio" accessibilityState={{ checked: true }} />,
    );
    expect(computeAriaChecked(screen.getByTestId('subject'))).toBe(true);
  });

  test('supports Switch component value', async () => {
    await render(
      <View>
        <Switch testID="on" value={true} />
        <Switch testID="off" value={false} />
      </View>,
    );
    expect(computeAriaChecked(screen.getByTestId('on'))).toBe(true);
    expect(computeAriaChecked(screen.getByTestId('off'))).toBe(false);
  });
});

describe('computeAriaExpanded', () => {
  test('returns undefined by default', async () => {
    await render(<View testID="subject" />);
    expect(computeAriaExpanded(screen.getByTestId('subject'))).toBeUndefined();
  });

  test('supports aria-expanded prop', async () => {
    await render(
      <View>
        <View testID="expanded" aria-expanded />
        <View testID="collapsed" aria-expanded={false} />
      </View>,
    );
    expect(computeAriaExpanded(screen.getByTestId('expanded'))).toBe(true);
    expect(computeAriaExpanded(screen.getByTestId('collapsed'))).toBe(false);
  });

  test('supports accessibilityState.expanded', async () => {
    await render(
      <View testID="subject" accessibilityState={{ expanded: true }} />,
    );
    expect(computeAriaExpanded(screen.getByTestId('subject'))).toBe(true);
  });
});

describe('computeAriaSelected', () => {
  test('returns false by default', async () => {
    await render(<View testID="subject" />);
    expect(computeAriaSelected(screen.getByTestId('subject'))).toBe(false);
  });

  test('supports aria-selected prop', async () => {
    await render(<View testID="subject" aria-selected />);
    expect(computeAriaSelected(screen.getByTestId('subject'))).toBe(true);
  });

  test('supports accessibilityState.selected', async () => {
    await render(
      <View testID="subject" accessibilityState={{ selected: true }} />,
    );
    expect(computeAriaSelected(screen.getByTestId('subject'))).toBe(true);
  });
});

describe('computeAriaValue', () => {
  test('returns empty values by default', async () => {
    await render(<View testID="subject" />);
    expect(computeAriaValue(screen.getByTestId('subject'))).toEqual({
      min: undefined,
      max: undefined,
      now: undefined,
      text: undefined,
    });
  });

  test('supports aria-value* props', async () => {
    await render(
      <View
        testID="subject"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        aria-valuetext="50%"
      />,
    );
    expect(computeAriaValue(screen.getByTestId('subject'))).toEqual({
      min: 0,
      max: 100,
      now: 50,
      text: '50%',
    });
  });

  test('supports accessibilityValue prop', async () => {
    await render(
      <View
        testID="subject"
        accessibilityValue={{ min: 0, max: 100, now: 25, text: '25%' }}
      />,
    );
    expect(computeAriaValue(screen.getByTestId('subject'))).toEqual({
      min: 0,
      max: 100,
      now: 25,
      text: '25%',
    });
  });

  test('aria-value* props take precedence over accessibilityValue', async () => {
    await render(
      <View
        testID="subject"
        aria-valuenow={75}
        accessibilityValue={{ min: 0, max: 100, now: 50, text: '50%' }}
      />,
    );
    const value = computeAriaValue(screen.getByTestId('subject'));
    expect(value.now).toBe(75);
    expect(value.min).toBe(0);
  });
});

describe('computeAccessibleName', () => {
  test('basic cases', async () => {
    await render(
      <>
        <View testID="aria-label" aria-label="ARIA Label" />
        <View testID="accessibility-label" accessibilityLabel="Accessibility Label" />
        <View testID="text-content">
          <Text>Text Content</Text>
        </View>
        <TextInput testID="text-input" placeholder="Text Input" />
        <Image testID="image" alt="Image Alt" src="https://example.com/image.jpg" />
      </>,
    );
    expect(computeAccessibleName(screen.getByTestId('aria-label'))).toBe('ARIA Label');
    expect(computeAccessibleName(screen.getByTestId('accessibility-label'))).toBe(
      'Accessibility Label',
    );
    expect(computeAccessibleName(screen.getByTestId('text-content'))).toBe('Text Content');
    expect(computeAccessibleName(screen.getByTestId('text-input'))).toBe('Text Input');
    expect(computeAccessibleName(screen.getByTestId('image'))).toBe('Image Alt');
  });

  test('basic precedence', async () => {
    await render(
      <>
        <View testID="aria-label" aria-label="ARIA Label" accessibilityLabel="Accessibility Label">
          <Text>Text Content</Text>
        </View>
        <View testID="accessibility-label" accessibilityLabel="Accessibility Label">
          <Text>Text Content</Text>
        </View>
        <View testID="text-content">
          <Text>Text Content</Text>
        </View>
      </>,
    );
    expect(computeAccessibleName(screen.getByTestId('aria-label'))).toBe('ARIA Label');
    expect(computeAccessibleName(screen.getByTestId('accessibility-label'))).toBe(
      'Accessibility Label',
    );
    expect(computeAccessibleName(screen.getByTestId('text-content'))).toBe('Text Content');
  });

  test('concatenates children accessible names', async () => {
    await render(
      <>
        <View testID="multiple-text">
          <Text>Hello</Text>
          <Text>World</Text>
        </View>
        <View testID="nested-views">
          <View>
            <Text>Hello</Text>
          </View>
          <View>
            <Text>World</Text>
          </View>
        </View>
        <View testID="child-with-label">
          <View aria-label="Hello" />
          <Text>World</Text>
        </View>
        <View testID="deeply-nested">
          <View>
            <View>
              <Text>Hello</Text>
            </View>
          </View>
          <Text>World</Text>
        </View>
        <View testID="child-label-over-text">
          <View aria-label="Hello">
            <Text>Ignored</Text>
          </View>
          <Text>World</Text>
        </View>
        <View testID="child-accessibility-label-over-text">
          <View accessibilityLabel="Hello">
            <Text>Ignored</Text>
          </View>
          <Text>World</Text>
        </View>
      </>,
    );
    expect(computeAccessibleName(screen.getByTestId('multiple-text'))).toBe('Hello World');
    expect(computeAccessibleName(screen.getByTestId('nested-views'))).toBe('Hello World');
    expect(computeAccessibleName(screen.getByTestId('child-with-label'))).toBe('Hello World');
    expect(computeAccessibleName(screen.getByTestId('deeply-nested'))).toBe('Hello World');
    expect(computeAccessibleName(screen.getByTestId('child-label-over-text'))).toBe('Hello World');
    expect(computeAccessibleName(screen.getByTestId('child-accessibility-label-over-text'))).toBe(
      'Hello World',
    );
  });

  test('TextInput placeholder is used only for the element itself', async () => {
    await render(
      <>
        <TextInput testID="text-input" placeholder="Placeholder" />
        <View testID="parent">
          <TextInput placeholder="Placeholder" />
          <Text>Hello</Text>
        </View>
        <View testID="parent-no-text">
          <TextInput placeholder="Placeholder" />
        </View>
      </>,
    );
    expect(computeAccessibleName(screen.getByTestId('text-input'))).toBe('Placeholder');
    expect(computeAccessibleName(screen.getByTestId('parent'))).toBe('Hello');
    expect(computeAccessibleName(screen.getByTestId('parent-no-text'))).toBe('');
  });
});