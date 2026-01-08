import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

import { fireEvent, render, screen, waitForElementToBeRemoved } from '..';

it('throws error when element is already removed at the time of calling', async () => {
  await expect(waitForElementToBeRemoved(() => null)).rejects.toThrow(
    'The element(s) given to waitForElementToBeRemoved are already removed. waitForElementToBeRemoved requires that the element(s) exist(s) before waiting for removal.',
  );
});

it('resolves when query throws error after element is removed', async () => {
  const Component = () => {
    const [showText, setShowText] = React.useState(true);

    return (
      <View>
        {showText && <Text>Hello</Text>}
        <Pressable onPress={() => setShowText(false)} testID="remove-button">
          <Text>Remove</Text>
        </Pressable>
      </View>
    );
  };

  await render(<Component />);

  expect(screen.getByText('Hello')).toBeOnTheScreen();

  void setTimeout(() => {
    void fireEvent.press(screen.getByTestId('remove-button'));
  }, 50);

  await waitForElementToBeRemoved(() => screen.getByText('Hello'));
});
