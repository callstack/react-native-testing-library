import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '../..';

test('toBeOnTheScreen() example test', async () => {
  await render(
    <View>
      <View testID="child" />
    </View>,
  );

  const child = screen.getByTestId('child');
  expect(child).toBeOnTheScreen();

  await screen.rerender(<View />);
  expect(child).not.toBeOnTheScreen();
});

test('toBeOnTheScreen() on attached element', async () => {
  await render(<View testID="test" />);

  const element = screen.getByTestId('test');
  expect(element).toBeOnTheScreen();
  expect(() => expect(element).not.toBeOnTheScreen()).toThrowErrorMatchingInlineSnapshot(`
    "expect(instance).not.toBeOnTheScreen()

    expected instance tree not to contain instance, but found
      <View
        testID="test"
      />"
  `);
});

function ShowChildren({ show }: { show: boolean }) {
  return show ? (
    <View>
      <Text testID="text">Hello</Text>
    </View>
  ) : (
    <View />
  );
}

test('toBeOnTheScreen() on detached element', async () => {
  await render(<ShowChildren show={true} />);

  const element = screen.getByTestId('text');
  // Next line will unmount the element, yet `element` variable will still hold reference to it.
  await screen.rerender(<ShowChildren show={false} />);

  expect(element).toBeTruthy();
  expect(element).not.toBeOnTheScreen();
  expect(() => expect(element).toBeOnTheScreen()).toThrowErrorMatchingInlineSnapshot(`
    "expect(instance).toBeOnTheScreen()

    instance could not be found in the instance tree"
  `);
});

test('toBeOnTheScreen() on null element', () => {
  expect(null).not.toBeOnTheScreen();
  expect(() => expect(null).toBeOnTheScreen()).toThrowErrorMatchingInlineSnapshot(`
    "expect(received).toBeOnTheScreen()

    received value must be a host instance.
    Received has value: null"
  `);
});
