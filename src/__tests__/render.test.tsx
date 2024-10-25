/* eslint-disable no-console */
import * as React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { configure, getConfig, resetToDefaults } from '../config';
import { fireEvent, render, RenderAPI, screen } from '..';

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
        <Text testID="bananaFresh">{this.state.fresh ? 'fresh' : 'not fresh'}</Text>
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
  render(<Banana />);
  const [text, status, button] = screen.UNSAFE_getAllByType(Text);
  const InExistent = () => null;

  expect(text.props.children).toBe('Is the banana fresh?');
  expect(status.props.children).toBe('not fresh');
  expect(button.props.children).toBe('Change freshness!');
  expect(() => screen.UNSAFE_getAllByType(InExistent)).toThrow('No instances found');

  expect(screen.UNSAFE_queryAllByType(Text)[1]).toBe(status);
  expect(screen.UNSAFE_queryAllByType(InExistent)).toHaveLength(0);
});

test('UNSAFE_getByProps, UNSAFE_queryByProps', () => {
  render(<Banana />);
  const primaryType = screen.UNSAFE_getByProps({ type: 'primary' });

  expect(primaryType.props.children).toBe('Change freshness!');
  expect(() => screen.UNSAFE_getByProps({ type: 'inexistent' })).toThrow('No instances found');

  expect(screen.UNSAFE_queryByProps({ type: 'primary' })).toBe(primaryType);
  expect(screen.UNSAFE_queryByProps({ type: 'inexistent' })).toBeNull();
});

test('UNSAFE_getAllByProp, UNSAFE_queryAllByProps', () => {
  render(<Banana />);
  const primaryTypes = screen.UNSAFE_getAllByProps({ type: 'primary' });

  expect(primaryTypes).toHaveLength(1);
  expect(() => screen.UNSAFE_getAllByProps({ type: 'inexistent' })).toThrow('No instances found');

  expect(screen.UNSAFE_queryAllByProps({ type: 'primary' })).toEqual(primaryTypes);
  expect(screen.UNSAFE_queryAllByProps({ type: 'inexistent' })).toHaveLength(0);
});

test('update', () => {
  const fn = jest.fn();
  render(<Banana onUpdate={fn} />);

  fireEvent.press(screen.getByText('Change freshness!'));

  screen.update(<Banana onUpdate={fn} />);
  screen.rerender(<Banana onUpdate={fn} />);

  expect(fn).toHaveBeenCalledTimes(3);
});

test('unmount', () => {
  const fn = jest.fn();
  render(<Banana onUnmount={fn} />);
  screen.unmount();
  expect(fn).toHaveBeenCalled();
});

test('unmount should handle cleanup functions', () => {
  const cleanup = jest.fn();
  const Component = () => {
    React.useEffect(() => cleanup);
    return null;
  };

  render(<Component />);

  screen.unmount();

  expect(cleanup).toHaveBeenCalledTimes(1);
});

test('toJSON renders host output', () => {
  render(<MyButton>press me</MyButton>);
  expect(screen.toJSON()).toMatchSnapshot();
});

test('renders options.wrapper around node', () => {
  type WrapperComponentProps = { children: React.ReactNode };
  const WrapperComponent = ({ children }: WrapperComponentProps) => (
    <View testID="wrapper">{children}</View>
  );

  render(<View testID="inner" />, {
    wrapper: WrapperComponent,
  });

  expect(screen.getByTestId('wrapper')).toBeTruthy();
  expect(screen.toJSON()).toMatchInlineSnapshot(`
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

  render(<View testID="inner" />, {
    wrapper: WrapperComponent,
  });

  screen.rerender(<View testID="inner" accessibilityLabel="test" accessibilityHint="test" />);

  expect(screen.getByTestId('wrapper')).toBeTruthy();
  expect(screen.toJSON()).toMatchInlineSnapshot(`
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

test('returns host root', () => {
  render(<View testID="inner" />);

  expect(screen.root).toBeDefined();
  expect(screen.root.type).toBe('View');
  expect(screen.root.props.testID).toBe('inner');
});

test('returns composite UNSAFE_root', () => {
  render(<View testID="inner" />);

  expect(screen.UNSAFE_root).toBeDefined();
  expect(screen.UNSAFE_root.type).toBe(View);
  expect(screen.UNSAFE_root.props.testID).toBe('inner');
});

test('container displays deprecation', () => {
  render(<View testID="inner" />);

  expect(() => (screen as any).container).toThrowErrorMatchingInlineSnapshot(`
    "'container' property has been renamed to 'UNSAFE_root'.

    Consider using 'root' property which returns root host element."
  `);
});

test('RenderAPI type', () => {
  render(<Banana />) as RenderAPI;
  expect(true).toBeTruthy();
});

test('returned output can be spread using rest operator', () => {
  // Next line should not throw
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { rerender, ...rest } = render(<View testID="test" />);
  expect(rest).toBeTruthy();
});

test('render calls detects host component names', () => {
  resetToDefaults();
  expect(getConfig().hostComponentNames).toBeUndefined();

  render(<View testID="test" />);
  expect(getConfig().hostComponentNames).not.toBeUndefined();
});

test('supports legacy rendering', () => {
  render(<View testID="test" />, { concurrentRoot: false });
  expect(screen.root).toBeDefined();
});

// Enable concurrent rendering globally
configure({ concurrentRoot: true });

test('globally enable concurrent rendering', () => {
  render(<View testID="test" />);
  expect(screen.root).toBeOnTheScreen();
});

// Enable concurrent rendering locally
test('locally enable concurrent rendering', () => {
  render(<View testID="test" />, { concurrentRoot: true });
  expect(screen.root).toBeOnTheScreen();
});
