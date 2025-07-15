/*
 * React Native Testing Library - Chapter 1: Basics
 *
 * This tutorial introduces the fundamentals of testing React Native components
 * using React Native Testing Library (RNTL). You'll learn how to render components,
 * query elements, and write basic assertions.
 *
 * What is React Native Testing Library?
 * - A testing utility that helps you test React Native components in a way that
 *   resembles how your users interact with your app
 * - Built on top of Jest and React Test Renderer
 * - Encourages testing behavior rather than implementation details
 */

import * as React from 'react';
import { Text, View } from 'react-native';

// Import the essential testing utilities from React Native Testing Library
import { render, screen } from '@testing-library/react-native';
// - render: Creates a virtual representation of your component for testing
// - screen: Provides convenient methods to query rendered elements

/*
 * Example Component: Greeting
 *
 * This is a simple React Native component that we'll use to demonstrate
 * basic testing concepts. It renders a greeting message with an optional name.
 */
function Greeting({ name = 'World' }) {
  return (
    <View>
      <Text>Hello, {name}!</Text>
    </View>
  );
}

/*
 * Test Suite: Greeting Component
 *
 * A test suite groups related tests together. We use Jest's describe() function
 * to create a test suite for our Greeting component.
 */
describe('Greeting', () => {
  /*
   * Test Case 1: Basic Rendering
   *
   * This test verifies that our component renders correctly with default props.
   * It follows the Arrange-Act-Assert pattern (though "Act" is implicit in the render).
   */
  it('should render', () => {
    // Arrange: Set up the test by rendering the component
    // The render() function creates a virtual DOM representation of your component
    render(<Greeting />);

    // Assert: Verify the expected behavior
    // screen.getByText() queries for an element containing the specified text
    // toBeOnTheScreen() is a custom matcher that checks if the element is rendered
    expect(screen.getByText('Hello, World!')).toBeOnTheScreen();
  });

  /*
   * Test Case 2: Testing with Props
   *
   * This test demonstrates how to test component behavior when props change.
   * It shows how the same component can render differently based on input.
   */
  it('should render with the correct name', () => {
    // Arrange: Render the component with specific props
    // We're passing a custom name prop to test dynamic content
    render(<Greeting name="John" />);

    // Assert: Verify that the component renders with the provided prop
    // The text should now include "John" instead of the default "World"
    expect(screen.getByText('Hello, John!')).toBeOnTheScreen();
  });
});
