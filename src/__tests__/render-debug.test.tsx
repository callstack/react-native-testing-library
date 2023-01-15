/* eslint-disable no-console */
import * as React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import stripAnsi from 'strip-ansi';
import { render, fireEvent, configure } from '..';

type ConsoleLogMock = jest.Mock<Array<string>>;

const PLACEHOLDER_FRESHNESS = 'Add custom freshness';
const PLACEHOLDER_CHEF = 'Who inspected freshness?';
const INPUT_FRESHNESS = 'Custom Freshie';
const INPUT_CHEF = 'I inspected freshie';
const DEFAULT_INPUT_CHEF = 'What did you inspect?';
const DEFAULT_INPUT_CUSTOMER = 'What banana?';

const ignoreWarnings = ['Using debug("message") is deprecated'];

const realConsoleWarn = console.warn;

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation((message) => {
    if (!ignoreWarnings.some((warning) => message.includes(warning))) {
      realConsoleWarn(message);
    }
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

class MyButton extends React.Component<any> {
  render() {
    return (
      <Pressable onPress={this.props.onPress}>
        <Text>{this.props.children}</Text>
      </Pressable>
    );
  }
}

class Banana extends React.Component<any, { fresh: boolean }> {
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
    this.setState((state) => ({
      fresh: !state.fresh,
    }));
  };

  render() {
    const test = 0;
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
          defaultValue={DEFAULT_INPUT_CHEF}
        />
        <TextInput defaultValue={DEFAULT_INPUT_CUSTOMER} />
        <TextInput defaultValue={'hello'} value="" />
        <MyButton onPress={this.changeFresh} type="primary">
          Change freshness!
        </MyButton>
        <Text testID="duplicateText">First Text</Text>
        <Text testID="duplicateText">Second Text</Text>
        <Text>{test}</Text>
      </View>
    );
  }
}

test('debug', () => {
  const { debug } = render(<Banana />);

  debug();
  debug('my custom message');
  debug.shallow();
  debug.shallow('my other custom message');
  debug({ message: 'another custom message' });

  const mockCalls = (console.log as any as ConsoleLogMock).mock.calls;
  expect(stripAnsi(mockCalls[0][0])).toMatchSnapshot();
  expect(stripAnsi(mockCalls[1][0] + mockCalls[1][1])).toMatchSnapshot(
    'with message'
  );
  expect(stripAnsi(mockCalls[2][0])).toMatchSnapshot('shallow');
  expect(stripAnsi(mockCalls[3][0] + mockCalls[3][1])).toMatchSnapshot(
    'shallow with message'
  );
  expect(stripAnsi(mockCalls[4][0] + mockCalls[4][1])).toMatchSnapshot(
    'another custom message'
  );

  const mockWarnCalls = (console.warn as any as ConsoleLogMock).mock.calls;
  expect(mockWarnCalls[0]).toEqual([
    'Using debug("message") is deprecated and will be removed in future release, please use debug({ message; "message" }) instead.',
  ]);
});

test('debug changing component', () => {
  const { UNSAFE_getByProps, debug } = render(<Banana />);
  fireEvent.press(UNSAFE_getByProps({ type: 'primary' }));

  debug();

  const mockCalls = (console.log as any as ConsoleLogMock).mock.calls;
  expect(stripAnsi(mockCalls[0][0])).toMatchSnapshot(
    'bananaFresh button message should now be "fresh"'
  );
});

test('debug with only children prop', () => {
  const { debug } = render(<Banana />);
  debug({ mapProps: () => ({}) });

  const mockCalls = (console.log as any as ConsoleLogMock).mock.calls;
  expect(stripAnsi(mockCalls[0][0])).toMatchSnapshot();
});

test('debug with only prop whose value is bananaChef', () => {
  const { debug } = render(<Banana />);
  debug({
    mapProps: (props) => {
      const filterProps: Record<string, unknown> = {};
      Object.keys(props).forEach((key) => {
        if (props[key] === 'bananaChef') {
          filterProps[key] = props[key];
        }
      });
      return filterProps;
    },
  });

  const mockCalls = (console.log as any as ConsoleLogMock).mock.calls;
  expect(stripAnsi(mockCalls[0][0])).toMatchSnapshot();
});

test('debug with only props from TextInput components', () => {
  const { debug } = render(<Banana />);
  debug({
    mapProps: (props, node) => (node.type === 'TextInput' ? props : {}),
  });

  const mockCalls = (console.log as any as ConsoleLogMock).mock.calls;
  expect(stripAnsi(mockCalls[0][0])).toMatchSnapshot();
});

test('debug should use debugOptions from config when no option is specified', () => {
  configure({ defaultDebugOptions: { mapProps: () => ({}) } });

  const { debug } = render(
    <View style={{ backgroundColor: 'red' }}>
      <Text>hello</Text>
    </View>
  );
  debug();

  const mockCalls = (console.log as any as ConsoleLogMock).mock.calls;
  expect(stripAnsi(mockCalls[0][0])).toMatchSnapshot();
});

test('filtering out props through mapProps option should not modify component', () => {
  const { debug, getByTestId } = render(<View testID="viewTestID" />);
  debug({ mapProps: () => ({}) });

  expect(getByTestId('viewTestID')).toBeTruthy();
});

test('debug should use given options over config debugOptions', () => {
  configure({ defaultDebugOptions: { mapProps: () => ({}) } });

  const { debug } = render(
    <View style={{ backgroundColor: 'red' }}>
      <Text>hello</Text>
    </View>
  );
  debug({ mapProps: (props) => props });

  const mockCalls = (console.log as any as ConsoleLogMock).mock.calls;
  expect(stripAnsi(mockCalls[0][0])).toMatchSnapshot();
});
