// @flow
import * as React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { render } from '..';

const MyComponent = () => {
  return <Text>My Component</Text>;
};

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

  expect(() => getByTestId('myComponent')).toThrowError(
    'No instances found with testID: myComponent'
  );
  expect(() => getAllByTestId('myComponent')).toThrowError(
    'No instances found with testID: myComponent'
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
