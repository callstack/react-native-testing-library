/* eslint-disable no-console */
import * as React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { getConfig, resetToDefaults } from '../config';
import { render, screen, fireEvent, RenderAPI } from '..';

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

test('toJSON renders host output', () => {
  const { toJSON } = render(<MyButton>press me</MyButton>);
  expect(toJSON()).toMatchSnapshot();
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

test('returns host root', () => {
  const { root } = render(<View testID="inner" />);

  expect(root).toBeDefined();
  expect(root.type).toBe('View');
  expect(root.props.testID).toBe('inner');
});

test('returns composite UNSAFE_root', () => {
  const { UNSAFE_root } = render(<View testID="inner" />);

  expect(UNSAFE_root).toBeDefined();
  expect(UNSAFE_root.type).toBe(View);
  expect(UNSAFE_root.props.testID).toBe('inner');
});

test('container displays deprecation', () => {
  const view = render(<View testID="inner" />);

  expect(() => (view as any).container).toThrowErrorMatchingInlineSnapshot(`
    "'container' property has been renamed to 'UNSAFE_root'.

    Consider using 'root' property which returns root host element."
  `);
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
