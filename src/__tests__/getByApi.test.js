// @flow
import React from 'react';
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

test('getByText with nested native Text component get closest Text', () => {
  const NestedText = () => {
    return (
      <Text testID="outer">
        <Text testID="inner">Test</Text>
      </Text>
    );
  };

  const { getByText } = render(<NestedText />);

  expect(getByText('Test').props.testID).toBe('inner');
});

test('getByText with nested multiple custom Text component get closest Text', () => {
  const CustomText = ({ children, ...rest }) => (
    <Text {...rest}>{children}</Text>
  );

  const NestedText = () => {
    return (
      <CustomText testID="outer">
        <CustomText testID="inner1">Test1</CustomText>
        <CustomText testID="inner2">Test2</CustomText>
      </CustomText>
    );
  };

  const { getByText } = render(<NestedText />);

  expect(getByText('Test1').props.testID).toBe('inner1');
});

test('getByText with nested custom Text component get closest Text', () => {
  const CustomText = ({ children, ...rest }) => (
    <Text {...rest}>{children}</Text>
  );

  const NestedText = () => {
    return (
      <CustomText testID="outer">
        <CustomText testID="inner">Test</CustomText>
      </CustomText>
    );
  };

  const { getByText } = render(<NestedText />);

  expect(getByText('Test').props.testID).toBe('inner');
});
