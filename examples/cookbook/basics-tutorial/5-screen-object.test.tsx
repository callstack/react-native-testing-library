/**
 * Chapter 5: Screen Object
 *
 * The screen object is a convenient utility provided by React Native Testing Library
 * that gives you access to queries and methods after rendering a component.
 * It eliminates the need to destructure queries from the render() return value
 * and provides additional methods for component lifecycle management.
 *
 * Key benefits of using screen:
 * - Cleaner, more readable test code
 * - Access to all queries without destructuring
 * - Additional methods like rerender() and unmount()
 * - Consistent API across all tests
 */

import * as React from 'react';
import { Text, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';

// Simple component for demonstration
function Greeting({ name = 'World' }) {
  return (
    <View>
      <Text>Hello, {name}!</Text>
    </View>
  );
}

describe('Greeting', () => {
  /**
   * Test demonstrating screen.rerender()
   *
   * The screen.rerender() method allows you to re-render the same component
   * with different props. This is useful for testing how components respond
   * to prop changes without unmounting and remounting.
   */
  it('should re-render when name changes', () => {
    // Initial render with name="John"
    render(<Greeting name="John" />);

    // screen.getByText() works the same as destructuring from render()
    // But it's more convenient as you don't need to manage the return value
    expect(screen.getByText('Hello, John!')).toBeOnTheScreen();

    // Use screen.rerender() to update the component with new props
    // This preserves the component instance and triggers a re-render
    screen.rerender(<Greeting name="Jane" />);

    // Verify the component updated with the new prop
    expect(screen.getByText('Hello, Jane!')).toBeOnTheScreen();
  });

  /**
   * Test demonstrating screen.unmount()
   *
   * The screen.unmount() method unmounts the rendered component,
   * which is useful for testing cleanup behavior and ensuring
   * queries fail appropriately after unmounting.
   */
  it('should unmount', () => {
    // Render the component
    render(<Greeting name="John" />);

    // Unmount the component using screen.unmount()
    // This simulates what happens when a component is removed from the tree
    screen.unmount();

    // After unmounting, queries should throw an error
    // This ensures the component is properly cleaned up
    expect(() => screen.getByText('Hello, John!')).toThrowErrorMatchingInlineSnapshot(
      `"Unable to find node on an unmounted component."`,
    );
  });
});

/**
 * Summary of Screen Object Methods:
 *
 * Queries (same as render() return value):
 * - screen.getByText(), screen.queryByText(), screen.findByText()
 * - screen.getByRole(), screen.queryByRole(), screen.findByRole()
 * - screen.getByTestId(), screen.queryByTestId(), screen.findByTestId()
 * - And all other standard queries...
 *
 * Lifecycle Methods:
 * - screen.rerender(element) - Re-renders with new props/children
 * - screen.unmount() - Unmounts the component
 *
 * The screen object makes tests more readable and provides a consistent
 * interface for component testing across your entire test suite.
 */
