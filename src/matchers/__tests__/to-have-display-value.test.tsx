import * as React from 'react';
import { TextInput, View } from 'react-native';
import { render, screen } from '../..';
import '../extend-expect';

test('example test', () => {
  render(<TextInput testID="text-input" value="test" />);

  const textInput = screen.getByTestId('text-input');

  expect(textInput).toHaveDisplayValue('test');
});

test('toHaveDisplayValue() on matching display value', () => {
  render(<TextInput testID="text-input" value="test" />);

  const textInput = screen.getByTestId('text-input');

  expect(textInput).toHaveDisplayValue('test');
});

test('toHaveDisplayValue() on not matching display value', () => {
  render(<TextInput testID="text-input" value="test" />);

  const textInput = screen.getByTestId('text-input');

  expect(textInput).not.toHaveDisplayValue('non-test');
});

test("toHaveDisplayValue() on non 'TextInput' elements", () => {
  render(<View testID="view" />);

  const view = screen.getByTestId('view');

  expect(() =>
    expect(view).not.toHaveDisplayValue('test')
  ).toThrowErrorMatchingInlineSnapshot(
    `"toHaveDisplayValue() works only with host "TextInput" elements. Passed element has type "View"."`
  );
});

test('toHaveDisplayValue() on matching element with .not', () => {
  render(<TextInput testID="text-input" value="test" />);

  const textInput = screen.getByTestId('text-input');

  expect(() => expect(textInput).not.toHaveDisplayValue('test'))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toHaveDisplayValue()

    Expected element not to have display value:
      test
    Received:
      test"
  `);
});

test('toHaveDisplayValue() on not matching element', () => {
  render(<TextInput testID="text-input" value="test" />);

  const textInput = screen.getByTestId('text-input');

  expect(() => expect(textInput).toHaveDisplayValue('non-test'))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toHaveDisplayValue()

    Expected element to have display value:
      non-test
    Received:
      test"
  `);
});
