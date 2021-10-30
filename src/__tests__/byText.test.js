// @flow
import * as React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { render } from '..';

const MyButton = ({ children, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text>{children}</Text>
  </TouchableOpacity>
);

const Banana = () => {
  const test = 0;
  return (
    <View>
      <Text>Is the banana fresh?</Text>
      <Text testID="bananaFresh">not fresh</Text>

      <MyButton onPress={jest.fn()} type="primary">
        Change freshness!
      </MyButton>
      <Text testID="duplicateText">First Text</Text>
      <Text testID="duplicateText">Second Text</Text>
      <Text>{test}</Text>
    </View>
  );
};

test('getByText, queryByText', () => {
  const { getByText, queryByText } = render(<Banana />);
  const button = getByText(/change/i);

  expect(button.props.children).toBe('Change freshness!');

  const sameButton = getByText('not fresh');

  expect(sameButton.props.children).toBe('not fresh');
  expect(() => getByText('InExistent')).toThrow(
    'Unable to find an element with text: InExistent'
  );

  const zeroText = getByText('0');

  expect(queryByText(/change/i)).toBe(button);
  expect(queryByText('InExistent')).toBeNull();
  expect(() => queryByText(/fresh/)).toThrow(
    'Found multiple elements with text: /fresh/'
  );
  expect(queryByText('0')).toBe(zeroText);
});

test('getByText, queryByText with children as Array', () => {
  const BananaCounter = ({ numBananas }) => (
    <Text>There are {numBananas} bananas in the bunch</Text>
  );

  const BananaStore = () => (
    <View>
      <BananaCounter numBananas={3} />
      <BananaCounter numBananas={6} />
      <BananaCounter numBananas={5} />
    </View>
  );

  const { getByText } = render(<BananaStore />);

  const threeBananaBunch = getByText('There are 3 bananas in the bunch');
  expect(threeBananaBunch.props.children).toEqual([
    'There are ',
    3,
    ' bananas in the bunch',
  ]);
});

test('getAllByText, queryAllByText', () => {
  const { getAllByText, queryAllByText } = render(<Banana />);
  const buttons = getAllByText(/fresh/i);

  expect(buttons).toHaveLength(3);
  expect(() => getAllByText('InExistent')).toThrow(
    'Unable to find an element with text: InExistent'
  );

  expect(queryAllByText(/fresh/i)).toEqual(buttons);
  expect(queryAllByText('InExistent')).toHaveLength(0);
});

test('findByText queries work asynchronously', async () => {
  const options = { timeout: 10 }; // Short timeout so that this test runs quickly
  const { rerender, findByText, findAllByText } = render(<View />);
  await expect(findByText('Some Text', options)).rejects.toBeTruthy();
  await expect(findAllByText('Some Text', options)).rejects.toBeTruthy();

  setTimeout(
    () =>
      rerender(
        <View>
          <Text>Some Text</Text>
        </View>
      ),
    20
  );

  await expect(findByText('Some Text')).resolves.toBeTruthy();
  await expect(findAllByText('Some Text')).resolves.toHaveLength(1);
}, 20000);

test.skip('getByText works properly with custom text component', () => {
  function BoldText({ children }) {
    return <Text>{children}</Text>;
  }

  expect(
    render(
      <Text>
        <BoldText>Hello</BoldText>
      </Text>
    ).getByText('Hello')
  ).toBeTruthy();
});

test.skip('getByText works properly with custom text container', () => {
  function MyText({ children }) {
    return <Text>{children}</Text>;
  }
  function BoldText({ children }) {
    return <Text>{children}</Text>;
  }

  expect(
    render(
      <MyText>
        <BoldText>Hello</BoldText>
      </MyText>
    ).getByText('Hello')
  ).toBeTruthy();
});

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

test('queryByText does not match nested text across multiple <Text> in <Text>', () => {
  const { queryByText } = render(
    <Text nativeID="1">
      Hello{' '}
      <Text nativeID="2">
        World
        <Text>!{true}</Text>
      </Text>
    </Text>
  );

  expect(queryByText('Hello World!')).toBe(null);
});

test('queryByText with nested Text components return the closest Text', () => {
  const NestedTexts = () => (
    <Text nativeID="1">
      <Text nativeID="2">My text</Text>
    </Text>
  );

  const { queryByText } = render(<NestedTexts />);

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

  expect(queryByText('My text', { exact: false })?.props.nativeID).toBe('2');
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
  ).toBe(null);
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

  expect(queryByTextFirstCase('My text')).toBe(null);
  expect(
    queryByTextSecondCase('My text', { exact: false })?.props.nativeID
  ).toBe('2');
});

test('queryAllByText does not match several times the same text', () => {
  const allMatched = render(
    <Text nativeID="1">
      Start
      <Text nativeID="2">This is a long text</Text>
    </Text>
  ).queryAllByText('long text', { exact: false });
  expect(allMatched.length).toBe(1);
  expect(allMatched[0].props.nativeID).toBe('2');
});

test('queryAllByText matches all the matching nodes', () => {
  const allMatched = render(
    <Text nativeID="1">
      Start
      <Text nativeID="2">This is a long text</Text>
      <Text nativeID="3">This is another long text</Text>
    </Text>
  ).queryAllByText('long text', { exact: false });
  expect(allMatched.length).toBe(2);
  expect(allMatched.map((node) => node.props.nativeID)).toEqual(['2', '3']);
});
