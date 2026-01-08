import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '../..';

it('checks if element has expected style properties', async () => {
  const Component = () => (
    <View>
      <Text testID="text" style={{ fontSize: 16, color: 'blue' }}>
        Content
      </Text>
    </View>
  );

  await render(<Component />);

  const element = screen.getByTestId('text');
  expect(element).toHaveStyle({ fontSize: 16 });
  expect(element).toHaveStyle({ color: 'blue' });
  expect(element).toHaveStyle({ fontSize: 16, color: 'blue' });
});
