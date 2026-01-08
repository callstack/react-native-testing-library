import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '../..';

it('checks if element is checked via accessibilityState', async () => {
  const Component = () => (
    <View>
      <View
        testID="checked-checkbox"
        accessible
        role="checkbox"
        accessibilityState={{ checked: true }}
      />
      <View
        testID="unchecked-checkbox"
        accessible
        role="checkbox"
        accessibilityState={{ checked: false }}
      />
    </View>
  );

  await render(<Component />);

  const checkedElement = screen.getByTestId('checked-checkbox');
  const uncheckedElement = screen.getByTestId('unchecked-checkbox');

  expect(checkedElement).toBeChecked();
  expect(uncheckedElement).not.toBeChecked();
});
