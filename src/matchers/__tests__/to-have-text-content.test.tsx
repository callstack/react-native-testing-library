import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '../..';

it('verifies element has expected text content', async () => {
  const Component = () => (
    <View>
      <Text testID="text-element">Hello World</Text>
    </View>
  );

  await render(<Component />);

  const element = screen.getByTestId('text-element');
  expect(element).toHaveTextContent('Hello World');
});
