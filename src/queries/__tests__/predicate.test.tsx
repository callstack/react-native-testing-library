import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { ReactTestInstance } from 'react-test-renderer';
import { render } from '../..';

test('getByPredicate returns only native elements', () => {
  const testIdPredicate = (testID: string) => (element: ReactTestInstance) => {
    return element.props.testID === testID;
  };

  const textInputPredicate = function matchTextInput(
    element: ReactTestInstance
  ) {
    // @ts-expect-error - ReatTestInstance type is missing host element typing
    return element.type === 'TextInput';
  };

  const { getByPredicate, getAllByPredicate } = render(
    <View>
      <Text testID="text">Text</Text>
      <TextInput testID="textInput" />
      <View testID="view" />
      <Button testID="button" title="Button" onPress={jest.fn()} />
    </View>
  );

  expect(getByPredicate(testIdPredicate('text'))).toBeTruthy();
  expect(getByPredicate(testIdPredicate('textInput'))).toBeTruthy();
  expect(getByPredicate(testIdPredicate('view'))).toBeTruthy();
  expect(getByPredicate(testIdPredicate('button'))).toBeTruthy();

  expect(getAllByPredicate(testIdPredicate('text'))).toHaveLength(1);
  expect(getAllByPredicate(testIdPredicate('textInput'))).toHaveLength(1);
  expect(getAllByPredicate(testIdPredicate('view'))).toHaveLength(1);
  expect(getAllByPredicate(testIdPredicate('button'))).toHaveLength(1);

  expect(getByPredicate(textInputPredicate)).toBeTruthy();
});

test('getByPredicate error messages', () => {
  function hasStylePredicate(element: ReactTestInstance) {
    return element.props.style !== undefined;
  }

  const textInputPredicate = function textInputPredicate(
    element: ReactTestInstance
  ) {
    // @ts-expect-error - ReatTestInstance type is missing host element typing
    return element.type === 'TextInput';
  };

  const testIdPredicate = (testID: string) => (element: ReactTestInstance) => {
    return element.props.testID === testID;
  };

  const { getByPredicate, getAllByPredicate } = render(
    <View>
      <Text testID="text">Text</Text>
    </View>
  );

  expect(() => getByPredicate(hasStylePredicate))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element matching predicate: function hasStylePredicate(element) {
        return element.props.style !== undefined;
      }"
  `);

  expect(() => getByPredicate(textInputPredicate))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element matching predicate: function textInputPredicate(element) {
        // @ts-expect-error - ReatTestInstance type is missing host element typing
        return element.type === 'TextInput';
      }"
  `);

  expect(() => getByPredicate(testIdPredicate('myComponent')))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element matching predicate: element => {
        return element.props.testID === testID;
      }"
  `);
  expect(() => getAllByPredicate(testIdPredicate('myComponent')))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element matching predicate: element => {
        return element.props.testID === testID;
      }"
  `);
});
