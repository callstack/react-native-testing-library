import * as React from 'react';
import { Text, Pressable, View } from 'react-native';
import { render, within } from '../pure';

/**
 * Our queries interact differently with composite and host elements, and some specific cases require us
 * to crawl up the tree to a Text composite element to be able to traverse it down again. Going up the tree
 * is a dangerous behaviour because we could take the risk of then traversing a sibling node to the original one.
 * This test suite is designed to be able to test as many different combinations, as a safety net.
 * Specific cases should still be tested within the relevant file (for instance an edge case with `within` should have
 * an explicit test in the within test suite)
 */
describe('nested text handling', () => {
  test('within same node', () => {
    const view = render(<Text testID="subject">Hello</Text>);
    expect(within(view.getByTestId('subject')).getByText('Hello')).toBeTruthy();
  });

  test('role with direct text children', () => {
    const view = render(<Text accessibilityRole="header">About</Text>);

    expect(view.getByRole('header', { name: 'About' })).toBeTruthy();
  });

  test('nested text with child with role', () => {
    const view = render(
      <Text>
        <Text testID="child" accessibilityRole="header">
          About
        </Text>
      </Text>
    );

    expect(view.getByRole('header', { name: 'About' }).props.testID).toBe(
      'child'
    );
  });

  test('pressable within View, with text child', () => {
    const view = render(
      <View>
        <Pressable testID="pressable" accessibilityRole="button">
          <Text>Save</Text>
        </Pressable>
      </View>
    );

    expect(view.getByRole('button', { name: 'Save' }).props.testID).toBe(
      'pressable'
    );
  });

  test('pressable within View, with text child within view', () => {
    const view = render(
      <View>
        <Pressable testID="pressable" accessibilityRole="button">
          <View>
            <Text>Save</Text>
          </View>
        </Pressable>
      </View>
    );

    expect(view.getByRole('button', { name: 'Save' }).props.testID).toBe(
      'pressable'
    );
  });

  test('Text within pressable', () => {
    const view = render(
      <Pressable testID="pressable" accessibilityRole="button">
        <Text testID="text">Save</Text>
      </Pressable>
    );

    expect(view.getByText('Save').props.testID).toBe('text');
  });

  test('Text within view within pressable', () => {
    const view = render(
      <Pressable testID="pressable" accessibilityRole="button">
        <View>
          <Text testID="text">Save</Text>
        </View>
      </Pressable>
    );

    expect(view.getByText('Save').props.testID).toBe('text');
  });
});
