import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '../..';

it('checks if element is disabled via accessibilityState', async () => {
  const Component = () => (
    <View>
      <Text testID="disabled-text" accessibilityState={{ disabled: true }}>
        Disabled
      </Text>
      <Text testID="enabled-text" accessibilityState={{ disabled: false }}>
        Enabled
      </Text>
    </View>
  );

  await render(<Component />);

  const disabledElement = screen.getByTestId('disabled-text');
  const enabledElement = screen.getByTestId('enabled-text');

  expect(disabledElement).toBeDisabled();
  expect(enabledElement).toBeEnabled();
});
