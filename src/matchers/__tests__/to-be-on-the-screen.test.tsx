import * as React from 'react';
import { View, Text } from 'react-native';
import { render, screen } from '../..';
import '../extend-expect';

function ShowChildren({ show }: { show: boolean }) {
  return show ? (
    <View>
      <Text testID="text">Hello</Text>
    </View>
  ) : (
    <View />
  );
}

test('toBeOnTheScreen() on attached element', () => {
  render(<View testID="test" />);
  const element = screen.getByTestId('test');
  expect(element).toBeOnTheScreen();
  expect(() => expect(element).not.toBeOnTheScreen())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeOnTheScreen()

    expected element tree not to contain element but found:
      <View
        testID="test"
      />"
  `);
});

test('toBeOnTheScreen() on detached element', () => {
  render(<ShowChildren show />);
  const element = screen.getByTestId('text');

  screen.update(<ShowChildren show={false} />);
  expect(element).toBeTruthy();
  expect(element).not.toBeOnTheScreen();
  expect(() => expect(element).toBeOnTheScreen())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeOnTheScreen()

    element could not be found in the element tree"
  `);
});

test('toBeOnTheScreen() on null element', () => {
  expect(null).not.toBeOnTheScreen();
  expect(() => expect(null).toBeOnTheScreen())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeOnTheScreen()

    element could not be found in the element tree"
  `);
});

test('example test', () => {
  render(
    <View>
      <View testID="child" />
    </View>
  );

  const child = screen.getByTestId('child');
  expect(child).toBeOnTheScreen();

  screen.update(<View />);
  expect(child).not.toBeOnTheScreen();
});
