import React from 'react';
import { Button, Text, TextInput, View } from 'react-native';

import { render, screen } from '../..';

const PLACEHOLDER_FRESHNESS = 'Add custom freshness';
const PLACEHOLDER_CHEF = 'Who inspected freshness?';
const INPUT_FRESHNESS = 'Custom Freshie';
const INPUT_CHEF = 'I inspected freshie';

const Banana = () => (
  <View>
    <Text>Is the banana fresh?</Text>
    <Text testID="bananaFresh">not fresh</Text>
    <TextInput
      testID="bananaCustomFreshness"
      placeholder={PLACEHOLDER_FRESHNESS}
      value={INPUT_FRESHNESS}
    />
    <TextInput testID="bananaChef" placeholder={PLACEHOLDER_CHEF} value={INPUT_CHEF} />
    <Text testID="duplicateText">First Text</Text>
    <Text testID="duplicateText">Second Text</Text>
  </View>
);

const MyComponent = (_props: { testID?: string }) => <Text>My Component</Text>;

test('getByTestId returns only native elements', () => {
  render(
    <View>
      <Text testID="text">Text</Text>
      <TextInput testID="textInput" />
      <View testID="view" />
      <Button testID="button" title="Button" onPress={jest.fn()} />
      <MyComponent testID="myComponent" />
    </View>,
  );

  expect(screen.getByTestId('text')).toBeTruthy();
  expect(screen.getByTestId('textInput')).toBeTruthy();
  expect(screen.getByTestId('view')).toBeTruthy();
  expect(screen.getByTestId('button')).toBeTruthy();

  expect(screen.getAllByTestId('text')).toHaveLength(1);
  expect(screen.getAllByTestId('textInput')).toHaveLength(1);
  expect(screen.getAllByTestId('view')).toHaveLength(1);
  expect(screen.getAllByTestId('button')).toHaveLength(1);

  expect(() => screen.getByTestId('myComponent')).toThrow(
    'Unable to find an element with testID: myComponent',
  );
  expect(() => screen.getAllByTestId('myComponent')).toThrow(
    'Unable to find an element with testID: myComponent',
  );
});

test('supports a regex matcher', () => {
  render(
    <View>
      <Text testID="text">Text</Text>
      <TextInput testID="textInput" />
      <View testID="view" />
      <Button testID="button" title="Button" onPress={jest.fn()} />
      <MyComponent testID="myComponent" />
    </View>,
  );

  expect(screen.getByTestId(/view/)).toBeTruthy();
  expect(screen.getAllByTestId(/text/)).toHaveLength(2);
});

test('getByTestId, queryByTestId', () => {
  render(<Banana />);
  const component = screen.getByTestId('bananaFresh');

  expect(component.props.children).toBe('not fresh');
  expect(() => screen.getByTestId('InExistent')).toThrow(
    'Unable to find an element with testID: InExistent',
  );

  expect(screen.getByTestId('bananaFresh')).toBe(component);
  expect(screen.queryByTestId('InExistent')).toBeNull();

  expect(() => screen.getByTestId('duplicateText')).toThrow(
    'Found multiple elements with testID: duplicateText',
  );
  expect(() => screen.queryByTestId('duplicateText')).toThrow(
    'Found multiple elements with testID: duplicateText',
  );
});

test('getAllByTestId, queryAllByTestId', () => {
  render(<Banana />);
  const textElements = screen.getAllByTestId('duplicateText');

  expect(textElements.length).toBe(2);
  expect(textElements[0].props.children).toBe('First Text');
  expect(textElements[1].props.children).toBe('Second Text');
  expect(() => screen.getAllByTestId('nonExistentTestId')).toThrow(
    'Unable to find an element with testID: nonExistentTestId',
  );

  const queriedTextElements = screen.queryAllByTestId('duplicateText');

  expect(queriedTextElements.length).toBe(2);
  expect(queriedTextElements[0]).toBe(textElements[0]);
  expect(queriedTextElements[1]).toBe(textElements[1]);
  expect(screen.queryAllByTestId('nonExistentTestId')).toHaveLength(0);
});

test('findByTestId and findAllByTestId work asynchronously', async () => {
  const options = { timeout: 10 }; // Short timeout so that this test runs quickly
  render(<View />);
  await expect(screen.findByTestId('aTestId', {}, options)).rejects.toBeTruthy();
  await expect(screen.findAllByTestId('aTestId', {}, options)).rejects.toBeTruthy();

  setTimeout(
    () =>
      screen.rerender(
        <View testID="aTestId">
          <Text>Some Text</Text>
          <TextInput placeholder="Placeholder Text" />
          <TextInput value="Display Value" />
        </View>,
      ),
    20,
  );

  await expect(screen.findByTestId('aTestId')).resolves.toBeTruthy();
  await expect(screen.findAllByTestId('aTestId')).resolves.toHaveLength(1);
}, 20000);

test('byTestId queries support hidden option', () => {
  render(
    <Text style={{ display: 'none' }} testID="hidden">
      Hidden from accessibility
    </Text>,
  );

  expect(screen.getByTestId('hidden', { includeHiddenElements: true })).toBeTruthy();

  expect(screen.queryByTestId('hidden')).toBeFalsy();
  expect(screen.queryByTestId('hidden', { includeHiddenElements: false })).toBeFalsy();
  expect(() => screen.getByTestId('hidden', { includeHiddenElements: false }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with testID: hidden

    <>
      <Text
        style={
          {
            "display": "none",
          }
        }
        testID="hidden"
      >
        Hidden from accessibility
      </Text>
    </>"
  `);
});

test('error message renders the element tree, preserving only helpful props', async () => {
  render(<View testID="TEST_ID" key="3" />);

  expect(() => screen.getByTestId('FOO')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with testID: FOO

    <>
      <View
        testID="TEST_ID"
      />
    </>"
  `);

  expect(() => screen.getAllByTestId('FOO')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with testID: FOO

    <>
      <View
        testID="TEST_ID"
      />
    </>"
  `);

  await expect(screen.findByTestId('FOO')).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with testID: FOO

    <>
      <View
        testID="TEST_ID"
      />
    </>"
  `);

  await expect(screen.findAllByTestId('FOO')).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with testID: FOO

    <>
      <View
        testID="TEST_ID"
      />
    </>"
  `);
});
