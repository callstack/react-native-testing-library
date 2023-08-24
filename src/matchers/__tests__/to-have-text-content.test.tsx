/// <reference path="../extend-expect.d.ts" />

import * as React from 'react';
import { View, Text } from 'react-native';
import { render, screen } from '../..';
import '../extend-expect';

test('toHaveTextContent() example test', () => {
  render(
    <View testID="view">
      <Text>Hello</Text> <Text>World</Text>
    </View>
  );

  const view = screen.getByTestId('view');
  expect(view).toHaveTextContent('Hello World');
  expect(view).not.toHaveTextContent('Hello there');
});

test('toHaveTextContent() handles positive test cases', () => {
  render(<Text testID="text">Hello World</Text>);

  const text = screen.getByTestId('text');
  expect(text).toHaveTextContent('Hello World');
  expect(text).toHaveTextContent('Hello', { exact: false });
  expect(text).toHaveTextContent(/Hello World/);
});

test('toHaveTextContent() does exact match by default', () => {
  render(<Text testID="text">Hello World</Text>);

  const text = screen.getByTestId('text');
  expect(text).toHaveTextContent('Hello World');
  expect(text).not.toHaveTextContent('Hello');
  expect(text).not.toHaveTextContent('World');
});

test('toHaveTextContent() handles nested text', () => {
  render(
    <Text testID="text">
      Hello <Text>React</Text>
    </Text>
  );

  const text = screen.getByTestId('text');
  expect(text).toHaveTextContent('Hello React');
});

test('toHaveTextContent() negative test cases', () => {
  render(<Text testID="text">Hello World</Text>);

  const text = screen.getByTestId('text');
  expect(text).not.toHaveTextContent(/Hello React/);
  expect(() => expect(text).toHaveTextContent(/Hello React/))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toHaveTextContent()

    Expected element to have text content:
      /Hello React/
    Received:
      Hello World"
  `);

  expect(text).not.toHaveTextContent('Yellow', { exact: false });
  expect(() => expect(text).toHaveTextContent('Yellow', { exact: false }))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toHaveTextContent()

    Expected element to have text content:
      Yellow
    Received:
      Hello World"
  `);
});

test('toHaveTextContent() on null element', () => {
  expect(() => expect(null).toHaveTextContent('Hello World'))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(received).toHaveTextContent()

    received value must be a host element.
    Received has value: null"
  `);
});
