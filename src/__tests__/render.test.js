// @flow
/* eslint-disable react/no-multi-comp */
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import stripAnsi from 'strip-ansi';
import { render, fireEvent } from '..';

type ConsoleLogMock = JestMockFn<Array<string>, void>;

const PLACEHOLDER_FRESHNESS = 'Add custom freshness';
const PLACEHOLDER_CHEF = 'Who inspected freshness?';
const INPUT_FRESHNESS = 'Custom Freshie';
const INPUT_CHEF = 'I inspected freshie';

class Button extends React.Component<*> {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Text>{this.props.children}</Text>
      </TouchableOpacity>
    );
  }
}

class Banana extends React.Component<*, *> {
  state = {
    fresh: false,
  };

  componentDidUpdate() {
    if (this.props.onUpdate) {
      this.props.onUpdate();
    }
  }

  componentWillUnmount() {
    if (this.props.onUnmount) {
      this.props.onUnmount();
    }
  }

  changeFresh = () => {
    this.setState(state => ({
      fresh: !state.fresh,
    }));
  };

  render() {
    return (
      <View>
        <Text>Is the banana fresh?</Text>
        <Text testID="bananaFresh">
          {this.state.fresh ? 'fresh' : 'not fresh'}
        </Text>
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
        <Button onPress={this.changeFresh} type="primary">
          Change freshness!
        </Button>
        <Text testID="duplicateText">First Text</Text>
        <Text testID="duplicateText">Second Text</Text>
      </View>
    );
  }
}

test('getByTestId, queryByTestId', () => {
  const { getByTestId, queryByTestId } = render(<Banana />);
  const component = getByTestId('bananaFresh');

  expect(component.props.children).toBe('not fresh');
  expect(() => getByTestId('InExistent')).toThrow('No instances found');

  expect(getByTestId('bananaFresh')).toBe(component);
  expect(queryByTestId('InExistent')).toBeNull();
});

test('getAllByTestId, queryAllByTestId', () => {
  const { getAllByTestId, queryAllByTestId } = render(<Banana />);
  const textElements = getAllByTestId('duplicateText');

  expect(textElements.length).toBe(2);
  expect(textElements[0].props.children).toBe('First Text');
  expect(textElements[1].props.children).toBe('Second Text');
  expect(() => getAllByTestId('nonExistentTestId')).toThrow(
    'No instances found'
  );

  const queriedTextElements = queryAllByTestId('duplicateText');

  expect(queriedTextElements.length).toBe(2);
  expect(queriedTextElements[0]).toBe(textElements[0]);
  expect(queriedTextElements[1]).toBe(textElements[1]);
  expect(queryAllByTestId('nonExistentTestId')).toHaveLength(0);
});

test('getByName, queryByName', () => {
  const { getByTestId, getByName, queryByName } = render(<Banana />);
  const bananaFresh = getByTestId('bananaFresh');
  const button = getByName('Button');

  button.props.onPress();

  expect(bananaFresh.props.children).toBe('fresh');

  const sameButton = getByName(Button);
  sameButton.props.onPress();

  expect(bananaFresh.props.children).toBe('not fresh');
  expect(() => getByName('InExistent')).toThrow('No instances found');
  expect(() => getByName(Text)).toThrow('Expected 1 but found 5');

  expect(queryByName('Button')).toBe(button);
  expect(queryByName('InExistent')).toBeNull();
});

test('getAllByName, queryAllByName', () => {
  const { getAllByName, queryAllByName } = render(<Banana />);
  const [text, status, button] = getAllByName('Text');

  expect(text.props.children).toBe('Is the banana fresh?');
  expect(status.props.children).toBe('not fresh');
  expect(button.props.children).toBe('Change freshness!');
  expect(() => getAllByName('InExistent')).toThrow('No instances found');

  expect(queryAllByName('Text')[1]).toBe(status);
  expect(queryAllByName('InExistent')).toHaveLength(0);
});

test('getAllByType, queryAllByType', () => {
  const { getAllByType, queryAllByType } = render(<Banana />);
  const [text, status, button] = getAllByType(Text);
  const InExistent = () => null;

  expect(text.props.children).toBe('Is the banana fresh?');
  expect(status.props.children).toBe('not fresh');
  expect(button.props.children).toBe('Change freshness!');
  expect(() => getAllByType(InExistent)).toThrow('No instances found');

  expect(queryAllByType(Text)[1]).toBe(status);
  expect(queryAllByType(InExistent)).toHaveLength(0);
});

test('getByText, queryByText', () => {
  const { getByText, queryByText } = render(<Banana />);
  const button = getByText(/change/i);

  expect(button.props.children).toBe('Change freshness!');

  const sameButton = getByText('not fresh');

  expect(sameButton.props.children).toBe('not fresh');
  expect(() => getByText('InExistent')).toThrow('No instances found');

  expect(queryByText(/change/i)).toBe(button);
  expect(queryByText('InExistent')).toBeNull();
  expect(() => queryByText(/fresh/)).toThrow('Expected 1 but found 3');
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
  expect(() => getAllByText('InExistent')).toThrow('No instances found');

  expect(queryAllByText(/fresh/i)).toEqual(buttons);
  expect(queryAllByText('InExistent')).toHaveLength(0);
});

test('getByPlaceholder, queryByPlaceholder', () => {
  const { getByPlaceholder, queryByPlaceholder } = render(<Banana />);
  const input = getByPlaceholder(/custom/i);

  expect(input.props.placeholder).toBe(PLACEHOLDER_FRESHNESS);

  const sameInput = getByPlaceholder(PLACEHOLDER_FRESHNESS);

  expect(sameInput.props.placeholder).toBe(PLACEHOLDER_FRESHNESS);
  expect(() => getByPlaceholder('no placeholder')).toThrow(
    'No instances found'
  );

  expect(queryByPlaceholder(/add/i)).toBe(input);
  expect(queryByPlaceholder('no placeholder')).toBeNull();
  expect(() => queryByPlaceholder(/fresh/)).toThrow('Expected 1 but found 2');
});

test('getAllByPlaceholder, queryAllByPlaceholder', () => {
  const { getAllByPlaceholder, queryAllByPlaceholder } = render(<Banana />);
  const inputs = getAllByPlaceholder(/fresh/i);

  expect(inputs).toHaveLength(2);
  expect(() => getAllByPlaceholder('no placeholder')).toThrow(
    'No instances found'
  );

  expect(queryAllByPlaceholder(/fresh/i)).toEqual(inputs);
  expect(queryAllByPlaceholder('no placeholder')).toHaveLength(0);
});

test('getByDisplayValue, queryByDisplayValue', () => {
  const { getByDisplayValue, queryByDisplayValue } = render(<Banana />);
  const input = getByDisplayValue(/custom/i);

  expect(input.props.value).toBe(INPUT_FRESHNESS);

  const sameInput = getByDisplayValue(INPUT_FRESHNESS);

  expect(sameInput.props.value).toBe(INPUT_FRESHNESS);
  expect(() => getByDisplayValue('no value')).toThrow('No instances found');

  expect(queryByDisplayValue(/custom/i)).toBe(input);
  expect(queryByDisplayValue('no value')).toBeNull();
  expect(() => queryByDisplayValue(/fresh/i)).toThrow('Expected 1 but found 2');
});

test('getAllByDisplayValue, queryAllByDisplayValue', () => {
  const { getAllByDisplayValue, queryAllByDisplayValue } = render(<Banana />);
  const inputs = getAllByDisplayValue(/fresh/i);

  expect(inputs).toHaveLength(2);
  expect(() => getAllByDisplayValue('no value')).toThrow('No instances found');

  expect(queryAllByDisplayValue(/fresh/i)).toEqual(inputs);
  expect(queryAllByDisplayValue('no value')).toHaveLength(0);
});

test('getByProps, queryByProps', () => {
  const { getByProps, queryByProps } = render(<Banana />);
  const primaryType = getByProps({ type: 'primary' });

  expect(primaryType.props.children).toBe('Change freshness!');
  expect(() => getByProps({ type: 'inexistent' })).toThrow(
    'No instances found'
  );

  expect(queryByProps({ type: 'primary' })).toBe(primaryType);
  expect(queryByProps({ type: 'inexistent' })).toBeNull();
});

test('getAllByProp, queryAllByProps', () => {
  const { getAllByProps, queryAllByProps } = render(<Banana />);
  const primaryTypes = getAllByProps({ type: 'primary' });

  expect(primaryTypes).toHaveLength(1);
  expect(() => getAllByProps({ type: 'inexistent' })).toThrow(
    'No instances found'
  );

  expect(queryAllByProps({ type: 'primary' })).toEqual(primaryTypes);
  expect(queryAllByProps({ type: 'inexistent' })).toHaveLength(0);
});

test('update', () => {
  const fn = jest.fn();
  const { getByName, update, rerender } = render(<Banana onUpdate={fn} />);
  const button = getByName('Button');

  button.props.onPress();

  update(<Banana onUpdate={fn} />);
  rerender(<Banana onUpdate={fn} />);

  expect(fn).toHaveBeenCalledTimes(3);
});

test('unmount', () => {
  const fn = jest.fn();
  const { unmount } = render(<Banana onUnmount={fn} />);
  unmount();
  expect(fn).toHaveBeenCalled();
});

test('toJSON', () => {
  const { toJSON } = render(<Button>press me</Button>);

  expect(toJSON()).toMatchSnapshot();
});

test('debug', () => {
  jest.spyOn(console, 'log').mockImplementation(x => x);

  const { debug } = render(<Banana />);

  debug();
  debug('my custom message');
  debug.shallow();
  debug.shallow('my other custom message');

  // eslint-disable-next-line no-console
  const mockCalls = ((console.log: any): ConsoleLogMock).mock.calls;

  expect(stripAnsi(mockCalls[0][0])).toMatchSnapshot();
  expect(stripAnsi(mockCalls[1][0] + mockCalls[1][1])).toMatchSnapshot(
    'with message'
  );
  expect(stripAnsi(mockCalls[2][0])).toMatchSnapshot('shallow');
  expect(stripAnsi(mockCalls[3][0] + mockCalls[3][1])).toMatchSnapshot(
    'shallow with message'
  );
});

test('debug changing component', () => {
  jest.spyOn(console, 'log').mockImplementation(x => x);

  const { getByProps, debug } = render(<Banana />);

  fireEvent.press(getByProps({ type: 'primary' }));

  debug();

  // eslint-disable-next-line no-console
  const mockCalls = ((console.log: any): ConsoleLogMock).mock.calls;

  expect(stripAnsi(mockCalls[4][0])).toMatchSnapshot(
    'bananaFresh button message should now be "fresh"'
  );
});

test('renders options.wrapper around node', () => {
  const WrapperComponent = ({ children }) => (
    <SafeAreaView testID="wrapper">{children}</SafeAreaView>
  );

  const { toJSON, getByTestId } = render(<View testID="inner" />, {
    wrapper: WrapperComponent,
  });

  expect(getByTestId('wrapper')).toBeTruthy();
  expect(toJSON()).toMatchInlineSnapshot(`
    <RCTSafeAreaView
      emulateUnlessSupported={true}
      testID="wrapper"
    >
      <View
        testID="inner"
      />
    </RCTSafeAreaView>
  `);
});

test('renders options.wrapper around updated node', () => {
  const WrapperComponent = ({ children }) => (
    <SafeAreaView testID="wrapper">{children}</SafeAreaView>
  );

  const { toJSON, getByTestId, rerender } = render(<View testID="inner" />, {
    wrapper: WrapperComponent,
  });

  rerender(<View testID="inner" accessibilityLabel="test" />);

  expect(getByTestId('wrapper')).toBeTruthy();
  expect(toJSON()).toMatchInlineSnapshot(`
    <RCTSafeAreaView
      emulateUnlessSupported={true}
      testID="wrapper"
    >
      <View
        accessibilityLabel="test"
        testID="inner"
      />
    </RCTSafeAreaView>
  `);
});
