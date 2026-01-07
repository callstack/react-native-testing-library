import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

import { render, screen } from '../pure';

describe('nested text handling', () => {
  test('basic', async () => {
    await render(<Text testID="subject">Hello</Text>);
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  test('role with direct text children', async () => {
    await render(<Text accessibilityRole="header">About</Text>);

    expect(screen.getByRole('header', { name: 'About' })).toBeTruthy();
  });

  test('nested text with child with role', async () => {
    await render(
      <Text>
        <Text testID="child" accessibilityRole="header">
          About
        </Text>
      </Text>,
    );

    expect(screen.getByRole('header', { name: 'About' }).props.testID).toBe('child');
  });

  test('pressable within View, with text child', async () => {
    await render(
      <View>
        <Pressable testID="pressable" accessibilityRole="button">
          <Text>Save</Text>
        </Pressable>
      </View>,
    );

    expect(screen.getByRole('button', { name: 'Save' }).props.testID).toBe('pressable');
  });

  test('pressable within View, with text child within view', async () => {
    await render(
      <View>
        <Pressable testID="pressable" accessibilityRole="button">
          <View>
            <Text>Save</Text>
          </View>
        </Pressable>
      </View>,
    );

    expect(screen.getByRole('button', { name: 'Save' }).props.testID).toBe('pressable');
  });

  test('Text within pressable', async () => {
    await render(
      <Pressable testID="pressable" accessibilityRole="button">
        <Text testID="text">Save</Text>
      </Pressable>,
    );

    expect(screen.getByText('Save').props.testID).toBe('text');
  });

  test('Text within view within pressable', async () => {
    await render(
      <Pressable testID="pressable" accessibilityRole="button">
        <View>
          <Text testID="text">Save</Text>
        </View>
      </Pressable>,
    );

    expect(screen.getByText('Save').props.testID).toBe('text');
  });
});
