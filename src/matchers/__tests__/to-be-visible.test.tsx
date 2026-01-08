import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '../..';

it('asserts that a visible element is visible to users', async () => {
  const Component = () => (
    <View>
      <Text testID="visible-text">Hello World</Text>
    </View>
  );

  await render(<Component />);

  // Users rely on toBeVisible to verify elements are actually visible
  // This is critical for testing UI state and accessibility
  const element = screen.getByTestId('visible-text');
  expect(element).toBeVisible();
});
