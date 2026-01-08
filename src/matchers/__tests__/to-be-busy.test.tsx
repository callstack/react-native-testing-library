import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '../..';

it('checks if element is busy via accessibilityState', async () => {
  const Component = () => (
    <View>
      <Text testID="busy-text" accessibilityState={{ busy: true }}>
        Loading
      </Text>
      <Text testID="not-busy-text" accessibilityState={{ busy: false }}>
        Ready
      </Text>
    </View>
  );

  await render(<Component />);

  const busyElement = screen.getByTestId('busy-text');
  const notBusyElement = screen.getByTestId('not-busy-text');

  expect(busyElement).toBeBusy();
  expect(notBusyElement).not.toBeBusy();
});
