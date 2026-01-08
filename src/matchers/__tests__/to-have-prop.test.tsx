import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '../..';

it('checks if element has prop with optional value', async () => {
  const Component = () => (
    <View>
      <Text testID="text" numberOfLines={2} accessibilityLabel="Hello">
        Content
      </Text>
    </View>
  );

  await render(<Component />);

  const element = screen.getByTestId('text');
  expect(element).toHaveProp('numberOfLines');
  expect(element).toHaveProp('numberOfLines', 2);
  expect(element).toHaveProp('accessibilityLabel', 'Hello');
});
