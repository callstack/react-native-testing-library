import * as React from 'react';
import { TextInput, View } from 'react-native';

import { render, screen } from '../..';

it('finds TextInput elements by their display value', async () => {
  const Component = () => (
    <View>
      <TextInput value="john.doe@example.com" testID="email-input" />
      <TextInput value="password123" testID="password-input" />
    </View>
  );

  await render(<Component />);

  // Users need to verify form inputs have specific values - this is critical
  // for testing forms where display values indicate user input or default values
  const emailInput = screen.getByDisplayValue('john.doe@example.com');
  expect(emailInput).toBeOnTheScreen();
  expect(emailInput.props.testID).toBe('email-input');

  const passwordInput = screen.getByDisplayValue('password123');
  expect(passwordInput).toBeOnTheScreen();
  expect(passwordInput.props.testID).toBe('password-input');
});
