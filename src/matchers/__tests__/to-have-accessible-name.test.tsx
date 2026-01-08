import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '../..';

it('checks if element has accessible name', async () => {
  const Component = () => (
    <View>
      <Text testID="labeled-text" accessibilityLabel="Submit button">
        Click me
      </Text>
      <Text testID="unlabeled-text">Plain text</Text>
    </View>
  );

  await render(<Component />);

  const labeledElement = screen.getByTestId('labeled-text');
  const unlabeledElement = screen.getByTestId('unlabeled-text');

  expect(labeledElement).toHaveAccessibleName('Submit button');
  expect(unlabeledElement).toHaveAccessibleName();
});
