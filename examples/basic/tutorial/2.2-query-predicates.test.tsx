import * as React from 'react';
import { Pressable, Switch, Text, TextInput, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';

test('query by semantic role: *ByRole (highly recommended)', () => {
  render(
    <View>
      <Text role="heading">Heading Text</Text>

      <Pressable role="button">
        <Text>Button 1</Text>
      </Pressable>

      <Switch value={true} aria-label="Switch 1" />

      <Text role="alert">Alert Text</Text>

      <View accessible role="menu">
        <Text role="menuitem">Menu Item 1</Text>
        <Text role="menuitem">Menu Item 2</Text>
      </View>
    </View>,
  );

  expect(screen.getByRole('heading', { name: 'Heading Text' })).toBeOnTheScreen();

  expect(screen.getByRole('button', { name: 'Button 1' })).toBeOnTheScreen();
  expect(screen.getByRole('switch', { name: 'Switch 1' })).toBeOnTheScreen();
  expect(screen.getByRole('alert', { name: 'Alert Text' })).toBeOnTheScreen();

  expect(screen.getByRole('menu')).toBeOnTheScreen();
  expect(screen.getAllByRole('menuitem')).toHaveLength(2);
});

test('querying TextInput elements', () => {
  render(
    <View>
      <TextInput placeholder="Enter Text..." aria-label="Text Label" defaultValue="Hello" />
    </View>,
  );

  // Option 1: Query by a11y label
  expect(screen.getByLabelText('Text Label')).toHaveDisplayValue('Hello');

  // Option 2: Query by placeholder text
  expect(screen.getByPlaceholderText('Enter Text...')).toHaveDisplayValue('Hello');

  // Option 3: Query by display value
  expect(screen.getByDisplayValue('Hello')).toBeOnTheScreen();
});

test('other accessible queries', () => {
  render(
    <View>
      <Text>Text content</Text>
      <View aria-label="ARIA Label" />
      <View accessibilityLabel="Accessibility Label" />
      <View accessibilityHint="Accessibility Hint" />
    </View>,
  );

  expect(screen.getByText('Text content')).toBeOnTheScreen();
  expect(screen.getByLabelText('ARIA Label')).toBeOnTheScreen();
  expect(screen.getByLabelText('Accessibility Label')).toBeOnTheScreen();
  expect(screen.getByHintText('Accessibility Hint')).toBeOnTheScreen();
});

test('escape hatch: *ByTestId (use as a last resort)', () => {
  render(
    <View>
      <Text testID="Text 1">Text 1</Text>
    </View>,
  );

  expect(screen.getByTestId('Text 1')).toBeOnTheScreen();
});
