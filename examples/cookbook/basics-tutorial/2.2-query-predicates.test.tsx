/**
 * React Native Testing Library Tutorial
 * Chapter 2.2: Query Predicates
 *
 * Query predicates are additional options you can pass to query methods to make them more specific.
 * They help you find the exact element you're looking for when multiple elements match the same query.
 *
 * Most commonly used predicate: *ByRole({ name: 'text' })
 * - Matches the element's semantic role
 * - For elements with accessible names (aria-label, accessibilityLabel, or text content)
 * - Helps distinguish between multiple elements of the same type
 * - For example, a button with the text "Login" will be matched by *ByRole({ name: 'Login' })
 *
 * This chapter covers:
 * - Using predicates with *ByRole queries
 * - Different strategies for querying TextInput elements
 * - Various accessible query methods
 * - When to use testID as a last resort
 */

import * as React from 'react';
import { Pressable, Switch, Text, TextInput, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';

/**
 * Test 1: Query by semantic role with predicates
 *
 * The *ByRole query is the most recommended approach because it mirrors how users
 * interact with your app through assistive technologies.
 *
 * Key concept: Using the { name: 'text' } predicate to distinguish between
 * multiple elements with the same role.
 */
test('query by semantic role: *ByRole (highly recommended)', () => {
  render(
    <View>
      {/* Heading role - accessible to screen readers */}
      <Text role="heading">Heading Text</Text>

      {/* Button role - accessible name from its inner Text */}
      <Pressable role="button">
        <Text>Button 1</Text>
      </Pressable>

      {/* Switch role - accessible name from aria-label */}
      <Switch value={true} aria-label="Switch 1" />

      {/* Alert role - for important announcements */}
      <Text role="alert">Alert Text</Text>

      {/* Menu structure - parent menu with multiple menu items */}
      <View accessible role="menu">
        <Text role="menuitem">Menu Item 1</Text>
        <Text role="menuitem">Menu Item 2</Text>
      </View>
    </View>,
  );

  // Using { name: 'text' } predicate to find specific elements by their accessible name
  expect(screen.getByRole('heading', { name: 'Heading Text' })).toBeOnTheScreen();

  // The accessible name for this button comes from its inner Text content
  expect(screen.getByRole('button', { name: 'Button 1' })).toBeOnTheScreen();

  // The accessible name for this switch comes from its aria-label
  expect(screen.getByRole('switch', { name: 'Switch 1' })).toBeOnTheScreen();

  // Alert elements announce their content to screen readers
  expect(screen.getByRole('alert', { name: 'Alert Text' })).toBeOnTheScreen();

  // Menu without predicate - there's only one menu element
  expect(screen.getByRole('menu')).toBeOnTheScreen();

  // Multiple menu items - using getAllByRole when expecting multiple results
  expect(screen.getAllByRole('menuitem')).toHaveLength(2);
});

/**
 * Test 2: Querying TextInput elements
 *
 * TextInput elements are special because they have multiple ways to be identified.
 * This demonstrates three different strategies, each with its own use case.
 *
 * Strategy priority:
 * 1. *ByLabelText - Most accessible, mirrors screen reader behavior
 * 2. *ByPlaceholderText - Good when placeholder is descriptive
 * 3. *ByDisplayValue - Useful for testing current input values
 */
test('querying TextInput elements', () => {
  render(
    <View>
      {/* TextInput with multiple identifiers for demonstration */}
      <TextInput placeholder="Enter Text..." aria-label="Text Label" defaultValue="Hello" />
    </View>,
  );

  // Option 1: Query by accessibility label (RECOMMENDED)
  // This is how screen readers identify the input field
  expect(screen.getByLabelText('Text Label')).toHaveDisplayValue('Hello');

  // Option 2: Query by placeholder text (RECOMMENDED)
  // Useful when the placeholder text is descriptive and stable
  expect(screen.getByPlaceholderText('Enter Text...')).toHaveDisplayValue('Hello');

  // Option 3: Query by current display value
  // Useful for testing that inputs contain expected values
  expect(screen.getByDisplayValue('Hello')).toBeOnTheScreen();
});

/**
 * Test 3: Other accessible queries
 *
 * React Native Testing Library provides several query methods that target
 * different accessibility properties. These queries help you test your app
 * from the user's perspective, especially users with disabilities.
 *
 * Options:
 * 1. *ByText (for text content)
 * 2. *ByLabelText (for labeled interactive elements)
 * 3. *ByHintText (for additional context)
 */
test('other accessible queries', () => {
  render(
    <View>
      {/* Simple text content - directly queryable by its text */}
      <Text>Text content</Text>

      {/* ARIA label - web standard for accessibility */}
      <View aria-label="ARIA Label" />

      {/* React Native specific accessibility label */}
      <View accessibilityLabel="Accessibility Label" />

      {/* Accessibility hint - provides additional context */}
      <View accessibilityHint="Accessibility Hint" />
    </View>,
  );

  // Query by visible text content
  expect(screen.getByText('Text content')).toBeOnTheScreen();

  // Query by ARIA label (web standard)
  expect(screen.getByLabelText('ARIA Label')).toBeOnTheScreen();

  // Query by React Native accessibility label
  expect(screen.getByLabelText('Accessibility Label')).toBeOnTheScreen();

  // Query by accessibility hint (provides additional context to users)
  expect(screen.getByHintText('Accessibility Hint')).toBeOnTheScreen();
});

/**
 * Test 4: Using testID as an escape hatch
 *
 * WARNING: Use testID only as a last resort!
 *
 * testID doesn't represent how users interact with your app and should be avoided
 * when possible. It's useful only when:
 * - No accessible queries work
 * - You need to test complex internal states
 * - You're dealing with third-party components with poor accessibility
 *
 * Always try accessible queries first!
 */
test('escape hatch: *ByTestId (use as a last resort)', () => {
  render(
    <View>
      {/* TestID should be used sparingly - prefer accessible queries */}
      <Text testID="Text 1">Text 1</Text>
    </View>,
  );

  // Note: getByText('Text 1') would be better here, but this demonstrates testID usage
  expect(screen.getByTestId('Text 1')).toBeOnTheScreen();
});
