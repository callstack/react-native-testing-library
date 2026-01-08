import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '../..';

it('verifies element has expected text content', async () => {
  const Component = () => (
    <View>
      <Text testID="text-element">Hello World</Text>
      <Text testID="other-element">Other Text</Text>
    </View>
  );

  await render(<Component />);

  const element = screen.getByTestId('text-element');
  const otherElement = screen.getByTestId('other-element');

  expect(element).toHaveTextContent('Hello World');
  expect(element).not.toHaveTextContent('Other Text');
  expect(otherElement).not.toHaveTextContent('Hello World');
});
