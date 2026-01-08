import * as React from 'react';
import { TextInput, View } from 'react-native';

import { render, screen } from '../..';

it('finds TextInput elements by their placeholder text', async () => {
  const Component = () => (
    <View>
      <TextInput placeholder="Enter your email" testID="email-input" />
      <TextInput placeholder="Enter your password" testID="password-input" />
    </View>
  );

  await render(<Component />);

  // Users need to find form inputs by placeholder text - this is critical
  // for testing forms where placeholders guide user interaction
  const emailInput = screen.getByPlaceholderText('Enter your email');
  expect(emailInput).toBeOnTheScreen();
  expect(emailInput.props.testID).toBe('email-input');

  const passwordInput = screen.getByPlaceholderText('Enter your password');
  expect(passwordInput).toBeOnTheScreen();
  expect(passwordInput.props.testID).toBe('password-input');
});
