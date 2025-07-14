/**
 * React Native Testing Library Tutorial - Chapter 2.1: Query Variants
 *
 * This tutorial demonstrates the three main query variants in React Native Testing Library:
 * - getBy*: Finds a single element, throws error if not found or multiple found
 * - queryBy*: Finds a single element, returns null if not found (no error)
 * - findBy*: Async version of getBy*, waits for element to appear
 *
 * Each variant also has an "All" version (getAllBy*, queryAllBy*, findAllBy*)
 * that returns arrays of elements instead of single elements.
 */

import * as React from 'react';
import { Text, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';

/**
 * TEST 1: Basic Query Variants
 *
 * This test demonstrates the fundamental differences between getBy*, getAllBy*,
 * and queryBy* queries for synchronous DOM queries.
 */
test('showcase query variants', () => {
  // Render a simple component with multiple text elements
  render(
    <View>
      <Text>Item 1</Text>
      <Text>Item 2</Text>
    </View>,
  );

  // ✅ getBy* queries: Use when you expect exactly ONE element to be found
  // - Throws an error if the element is not found
  // - Throws an error if multiple elements are found
  // - Perfect for assertions where the element MUST exist
  expect(screen.getByText('Item 1')).toBeOnTheScreen();

  // ✅ getAllBy* queries: Use when you expect MULTIPLE elements to be found
  // - Returns an array of all matching elements
  // - Throws an error if NO elements are found
  // - Perfect for testing multiple matching elements
  expect(screen.getAllByText(/Item/)).toHaveLength(2);

  // ✅ queryBy* queries: Use when you expect an element to NOT exist
  // - Returns null if the element is not found (no error thrown)
  // - Returns the element if found (like getBy*)
  // - Perfect for testing absence of elements
  expect(screen.queryByText('Item 3')).not.toBeOnTheScreen();
});

/**
 * LazyText Component - Simulates Async Loading
 *
 * This component demonstrates a common pattern in React Native apps:
 * - Initially shows a loading state
 * - After async operation completes, shows the actual content
 * - Useful for testing async query variants
 */
function LazyText({ content }: { content: string }) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Simulate async loading operation (API call, data fetching, etc.)
  React.useEffect(() => {
    sleep(100);
    setIsLoaded(true);
  }, []);

  return <Text>{isLoaded ? content : 'Loading...'}</Text>;
}

/**
 * TEST 2: Async Query Variants
 *
 * This test demonstrates findBy* queries, which are essential for testing
 * components that load content asynchronously.
 */
test('showcase async query variants', async () => {
  // Render components that will load content asynchronously
  render(
    <View>
      <LazyText content="Lazy Item 1" />
      <LazyText content="Lazy Item 2" />
    </View>,
  );

  // ✅ findBy* queries: Use when you need to WAIT for an element to appear
  // - Returns a Promise that resolves when the element is found
  // - Automatically retries until element appears (with timeout)
  // - Perfect for async operations like API calls, animations, etc.
  // - Default timeout is 1000ms (configurable)
  expect(await screen.findByText('Lazy Item 1')).toBeOnTheScreen();

  // ❌ DON'T use getBy* for async content - this would fail:
  // expect(screen.getByText('Lazy Item 1')).toBeOnTheScreen(); // Error!

  // ❌ DON'T use queryBy* for async content - this would return null:
  // expect(screen.queryByText('Lazy Item 1')).toBeOnTheScreen(); // Fails!
});

/**
 * Query Variants Summary:
 *
 * +----------+------------+------------+------------+
 * | Variant  | Single     | Multiple   | Use Case   |
 * +----------+------------+------------+------------+
 * | getBy*   | getByText  | getAllBy*  | Element must exist (sync) |
 * | queryBy* | queryByText| queryAllBy*| Element may not exist |
 * | findBy*  | findByText | findAllBy* | Element appears async |
 * +----------+------------+------------+------------+
 *
 * When to use each:
 * - getBy*: "I know this element exists right now"
 * - queryBy*: "This element might not exist, and that's okay"
 * - findBy*: "This element will exist soon (after async operation)"
 */

/**
 * Utility function to simulate async operations
 * In real apps, this might be API calls, database queries, etc.
 */
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
