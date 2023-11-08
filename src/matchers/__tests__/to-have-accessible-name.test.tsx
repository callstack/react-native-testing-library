import * as React from 'react';
import { View, Text, TextInput } from 'react-native';
import { render, screen } from '../..';
import '../extend-expect';

test('toHaveAccessibleName() handles view with "accessibilityLabel" prop', () => {
  render(<View testID="view" accessibilityLabel="Test Label" />);
  const element = screen.getByTestId('view');
  expect(element).toHaveAccessibleName('Test Label');
  expect(element).not.toHaveAccessibleName('Other Label');
});

test('toHaveAccessibleName() handles view with "aria-label" prop', () => {
  render(<View testID="view" aria-label="Aria Test Label" />);
  const element = screen.getByTestId('view');
  expect(element).toHaveAccessibleName('Aria Test Label');
  expect(element).not.toHaveAccessibleName('Other Aria Label');
});

test('toHaveAccessibleName() handles view with "accessibilityLabelledBy" prop', async () => {
  render(
    <View>
      <Text nativeID="label">External label</Text>
      <TextInput testID="input" accessibilityLabelledBy="label" />
    </View>
  );

  const element = screen.getByTestId('input');
  expect(element).toHaveAccessibleName('External label');
  expect(element).not.toHaveAccessibleName('Other label');
});

test('toHaveAccessibleName() handles nested "accessibilityLabelledBy"', async () => {
  render(
    <>
      <View nativeID="label">
        <Text>External label</Text>
      </View>
      <TextInput testID="input" accessibilityLabelledBy="label" />
    </>
  );

  const element = screen.getByTestId('input');
  expect(element).toHaveAccessibleName('External label');
  expect(element).not.toHaveAccessibleName('Other label');
});

test('toHaveAccessibleName() handles view with nested "accessibilityLabelledBy" with no text', async () => {
  render(
    <>
      <View nativeID="label">
        <View />
      </View>
      <TextInput testID="text-input" accessibilityLabelledBy="label" />
    </>
  );

  const element = screen.getByTestId('text-input');
  expect(element).not.toHaveAccessibleName();
});

test('toHaveAccessibleName() handles view with "aria-labelledby" prop', async () => {
  render(
    <View>
      <Text nativeID="label">External label</Text>
      <TextInput testID="input" aria-labelledby="label" />
    </View>
  );

  const element = screen.getByTestId('input');
  expect(element).toHaveAccessibleName('External label');
  expect(element).not.toHaveAccessibleName('Other label');
});

test('toHaveAccessibleName() handles view with implicit accessible name', () => {
  render(<Text testID="view">Text</Text>);
  const element = screen.getByTestId('view');
  expect(element).toHaveAccessibleName('Text');
  expect(element).not.toHaveAccessibleName('Other text');
});

test('toHaveAccessibleName() supports calling without expected name', () => {
  render(<View testID="view" accessibilityLabel="Test Label" />);
  const element = screen.getByTestId('view');

  expect(element).toHaveAccessibleName();
  expect(() => expect(element).not.toHaveAccessibleName())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toHaveAccessibleName()

    Expected element not to have accessible name:
      undefined
    Received:
      Test Label"
  `);
});

test('toHaveAccessibleName() handles a view without name when called without expected name', () => {
  render(<View testID="view" />);
  const element = screen.getByTestId('view');

  expect(element).not.toHaveAccessibleName();
  expect(() => expect(element).toHaveAccessibleName())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toHaveAccessibleName()

    Expected element to have accessible name:
      undefined
    Received:
    "
  `);
});

it('toHaveAccessibleName() rejects non-host element', () => {
  const nonElement = 'This is not a ReactTestInstance';

  expect(() => expect(nonElement).toHaveAccessibleName())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(received).toHaveAccessibleName()

    received value must be a host element.
    Received has type:  string
    Received has value: "This is not a ReactTestInstance""
  `);

  expect(() => expect(nonElement).not.toHaveAccessibleName())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(received).not.toHaveAccessibleName()

    received value must be a host element.
    Received has type:  string
    Received has value: "This is not a ReactTestInstance""
  `);
});
