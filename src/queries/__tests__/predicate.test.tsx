import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { ReactTestInstance } from 'react-test-renderer';
import { render } from '../..';

test('getByPredicate returns only native elements', () => {
  const testIdPredicate = (testID: string) => (node: ReactTestInstance) => {
    return node.props.testID === testID;
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

  expect(() => getByPredicate(testIdPredicate('myComponent'))).toThrowError(
    /^Unable to find an element matching predicate: /i
  );
  expect(() => getAllByPredicate(testIdPredicate('myComponent'))).toThrowError(
    /^Unable to find an element matching predicate: /i
  );
});
