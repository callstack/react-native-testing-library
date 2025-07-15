/**
 * React Native Testing Library Tutorial - Chapter 3: Jest Matchers
 *
 * This chapter introduces you to the powerful jest matchers provided by React Native Testing Library.
 * These matchers extend Jest's built-in expect() function with React Native-specific assertions,
 * making your tests more readable and providing better error messages.
 *
 * Jest matchers are the "assertions" in your tests - they check if your components behave as expected.
 * Instead of writing complex conditional logic, you can use descriptive matchers that clearly
 * express what you're testing for.
 *
 * All matchers can be negated using .not - for example:
 * - expect(element).toBeOnTheScreen() - asserts element is rendered
 * - expect(element).not.toBeOnTheScreen() - asserts element is NOT rendered
 */

import * as React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text, TextInput, View } from 'react-native';
import { s } from 'react-strict-dom/runtime';

/**
 * MATCHER 1: toBeOnTheScreen()
 *
 * The most fundamental matcher - checks if an element is rendered in the component tree.
 * This is equivalent to checking if an element exists and is not null.
 *
 * Usage:
 * - expect(element).toBeOnTheScreen() - element should be rendered
 * - expect(element).not.toBeOnTheScreen() - element should not be rendered
 */
test('showcase: toBeOnTheScreen', () => {
  render(
    <View>
      <View testID="view" />
    </View>,
  );

  // Assert that the view with testID "view" is rendered
  expect(screen.getByTestId('view')).toBeOnTheScreen();

  // Assert that a non-existent element is not rendered
  // Note: queryByTestId returns null if element not found, getByTestId would throw
  expect(screen.queryByTestId('non-existent')).not.toBeOnTheScreen();
});

/**
 * MATCHER 2: toHaveTextContent()
 *
 * Checks if an element contains specific text content. This matcher is very flexible:
 * - Supports exact string matching
 * - Supports regular expressions for pattern matching
 * - Supports partial matching with { exact: false } option
 *
 * Usage:
 * - expect(element).toHaveTextContent('exact text')
 * - expect(element).toHaveTextContent(/pattern/i) - regex with case-insensitive flag
 * - expect(element).toHaveTextContent('partial', { exact: false })
 */
test('showcase: toBeIntoHaveTextContentTheDocument', () => {
  render(
    <View>
      <Text testID="text">Hello World</Text>
    </View>,
  );

  // Exact text match
  expect(screen.getByTestId('text')).toHaveTextContent('Hello World');

  // Regular expression match (case-insensitive)
  expect(screen.getByTestId('text')).toHaveTextContent(/hello/i);

  // Partial text match - useful when you only care about part of the text
  expect(screen.getByTestId('text')).toHaveTextContent('Hello', { exact: false });
});

/**
 * MATCHER 3: toContainElement()
 *
 * Checks if one element contains another element as a descendant.
 * This is useful for testing component hierarchies and nested structures.
 *
 * Usage:
 * - expect(parentElement).toContainElement(childElement)
 * - expect(parentElement).not.toContainElement(unrelatedElement)
 */
test('showcase: toContainElement', () => {
  render(
    <View>
      <View testID="outer">
        <View testID="inner" />
      </View>
      <View testID="outer-2" />
    </View>,
  );

  // Assert that "outer" contains "inner" as a descendant
  expect(screen.getByTestId('outer')).toContainElement(screen.getByTestId('inner'));

  // Assert that "outer" does not contain "outer-2" (they are siblings)
  expect(screen.getByTestId('outer')).not.toContainElement(screen.getByTestId('outer-2'));
});

/**
 * MATCHER 4: toBeEmptyElement()
 *
 * Checks if an element has no children (is empty).
 * This is useful for testing loading states, empty lists, or components
 * that should render nothing under certain conditions.
 *
 * Usage:
 * - expect(element).toBeEmptyElement() - element has no children
 * - expect(element).not.toBeEmptyElement() - element has children
 */
test('showcase: toBeEmptyElement', () => {
  render(
    <View>
      <View testID="empty" />
      <View testID="not-empty">
        <Text testID="text">Hello World</Text>
      </View>
    </View>,
  );

  // Assert that the empty view has no children
  expect(screen.getByTestId('empty')).toBeEmptyElement();

  // Assert that the view with text content is not empty
  expect(screen.getByTestId('not-empty')).not.toBeEmptyElement();
});

/**
 * MATCHER 5: toHaveDisplayValue()
 *
 * Checks the display value of form elements like TextInput.
 * This matcher is specifically designed for input elements and checks
 * their current value, not their placeholder or other properties.
 *
 * Usage:
 * - expect(inputElement).toHaveDisplayValue('expected value')
 * - expect(inputElement).toHaveDisplayValue(['value1', 'value2']) - for multiple values
 */
test('showcase: toHaveDisplayValue', () => {
  render(
    <View>
      <TextInput testID="input" value="Hello" />
    </View>,
  );

  // Assert that the TextInput displays the expected value
  expect(screen.getByTestId('input')).toHaveDisplayValue('Hello');
});

/**
 * MATCHER 6: toHaveAccessibilityValue()
 *
 * Checks accessibility value properties of elements. This is crucial for testing
 * accessibility features and ensuring your app works well with screen readers.
 *
 * The matcher can check:
 * - text: aria-valuetext (string description of the value)
 * - now: aria-valuenow (current numeric value)
 * - min: aria-valuemin (minimum value)
 * - max: aria-valuemax (maximum value)
 *
 * Usage:
 * - expect(element).toHaveAccessibilityValue({ text: 'description' })
 * - expect(element).toHaveAccessibilityValue({ now: 50, min: 0, max: 100 })
 */
test('showcase: toHaveAccessibilityValue', () => {
  render(
    <View>
      <View
        testID="view"
        aria-valuetext="33%"
        aria-valuenow={33}
        aria-valuemax={100}
        aria-valuemin={0}
      />
    </View>,
  );

  // Check accessibility value text
  expect(screen.getByTestId('view')).toHaveAccessibilityValue({ text: '33%' });

  // Check current accessibility value
  expect(screen.getByTestId('view')).toHaveAccessibilityValue({ now: 33 });

  // Check multiple accessibility values at once
  expect(screen.getByTestId('view')).toHaveAccessibilityValue({ now: 33, min: 0, max: 100 });
});

/**
 * MATCHER 7: toBeEnabled() / toBeDisabled()
 *
 * Checks if an element is enabled or disabled based on the aria-disabled attribute.
 * These matchers are particularly useful for testing form elements and interactive components.
 *
 * Usage:
 * - expect(element).toBeEnabled() - element is interactive
 * - expect(element).toBeDisabled() - element is disabled
 * - expect(element).not.toBeEnabled() - same as toBeDisabled()
 * - expect(element).not.toBeDisabled() - same as toBeEnabled()
 */
test('showcase: toBeEnabled/toBeDisabled', () => {
  render(
    <View>
      <View testID="enabled" aria-disabled={false} />
      <View testID="disabled" aria-disabled />
    </View>,
  );

  // Test enabled element
  expect(screen.getByTestId('enabled')).toBeEnabled();
  expect(screen.getByTestId('enabled')).not.toBeDisabled();

  // Test disabled element
  expect(screen.getByTestId('disabled')).toBeDisabled();
  expect(screen.getByTestId('disabled')).not.toBeEnabled();
});

/**
 * MATCHER 8: toBeSelected()
 *
 * Checks if an element is selected based on the aria-selected attribute.
 * This is useful for testing selectable lists, tabs, or other components
 * where items can be selected.
 *
 * Usage:
 * - expect(element).toBeSelected() - element is selected
 * - expect(element).not.toBeSelected() - element is not selected
 */
test('showcase: toBeSelected', () => {
  render(
    <View>
      <View testID="selected" aria-selected />
      <View testID="not-selected" />
    </View>,
  );

  // Test selected element
  expect(screen.getByTestId('selected')).toBeSelected();

  // Test non-selected element
  expect(screen.getByTestId('not-selected')).not.toBeSelected();
});

/**
 * MATCHER 9: toBeChecked() / toBePartiallyChecked()
 *
 * Checks the checked state of checkboxes and other checkable elements.
 * These matchers work with elements that have role="checkbox" and aria-checked attributes.
 *
 * Checkbox states:
 * - aria-checked={true} or aria-checked - fully checked
 * - aria-checked="mixed" - partially checked (indeterminate)
 * - aria-checked={false} or no aria-checked - unchecked
 *
 * Usage:
 * - expect(checkbox).toBeChecked() - checkbox is checked
 * - expect(checkbox).toBePartiallyChecked() - checkbox is in mixed state
 * - expect(checkbox).not.toBeChecked() - checkbox is not checked
 */
test('showcase: toBeChecked/toBePartiallyChecked (role: checkbox)', () => {
  render(
    <View>
      <View accessible role="checkbox" testID="checked" aria-checked />
      <View accessible role="checkbox" testID="partially-checked" aria-checked="mixed" />
      <View accessible role="checkbox" testID="not-checked" />
    </View>,
  );

  // Test fully checked checkbox
  expect(screen.getByTestId('checked')).toBeChecked();
  expect(screen.getByTestId('checked')).not.toBePartiallyChecked();

  // Test partially checked checkbox
  expect(screen.getByTestId('partially-checked')).toBePartiallyChecked();
  expect(screen.getByTestId('partially-checked')).not.toBeChecked();

  // Test unchecked checkbox
  expect(screen.getByTestId('not-checked')).not.toBeChecked();
  expect(screen.getByTestId('not-checked')).not.toBePartiallyChecked();
});

/**
 * MATCHER 10: toBeChecked() (for switches and radios)
 *
 * The toBeChecked matcher also works with other checkable elements like
 * switches and radio buttons. Note that these don't support partial states.
 *
 * Usage:
 * - expect(switch).toBeChecked() - switch is on
 * - expect(radio).toBeChecked() - radio is selected
 */
test('showcase: toBeChecked (roles: switch, radio)', () => {
  render(
    <View>
      <View accessible role="switch" testID="checked" aria-checked />
      <View accessible role="radio" testID="not-checked" />
    </View>,
  );

  // Test checked switch
  expect(screen.getByTestId('checked')).toBeChecked();

  // Test unchecked radio button
  expect(screen.getByTestId('not-checked')).not.toBeChecked();
});

/**
 * MATCHER 11: toBeBusy()
 *
 * Checks if an element is in a busy state based on the aria-busy attribute.
 * This is useful for testing loading states and async operations.
 *
 * Usage:
 * - expect(element).toBeBusy() - element is in loading/busy state
 * - expect(element).not.toBeBusy() - element is not busy
 */
test('showcase: toBeBusy', () => {
  render(
    <View>
      <View testID="busy" aria-busy />
      <View testID="not-busy" />
    </View>,
  );

  // Test busy element (loading state)
  expect(screen.getByTestId('busy')).toBeBusy();

  // Test non-busy element
  expect(screen.getByTestId('not-busy')).not.toBeBusy();
});

/**
 * MATCHER 12: toBeExpanded() / toBeCollapsed()
 *
 * Checks the expanded/collapsed state of elements based on the aria-expanded attribute.
 * This is useful for testing accordions, dropdown menus, and other expandable components.
 *
 * States:
 * - aria-expanded={true} - expanded
 * - aria-expanded={false} - collapsed
 * - no aria-expanded - neither expanded nor collapsed
 *
 * Usage:
 * - expect(element).toBeExpanded() - element is expanded
 * - expect(element).toBeCollapsed() - element is collapsed
 * - expect(element).not.toBeExpanded() - element is not expanded
 * - expect(element).not.toBeCollapsed() - element is not collapsed
 */
test('showcase: toBeExpanded/toBeCollapsed', () => {
  render(
    <View>
      <View testID="expanded" aria-expanded />
      <View testID="collapsed" aria-expanded={false} />
      <View testID="default" />
    </View>,
  );

  // Test expanded element
  expect(screen.getByTestId('expanded')).toBeExpanded();
  expect(screen.getByTestId('expanded')).not.toBeCollapsed();

  // Test collapsed element
  expect(screen.getByTestId('collapsed')).toBeCollapsed();
  expect(screen.getByTestId('collapsed')).not.toBeExpanded();

  // Test element with no aria-expanded (neither expanded nor collapsed)
  expect(screen.getByTestId('default')).not.toBeCollapsed();
  expect(screen.getByTestId('default')).not.toBeExpanded();
});

/**
 * MATCHER 13: toBeVisible()
 *
 * Checks if an element is visible to the user. An element is considered visible
 * if it has opacity greater than 0 and is not hidden by other means.
 *
 * Note: This checks visual visibility, not whether the element exists in the DOM.
 * An element can be in the DOM but not visible (e.g., opacity: 0).
 *
 * Usage:
 * - expect(element).toBeVisible() - element is visible to user
 * - expect(element).not.toBeVisible() - element is hidden from user
 */
test('showcase: toBeVisible', () => {
  render(
    <View>
      <View testID="visible" />
      <View testID="not-visible" style={{ opacity: 0 }} />
    </View>,
  );

  // Test visible element
  expect(screen.getByTestId('visible')).toBeVisible();

  // Test hidden element (opacity: 0)
  expect(screen.getByTestId('not-visible')).not.toBeVisible();
});

/**
 * MATCHER 14: toHaveStyle()
 *
 * Checks if an element has specific style properties. This matcher is perfect
 * for testing CSS-in-JS styles, conditional styling, and theme applications.
 *
 * You can test:
 * - Single style property: { backgroundColor: 'red' }
 * - Multiple style properties: { backgroundColor: 'red', color: 'white' }
 * - Nested style objects (for some style systems)
 *
 * Usage:
 * - expect(element).toHaveStyle({ property: 'value' })
 * - expect(element).not.toHaveStyle({ property: 'wrongValue' })
 */
test('showcase: toHaveStyle', () => {
  render(
    <View>
      <View testID="view" style={{ backgroundColor: 'red' }} />
    </View>,
  );

  // Test correct style property
  expect(screen.getByTestId('view')).toHaveStyle({ backgroundColor: 'red' });

  // Test incorrect style property
  expect(screen.getByTestId('view')).not.toHaveStyle({ backgroundColor: 'blue' });
});

/**
 * MATCHER 15: toHaveProp()
 *
 * Checks if an element has specific props. This is useful for testing
 * component props, React Native component properties, and custom attributes.
 *
 * You can test:
 * - Prop existence: expect(element).toHaveProp('propName')
 * - Prop value: expect(element).toHaveProp('propName', expectedValue)
 * - Prop absence: expect(element).not.toHaveProp('propName')
 *
 * Usage:
 * - expect(element).toHaveProp('propName') - prop exists
 * - expect(element).toHaveProp('propName', value) - prop has specific value
 * - expect(element).not.toHaveProp('propName') - prop doesn't exist
 */
test('showcase: toHaveProp', () => {
  render(
    <View>
      <Text testID="text" numberOfLines={1} />
    </View>,
  );

  // Test prop existence
  expect(screen.getByTestId('text')).toHaveProp('numberOfLines');
  expect(screen.getByTestId('text')).not.toHaveProp('adjustsFontSizeToFit');

  // Test prop value
  expect(screen.getByTestId('text')).toHaveProp('numberOfLines', 1);
  expect(screen.getByTestId('text')).not.toHaveProp('numberOfLines', 5);
});

/**
 * CHAPTER 3 SUMMARY
 *
 * Jest matchers are powerful tools that make your tests more readable and maintainable.
 * They provide clear, descriptive assertions that express your testing intentions.
 *
 * Key takeaways:
 * 1. Use descriptive matchers instead of complex boolean logic
 * 2. All matchers can be negated with .not
 * 3. Choose the right matcher for what you're testing:
 *    - toBeOnTheScreen() for element existence
 *    - toHaveTextContent() for text content
 *    - toBeEnabled()/toBeDisabled() for interaction states
 *    - toHaveStyle() for styling
 *    - toHaveProp() for component properties
 * 4. Accessibility matchers help ensure your app is inclusive
 * 5. Better matchers lead to better error messages when tests fail
 *
 * Next steps: Practice using these matchers in your own tests and explore
 * combining them with queries and user interactions for comprehensive testing.
 */
