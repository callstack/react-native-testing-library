import * as React from 'react';
import { View, Text, TextInput, Pressable, SafeAreaView } from 'react-native';
import stripAnsi from 'strip-ansi';
import { render, fireEvent, RenderAPI } from '..';

const originalConsoleError = console.error;

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
});

test('debug changing component', () => {
  jest.spyOn(console, 'log').mockImplementation((x) => x);

  const { UNSAFE_getByProps, debug } = render(<Banana />);

  fireEvent.press(UNSAFE_getByProps({ type: 'primary' }));

  debug();

  // eslint-disable-next-line no-console
  const mockCalls = (console.log as any as ConsoleLogMock).mock.calls;

  expect(stripAnsi(mockCalls[4][0])).toMatchSnapshot(
    'bananaFresh button message should now be "fresh"'
  );
});

test('renders options.wrapper around node', () => {
  type WrapperComponentProps = { children: React.ReactNode };
  const WrapperComponent = ({ children }: WrapperComponentProps) => (
    <SafeAreaView testID="wrapper">{children}</SafeAreaView>
  );

  const { toJSON, getByTestId } = render(<View testID="inner" />, {
    wrapper: WrapperComponent,
  });

  expect(getByTestId('wrapper')).toBeTruthy();
  expect(toJSON()).toMatchInlineSnapshot(`
    <RCTSafeAreaView
      testID="wrapper"
    >
      <View
        testID="inner"
      />
    </RCTSafeAreaView>
  `);
});

test('renders options.wrapper around updated node', () => {
  type WrapperComponentProps = { children: React.ReactNode };
  const WrapperComponent = ({ children }: WrapperComponentProps) => (
    <SafeAreaView testID="wrapper">{children}</SafeAreaView>
  );

  const { toJSON, getByTestId, rerender } = render(<View testID="inner" />, {
    wrapper: WrapperComponent,
  });

  rerender(
    <View testID="inner" accessibilityLabel="test" accessibilityHint="test" />
  );

  expect(getByTestId('wrapper')).toBeTruthy();
  expect(toJSON()).toMatchInlineSnapshot(`
    <RCTSafeAreaView
      testID="wrapper"
    >
      <View
        accessibilityHint="test"
        accessibilityLabel="test"
        testID="inner"
      />
    </RCTSafeAreaView>
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

test('should throw when rendering a string outside a text component', () => {
  expect(() =>
    render(<View>hello</View>, {
      unstable_validateStringsRenderedWithinText: true,
    })
  ).toThrowErrorMatchingSnapshot();
});

const profilerErrorMessage =
  'The above error occurred in the <Profiler> component';

test('should throw an error when rerendering with text outside of Text component', () => {
  // eslint-disable-next-line no-console
  console.error = (errorMessage: string) => {
    if (!errorMessage.includes(profilerErrorMessage)) {
      originalConsoleError(errorMessage);
    }
  };
  const { rerender } = render(<View />, {
    unstable_validateStringsRenderedWithinText: true,
  });

  expect(() => rerender(<View>hello</View>)).toThrowErrorMatchingSnapshot();

  // eslint-disable-next-line no-console
  console.error = originalConsoleError;
});

const ErrorComponent = () => {
  const [shouldDisplayText, setShouldDisplayText] = React.useState(false);

  if (!shouldDisplayText) {
    return (
      <Pressable
        onPress={() => {
          setShouldDisplayText(true);
        }}
      >
        <Text>Display text</Text>
      </Pressable>
    );
  }

  return <View>text rendered outside text component</View>;
};

test('should throw an error when strings are rendered outside Text', () => {
  // eslint-disable-next-line no-console
  console.error = (errorMessage: string) => {
    if (!errorMessage.includes(profilerErrorMessage)) {
      originalConsoleError(errorMessage);
    }
  };
  const { getByText } = render(<ErrorComponent />, {
    unstable_validateStringsRenderedWithinText: true,
  });

  expect(() =>
    fireEvent.press(getByText('Display text'))
  ).toThrowErrorMatchingSnapshot();

  // eslint-disable-next-line no-console
  console.error = originalConsoleError;
});

test('it should not throw for texts nested in fragments', () => {
  expect(() =>
    render(
      <Text>
        <>hello</>
      </Text>,
      { unstable_validateStringsRenderedWithinText: true }
    )
  ).not.toThrow();
});

test('it should not throw if option validateRenderedString is false', () => {
  expect(() => render(<View>hello</View>)).not.toThrow();
});

test(`it should throw 
      - when one of the children is a text
      - and the parent is not a Text component`, () => {
  expect(() =>
    render(
      <View>
        <Text>hello</Text>
        hello
      </View>,
      { unstable_validateStringsRenderedWithinText: true }
    )
  ).toThrowErrorMatchingSnapshot();
});

test(`it should throw 
    - when a string is rendered within a fragment rendered outside a Text`, () => {
  expect(() =>
    render(
      <View>
        <>hello</>
      </View>,
      { unstable_validateStringsRenderedWithinText: true }
    )
  ).toThrowErrorMatchingSnapshot();
});

test('it should throw if a number is rendered outside a text', () => {
  expect(() =>
    render(<View>0</View>, { unstable_validateStringsRenderedWithinText: true })
  ).toThrowErrorMatchingSnapshot(`
    "Invariant Violation: Text strings must be rendered within a <Text> component.

    Detected attempt to render "0" string within a <View> component."
  `);
});

const Trans = ({ i18nKey }: { i18nKey: string }) => <>{i18nKey}</>;

test('it should throw with components returning string value not rendered in Text', () => {
  expect(() =>
    render(
      <View>
        <Trans i18nKey="hello" />
      </View>,
      { unstable_validateStringsRenderedWithinText: true }
    )
  ).toThrow();
});

test('it should not throw with components returning string value rendered in Text', () => {
  expect(() =>
    render(
      <Text>
        <Trans i18nKey="hello" />
      </Text>,
      { unstable_validateStringsRenderedWithinText: true }
    )
  ).not.toThrow();
});

test('it should throw when rendering string in a View in a Text', () => {
  expect(() =>
    render(
      <Text>
        <View>hello</View>
      </Text>,
      { unstable_validateStringsRenderedWithinText: true }
    )
  ).toThrowErrorMatchingSnapshot();
});
