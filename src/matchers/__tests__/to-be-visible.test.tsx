import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '../..';

it('identifies visible elements', async () => {
  const Component = () => (
    <View>
      <Text testID="visible-text">Hello World</Text>
    </View>
  );

  await render(<Component />);

  const element = screen.getByTestId('visible-text');
  expect(element).toBeVisible();
});
