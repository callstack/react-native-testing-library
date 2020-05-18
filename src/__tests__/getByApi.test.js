// @flow
import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { render } from '..';

const options = { timeout: 10 }; // Short timeout so that this test runs quickly

const MyComponent = () => {
  return <Text>My Component</Text>;
};

test('byTestId returns only native elements', () => {
  const {
    getByTestId,
    getAllByTestId,
    queryByTestId,
    queryAllByTestId,
  } = render(
    <View>
      <Text testID="text">Text</Text>
      <TextInput testID="textInput" />
      <View testID="view" />
      <Button testID="button" title="Button" />
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

  expect(queryByTestId('myComponent')).toBeFalsy();
  expect(queryAllByTestId('myComponent')).toHaveLength(0);
});
