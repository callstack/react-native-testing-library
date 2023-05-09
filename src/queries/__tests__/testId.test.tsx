import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { render } from '../..';

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
    <TextInput
      testID="bananaChef"
      placeholder={PLACEHOLDER_CHEF}
      value={INPUT_CHEF}
    />
    <Text testID="duplicateText">First Text</Text>
    <Text testID="duplicateText">Second Text</Text>
  </View>
);

const MyComponent = (_props: { testID?: string }) => <Text>My Component</Text>;

test('getByTestId returns only native elements', () => {
  const { getByTestId, getAllByTestId } = render(
    <View>
      <Text testID="text">Text</Text>
      <TextInput testID="textInput" />
      <View testID="view" />
      <Button testID="button" title="Button" onPress={jest.fn()} />
      <MyComponent testID="myComponent" />
    </View>
  );

  expect(getByTestId('text')).toBeTruthy();
  expect(getByTestId('textInput')).toBeTruthy();
  expect(getByTestId('view')).toBeTruthy();
  expect(getByTestId('button')).toBeTruthy();

  expect(getAllByTestId('text')).toHaveLength(1);
  expect(getAllByTestId('textInput')).toHaveLength(1);
  expect(getAllByTestId('view')).toHaveLength(1);
  expect(getAllByTestId('button')).toHaveLength(1);

  expect(() => getByTestId('myComponent')).toThrow(
    'Unable to find an element with testID: myComponent'
  );
  expect(() => getAllByTestId('myComponent')).toThrow(
    'Unable to find an element with testID: myComponent'
  );
});

test('supports a regex matcher', () => {
  const { getByTestId, getAllByTestId } = render(
    <View>
      <Text testID="text">Text</Text>
      <TextInput testID="textInput" />
      <View testID="view" />
      <Button testID="button" title="Button" onPress={jest.fn()} />
      <MyComponent testID="myComponent" />
    </View>
  );

  expect(getByTestId(/view/)).toBeTruthy();
  expect(getAllByTestId(/text/)).toHaveLength(2);
});

test('getByTestId, queryByTestId', () => {
  const { getByTestId, queryByTestId } = render(<Banana />);
  const component = getByTestId('bananaFresh');

  expect(component.props.children).toBe('not fresh');
  expect(() => getByTestId('InExistent')).toThrow(
    'Unable to find an element with testID: InExistent'
  );

  expect(getByTestId('bananaFresh')).toBe(component);
  expect(queryByTestId('InExistent')).toBeNull();

  expect(() => getByTestId('duplicateText')).toThrow(
    'Found multiple elements with testID: duplicateText'
  );
  expect(() => queryByTestId('duplicateText')).toThrow(
    'Found multiple elements with testID: duplicateText'
  );
});

test('getAllByTestId, queryAllByTestId', () => {
  const { getAllByTestId, queryAllByTestId } = render(<Banana />);
  const textElements = getAllByTestId('duplicateText');

  expect(textElements.length).toBe(2);
  expect(textElements[0].props.children).toBe('First Text');
  expect(textElements[1].props.children).toBe('Second Text');
  expect(() => getAllByTestId('nonExistentTestId')).toThrow(
    'Unable to find an element with testID: nonExistentTestId'
  );

  const queriedTextElements = queryAllByTestId('duplicateText');

  expect(queriedTextElements.length).toBe(2);
  expect(queriedTextElements[0]).toBe(textElements[0]);
  expect(queriedTextElements[1]).toBe(textElements[1]);
  expect(queryAllByTestId('nonExistentTestId')).toHaveLength(0);
});

test('findByTestId and findAllByTestId work asynchronously', async () => {
  const options = { timeout: 10 }; // Short timeout so that this test runs quickly
  const { rerender, findByTestId, findAllByTestId } = render(<View />);
  await expect(findByTestId('aTestId', {}, options)).rejects.toBeTruthy();
  await expect(findAllByTestId('aTestId', {}, options)).rejects.toBeTruthy();

  setTimeout(
    () =>
      rerender(
        <View testID="aTestId">
          <Text>Some Text</Text>
          <TextInput placeholder="Placeholder Text" />
          <TextInput value="Display Value" />
        </View>
      ),
    20
  );

  await expect(findByTestId('aTestId')).resolves.toBeTruthy();
  await expect(findAllByTestId('aTestId')).resolves.toHaveLength(1);
}, 20000);

test('byTestId queries support hidden option', () => {
  const { getByTestId, queryByTestId } = render(
    <Text style={{ display: 'none' }} testID="hidden">
      Hidden from accessibility
    </Text>
  );

  expect(getByTestId('hidden', { includeHiddenElements: true })).toBeTruthy();

  expect(queryByTestId('hidden')).toBeFalsy();
  expect(queryByTestId('hidden', { includeHiddenElements: false })).toBeFalsy();
  expect(() => getByTestId('hidden', { includeHiddenElements: false }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with testID: hidden

    <Text
      style={
        {
          "display": "none",
        }
      }
      testID="hidden"
    >
      Hidden from accessibility
    </Text>"
  `);
});

test('error message renders the element tree, preserving only helpful props', async () => {
  const view = render(<View testID="TEST_ID" key="3" />);

  expect(() => view.getByTestId('FOO')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with testID: FOO

    <View
      testID="TEST_ID"
    />"
  `);

  expect(() => view.getAllByTestId('FOO')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with testID: FOO

    <View
      testID="TEST_ID"
    />"
  `);

  await expect(view.findByTestId('FOO')).rejects
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with testID: FOO

    <View
      testID="TEST_ID"
    />"
  `);

  await expect(view.findAllByTestId('FOO')).rejects
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with testID: FOO

    <View
      testID="TEST_ID"
    />"
  `);
});
