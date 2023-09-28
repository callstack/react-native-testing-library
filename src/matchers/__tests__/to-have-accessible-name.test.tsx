import * as React from 'react';
import { View, Text, TextInput } from 'react-native';
import { render, screen } from '../..';
import '../extend-expect';

test('toHaveAccessibleName() on view with accessibilityLabel prop', () => {
  render(<View testID="accessibility-label" accessibilityLabel="Test Label" />);
  const element = screen.getByTestId('accessibility-label');
  expect(element).toHaveAccessibleName('Test Label');
});

test('toHaveAccessibleName() on view with aria-label prop', () => {
  render(<View testID="aria-label" aria-label="Aria Test Label" />);
  const element = screen.getByTestId('aria-label');
  expect(element).toHaveAccessibleName('Aria Test Label');
});

test('toHaveAccessibleName() on view with accessibilityLabel prop with no expectedName', () => {
  render(<View testID="no-expectName-label" accessibilityLabel="Test Label" />);
  const element = screen.getByTestId('no-expectName-label');
  expect(element).toHaveAccessibleName();
});

test('toHaveAccessibleName() on view with no accessibility props', () => {
  render(<Text testID="accessibility-label">Text</Text>);
  const element = screen.getByTestId('accessibility-label');
  expect(element).toHaveAccessibleName('Text');
});

test('toHaveAccessibleName() on view with that does not have the expected accessible name', () => {
  render(<View testID="wrong-label" accessibilityLabel="The actual label" />);
  const element = screen.getByTestId('wrong-label');
  expect(() => expect(element).toHaveAccessibleName('Not the label'))
    .toThrowErrorMatchingInlineSnapshot(`
  "expect(element).toHaveAccessibleName()

  Expected element to have accessible name:
    Not the label
  Received:
    The actual label"
`);
});

test('toHaveAccessibleName() on view that doesnt have accessible name defined', () => {
  render(<View testID="no-accessibile-name" />);
  const element = screen.getByTestId('no-accessibile-name');

  expect(() => expect(element).toHaveAccessibleName())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toHaveAccessibleName()

    Expected element to have accessible name:

    Received:
      undefined"
  `);
});

it('toHaveAccessibleName() on a non-host element', () => {
  const nonElement = 'This is not a ReactTestInstance';
  expect(() => expect(nonElement).toHaveAccessibleName())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(received).toHaveAccessibleName()

    received value must be a host element.
    Received has type:  string
    Received has value: "This is not a ReactTestInstance""
  `);
});

test('toHaveAccessibleName() on view with accessibilityLabelledBy prop', async () => {
  render(
    <View>
      <Text nativeID="formLabel">Accessibility LabelledBy</Text>
      <TextInput
        testID="accessibility-labelledby"
        accessibilityLabelledBy="formLabel"
      />
    </View>
  );

  const element = screen.getByTestId('accessibility-labelledby');
  expect(element).toHaveAccessibleName('Accessibility LabelledBy');
});

test('toHaveAccessibleName() on view with ariaLabelledBy prop', async () => {
  render(
    <View>
      <Text nativeID="formLabel">Aria LabelledBy</Text>
      <TextInput testID="aria-labelledby" aria-labelledby="formLabel" />
    </View>
  );

  const element = screen.getByTestId('aria-labelledby');
  expect(element).toHaveAccessibleName('Aria LabelledBy');
});

//TODO: This fails as expected as I am unsure on how to extract the Text from the nested Element
test('getByLabelText supports nested aria-labelledby', async () => {
  const screen = render(
    <>
      <View nativeID="label">
        <Text>Nested Aria LabelledBy</Text>
      </View>
      <TextInput testID="text-input" aria-labelledby="label" />
    </>
  );

  const element = screen.getByTestId('text-input');
  expect(element).toHaveAccessibleName('Nested Aria LabelledBy');
});
