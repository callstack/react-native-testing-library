import * as React from 'react';
import { View, Text, TextInput, Pressable, SafeAreaView } from 'react-native';
import stripAnsi from 'strip-ansi';
import { render, fireEvent, RenderAPI } from '..';

type ConsoleLogMock = jest.Mock<Array<string>>;

const PLACEHOLDER_FRESHNESS = 'Add custom freshness';
const PLACEHOLDER_CHEF = 'Who inspected freshness?';
const INPUT_FRESHNESS = 'Custom Freshie';
const INPUT_CHEF = 'I inspected freshie';
const DEFAULT_INPUT_CHEF = 'What did you inspect?';
const DEFAULT_INPUT_CUSTOMER = 'What banana?';

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

test('UNSAFE_getAllByType, UNSAFE_queryAllByType', () => {
  const { UNSAFE_getAllByType, UNSAFE_queryAllByType } = render(<Banana />);
  const [text, status, button] = UNSAFE_getAllByType(Text);
  const InExistent = () => null;

  expect(text.props.children).toBe('Is the banana fresh?');
  expect(status.props.children).toBe('not fresh');
  expect(button.props.children).toBe('Change freshness!');
  expect(() => UNSAFE_getAllByType(InExistent)).toThrow('No instances found');

  expect(UNSAFE_queryAllByType(Text)[1]).toBe(status);
  expect(UNSAFE_queryAllByType(InExistent)).toHaveLength(0);
});

test('UNSAFE_getByProps, UNSAFE_queryByProps', () => {
  const { UNSAFE_getByProps, UNSAFE_queryByProps } = render(<Banana />);
  const primaryType = UNSAFE_getByProps({ type: 'primary' });

  expect(primaryType.props.children).toBe('Change freshness!');
  expect(() => UNSAFE_getByProps({ type: 'inexistent' })).toThrow(
    'No instances found'
  );

  expect(UNSAFE_queryByProps({ type: 'primary' })).toBe(primaryType);
  expect(UNSAFE_queryByProps({ type: 'inexistent' })).toBeNull();
});

test('UNSAFE_getAllByProp, UNSAFE_queryAllByProps', () => {
  const { UNSAFE_getAllByProps, UNSAFE_queryAllByProps } = render(<Banana />);
  const primaryTypes = UNSAFE_getAllByProps({ type: 'primary' });

  expect(primaryTypes).toHaveLength(1);
  expect(() => UNSAFE_getAllByProps({ type: 'inexistent' })).toThrow(
    'No instances found'
  );

  expect(UNSAFE_queryAllByProps({ type: 'primary' })).toEqual(primaryTypes);
  expect(UNSAFE_queryAllByProps({ type: 'inexistent' })).toHaveLength(0);
});

test('update', () => {
  const fn = jest.fn();
  const { getByText, update, rerender } = render(<Banana onUpdate={fn} />);

  fireEvent.press(getByText('Change freshness!'));

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

test('unmount should handle cleanup functions', () => {
  const cleanup = jest.fn();
  const Component = () => {
    React.useEffect(() => cleanup);
    return null;
  };

  const { unmount } = render(<Component />);

  unmount();

  expect(cleanup).toHaveBeenCalledTimes(1);
});

test('toJSON', () => {
  const { toJSON } = render(<MyButton>press me</MyButton>);

  expect(toJSON()).toMatchSnapshot();
});

test('debug', () => {
  jest.spyOn(console, 'log').mockImplementation((x) => x);

  const { debug } = render(<Banana />);

  debug();
  debug('my custom message');
  debug.shallow();
  debug.shallow('my other custom message');
  debug({ message: 'another custom message' });

  // eslint-disable-next-line no-console
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
});

test('debug changing component', () => {
  jest.spyOn(console, 'log').mockImplementation((x) => x);

  const { UNSAFE_getByProps, debug } = render(<Banana />);

  fireEvent.press(UNSAFE_getByProps({ type: 'primary' }));

  debug();

  // eslint-disable-next-line no-console
  const mockCalls = (console.log as any as ConsoleLogMock).mock.calls;

  expect(stripAnsi(mockCalls[0][0])).toMatchSnapshot(
    'bananaFresh button message should now be "fresh"'
  );
});

test('debug with only children prop', () => {
  jest.spyOn(console, 'log').mockImplementation((x) => x);

  const { debug, getByText } = render(<Banana />);

  debug({ filterProps: (propName) => propName === 'children' });

  // eslint-disable-next-line no-console
  const mockCalls = (console.log as any as ConsoleLogMock).mock.calls;

  expect(stripAnsi(mockCalls[0][0])).toMatchSnapshot();

  expect(getByText('Change freshness!')).toBeTruthy();
});

test('debug with only prop whose value is bananaChef', () => {
  jest.spyOn(console, 'log').mockImplementation((x) => x);

  const { debug, getByText } = render(<Banana />);

  debug({ filterProps: (_propName, propValue) => propValue === 'bananaChef' });

  // eslint-disable-next-line no-console
  const mockCalls = (console.log as any as ConsoleLogMock).mock.calls;

  expect(stripAnsi(mockCalls[0][0])).toMatchSnapshot();

  expect(getByText('Change freshness!')).toBeTruthy();
});

test('debug with only props from TextInput components', () => {
  jest.spyOn(console, 'log').mockImplementation((x) => x);

  const { debug, getByText } = render(<Banana />);

  debug({
    filterProps: (_propName, _propValue, node) => node.type === 'TextInput',
  });

  // eslint-disable-next-line no-console
  const mockCalls = (console.log as any as ConsoleLogMock).mock.calls;

  expect(stripAnsi(mockCalls[0][0])).toMatchSnapshot();

  expect(getByText('Change freshness!')).toBeTruthy();
});

test('debug with all props filtered', () => {
  jest.spyOn(console, 'log').mockImplementation((x) => x);

  const { debug, getByText } = render(<Banana />);

  debug({ filterProps: () => false });

  // eslint-disable-next-line no-console
  const mockCalls = (console.log as any as ConsoleLogMock).mock.calls;

  expect(stripAnsi(mockCalls[0][0])).toMatchSnapshot();

  expect(getByText('Change freshness!')).toBeTruthy();
});

test('renders options.wrapper around node', () => {
  type WrapperComponentProps = { children: React.ReactNode };
  const WrapperComponent = ({ children }: WrapperComponentProps) => (
    <View testID="wrapper">{children}</View>
  );

  const { toJSON, getByTestId } = render(<View testID="inner" />, {
    wrapper: WrapperComponent,
  });

  expect(getByTestId('wrapper')).toBeTruthy();
  expect(toJSON()).toMatchInlineSnapshot(`
    <View
      testID="wrapper"
    >
      <View
        testID="inner"
      />
    </View>
  `);
});

test('renders options.wrapper around updated node', () => {
  type WrapperComponentProps = { children: React.ReactNode };
  const WrapperComponent = ({ children }: WrapperComponentProps) => (
    <View testID="wrapper">{children}</View>
  );

  const { toJSON, getByTestId, rerender } = render(<View testID="inner" />, {
    wrapper: WrapperComponent,
  });

  rerender(
    <View testID="inner" accessibilityLabel="test" accessibilityHint="test" />
  );

  expect(getByTestId('wrapper')).toBeTruthy();
  expect(toJSON()).toMatchInlineSnapshot(`
    <View
      testID="wrapper"
    >
      <View
        accessibilityHint="test"
        accessibilityLabel="test"
        testID="inner"
      />
    </View>
  `);
});

test('returns container', () => {
  const { container } = render(<View testID="inner" />);

  expect(container).toBeDefined();
  // `View` composite component is returned. This behavior will break if we
  // start returning only host components.
  expect(container.type).toBe(View);
  expect(container.props.testID).toBe('inner');
});

test('returns wrapped component as container', () => {
  type WrapperComponentProps = { children: React.ReactNode };
  const WrapperComponent = ({ children }: WrapperComponentProps) => (
    <SafeAreaView testID="wrapper">{children}</SafeAreaView>
  );

  const { container } = render(<View testID="inner" />, {
    wrapper: WrapperComponent,
  });

  expect(container).toBeDefined();
  // `WrapperComponent` composite component is returned with no testID passed to
  // it. This behavior will break if we start returning only host components.
  expect(container.type).toBe(WrapperComponent);
  expect(container.props.testID).not.toBeDefined();
});

test('RenderAPI type', () => {
  render(<Banana />) as RenderAPI;
  expect(true).toBeTruthy();
});
