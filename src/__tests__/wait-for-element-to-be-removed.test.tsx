import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen, waitForElementToBeRemoved } from '..';

it('throws error when element is already removed at the time of calling', async () => {
  await expect(waitForElementToBeRemoved(() => null)).rejects.toThrow(
    'The element(s) given to waitForElementToBeRemoved are already removed. waitForElementToBeRemoved requires that the element(s) exist(s) before waiting for removal.',
  );
});

it('resolves when query throws error after element is removed', async () => {
  const Component = ({ showText }: { showText: boolean }) => (
    <View>{showText && <Text>Hello</Text>}</View>
  );

  const { rerender } = await render(<Component showText={true} />);

  expect(screen.getByText('Hello')).toBeOnTheScreen();

  setTimeout(async () => {
    await rerender(<Component showText={false} />);
  }, 50);

  await waitForElementToBeRemoved(() => screen.getByText('Hello'));
});
