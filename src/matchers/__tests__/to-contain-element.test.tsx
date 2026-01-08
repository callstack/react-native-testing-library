import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '../..';

it('checks if container element contains child element', async () => {
  const Component = () => (
    <View testID="container">
      <Text testID="child">Child content</Text>
    </View>
  );

  await render(<Component />);

  const container = screen.getByTestId('container');
  const child = screen.getByTestId('child');

  expect(container).toContainElement(child);
});
