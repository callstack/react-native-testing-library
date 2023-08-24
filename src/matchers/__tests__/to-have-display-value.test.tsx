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

  expect(() => expect(textInput).not.toHaveDisplayValue('test'))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toHaveDisplayValue()

    Expected element not to have display value:
      test
    Received:
      test"
  `);
});

test('toHaveDisplayValue() on non-matching display value', () => {
  render(<TextInput testID="text-input" value="test" />);

  const textInput = screen.getByTestId('text-input');
  expect(textInput).not.toHaveDisplayValue('non-test');

  expect(() => expect(textInput).toHaveDisplayValue('non-test'))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toHaveDisplayValue()

    Expected element to have display value:
      non-test
    Received:
      test"
  `);
});

test("toHaveDisplayValue() on non-'TextInput' elements", () => {
  render(<View testID="view" />);

  const view = screen.getByTestId('view');
  expect(() =>
    expect(view).toHaveDisplayValue('test')
  ).toThrowErrorMatchingInlineSnapshot(
    `"toHaveDisplayValue() works only with host "TextInput" elements. Passed element has type "View"."`
  );
});

test('toHaveDisplayValue() performing partial match', () => {
  render(<TextInput testID="text-input" value="Hello World" />);

  const textInput = screen.getByTestId('text-input');
  expect(textInput).toHaveDisplayValue('Hello World');

  expect(textInput).not.toHaveDisplayValue('hello world');
  expect(textInput).not.toHaveDisplayValue('Hello');
  expect(textInput).not.toHaveDisplayValue('World');

  expect(textInput).toHaveDisplayValue('Hello World', { exact: false });
  expect(textInput).toHaveDisplayValue('hello', { exact: false });
  expect(textInput).toHaveDisplayValue('world', { exact: false });
});

test('toHaveDisplayValue() uses defaultValue', () => {
  render(<TextInput testID="text-input" defaultValue="default" />);

  const textInput = screen.getByTestId('text-input');
  expect(textInput).toHaveDisplayValue('default');
});

test('toHaveDisplayValue() prioritizes value over defaultValue', () => {
  render(
    <TextInput testID="text-input" value="value" defaultValue="default" />
  );

  const textInput = screen.getByTestId('text-input');
  expect(textInput).toHaveDisplayValue('value');
});
