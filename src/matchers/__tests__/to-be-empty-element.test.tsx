import React from 'react';
import { Text, View } from 'react-native';
import { render, screen } from '../..';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function DoNotRenderChildren({ children }: { children: React.ReactNode }) {
  // Intentionally do not render children.
  return null;
}

test('toBeEmptyElement() base case', () => {
  render(
    <View testID="not-empty">
      <View testID="empty" />
      <Text testID="text">Hello</Text>
    </View>,
  );

  const empty = screen.getByTestId('empty');
  expect(empty).toBeEmptyElement();
  expect(() => expect(empty).not.toBeEmptyElement()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeEmptyElement()

    Received:
      (no elements)"
  `);

  const notEmpty = screen.getByTestId('not-empty');
  expect(notEmpty).not.toBeEmptyElement();
  expect(() => expect(notEmpty).toBeEmptyElement()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeEmptyElement()

    Received:
      <View
        testID="empty"
      />
      <Text
        testID="text"
      >
        Hello
      </Text>"
  `);

  const text = screen.getByTestId('text');
  expect(text).not.toBeEmptyElement();
  expect(() => expect(text).toBeEmptyElement()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeEmptyElement()

    Received:
      Hello"
  `);
});

test('toBeEmptyElement() ignores composite-only children', () => {
  render(
    <View testID="view">
      <DoNotRenderChildren>
        <View testID="not-rendered" />
      </DoNotRenderChildren>
    </View>,
  );

  const view = screen.getByTestId('view');
  expect(view).toBeEmptyElement();
  expect(() => expect(view).not.toBeEmptyElement()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeEmptyElement()

    Received:
      (no elements)"
  `);
});

test('toBeEmptyElement() on null element', () => {
  expect(() => {
    expect(null).toBeEmptyElement();
  }).toThrowErrorMatchingInlineSnapshot(`
    "expect(received).toBeEmptyElement()

    received value must be a host element.
    Received has value: null"
  `);
});
