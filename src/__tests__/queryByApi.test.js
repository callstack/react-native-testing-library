// @flow
import React from 'react';
import { Text, Image } from 'react-native';
import { render } from '..';

test('queryByText nested <Image> in <Text> at start', () => {
  expect(
    render(
      <Text>
        <Image source={{}} />
        Hello
      </Text>
    ).queryByText('Hello')
  ).toBeTruthy();
});

test('queryByText nested <Image> in <Text> at end', () => {
  expect(
    render(
      <Text>
        Hello
        <Image source={{}} />
      </Text>
    ).queryByText('Hello')
  ).toBeTruthy();
});

test('queryByText nested <Image> in <Text> in middle', () => {
  expect(
    render(
      <Text>
        Hello
        <Image source={{}} />
        World
      </Text>
    ).queryByText('HelloWorld')
  ).toBeTruthy();
});

test('queryByText not found', () => {
  expect(
    render(
      <Text>
        Hello
        <Image source={{}} />
      </Text>
    ).queryByText('SomethingElse')
  ).toBeFalsy();
});

test('queryByText nested text across multiple <Text> in <Text>', () => {
  const { queryByText } = render(
    <Text nativeID="1">
      Hello{' '}
      <Text nativeID="2">
        World
        <Text>!{true}</Text>
      </Text>
    </Text>
  );

  expect(queryByText('Hello World!')?.props.nativeID).toBe('1');
  expect(queryByText('hello Wo', { exact: false })?.props.nativeID).toBe('1');
});

test('queryByText with nested Text components return the closest Text', () => {
  const NestedTexts = () => (
    <Text nativeID="1">
      <Text nativeID="2">My text</Text>
    </Text>
  );

  const { queryByText } = render(<NestedTexts />);

  expect(queryByText('My text')?.props.nativeID).toBe('2');
  expect(queryByText('My text', { exact: false })?.props.nativeID).toBe('2');
});

test('queryByText with nested Text components each with text return the lowest one', () => {
  const NestedTexts = () => (
    <Text nativeID="1">
      bob
      <Text nativeID="2">My text</Text>
    </Text>
  );

  const { queryByText } = render(<NestedTexts />);

  expect(queryByText('My text')?.props.nativeID).toBe('2');
});

test('queryByText with nested Text components: not-exact text match returns the most deeply nested common component', () => {
  const { queryByText: queryByTextFirstCase } = render(
    <Text nativeID="1">
      bob
      <Text nativeID="2">My </Text>
      <Text nativeID="3">text</Text>
    </Text>
  );

  const { queryByText: queryByTextSecondCase } = render(
    <Text nativeID="1">
      bob
      <Text nativeID="2">My text for test</Text>
    </Text>
  );

  expect(
    queryByTextFirstCase('My text', { exact: false })?.props.nativeID
  ).toBe('1');
  expect(
    queryByTextSecondCase('My text', { exact: false })?.props.nativeID
  ).toBe('2');
});

test('queryByText nested <CustomText> in <Text>', () => {
  const CustomText = ({ children }) => {
    return <Text>{children}</Text>;
  };

  expect(
    render(
      <Text>
        Hello <CustomText>World!</CustomText>
      </Text>
    ).queryByText('Hello World!')
  ).toBeTruthy();
});

test('queryByText nested deep <CustomText> in <Text>', () => {
  const CustomText = ({ children }) => {
    return <Text>{children}</Text>;
  };

  expect(
    render(
      <Text>
        <CustomText>Hello</CustomText> <CustomText>World!</CustomText>
      </Text>
    ).queryByText('Hello World!')
  ).toBeTruthy();
});
