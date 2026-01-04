import * as React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { deprecated_fireEventSync, deprecated_renderSync, screen } from '../..';

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

test('supports basic rendering', () => {
  deprecated_renderSync(<View testID="test" />);
  expect(screen.root).toBeOnTheScreen();
});

test('rerender', () => {
  const fn = jest.fn();
  const { rerender } = deprecated_renderSync(<Banana onUpdate={fn} />);
  expect(fn).toHaveBeenCalledTimes(0);

  deprecated_fireEventSync.press(screen.getByText('Change freshness!'));
  expect(fn).toHaveBeenCalledTimes(1);

  rerender(<Banana onUpdate={fn} />);
  expect(fn).toHaveBeenCalledTimes(2);
});

test('unmount', () => {
  const fn = jest.fn();
  const { unmount } = deprecated_renderSync(<Banana onUnmount={fn} />);
  unmount();
  expect(fn).toHaveBeenCalled();
});

test('unmount should handle cleanup functions', () => {
  const cleanup = jest.fn();
  const Component = () => {
    React.useEffect(() => cleanup);
    return null;
  };

  const { unmount } = deprecated_renderSync(<Component />);

  unmount();

  expect(cleanup).toHaveBeenCalledTimes(1);
});

test('toJSON renders host output', () => {
  deprecated_renderSync(<MyButton>press me</MyButton>);
  expect(screen).toMatchSnapshot();
});

test('renders options.wrapper around node', () => {
  type WrapperComponentProps = { children: React.ReactNode };
  const WrapperComponent = ({ children }: WrapperComponentProps) => (
    <View testID="wrapper">{children}</View>
  );

  deprecated_renderSync(<View testID="inner" />, {
    wrapper: WrapperComponent,
  });

  expect(screen.getByTestId('wrapper')).toBeTruthy();
  expect(screen).toMatchInlineSnapshot(`
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

  deprecated_renderSync(<View testID="inner" />, {
    wrapper: WrapperComponent,
  });

  void screen.rerender(<View testID="inner" accessibilityLabel="test" accessibilityHint="test" />);

  expect(screen.getByTestId('wrapper')).toBeTruthy();
  expect(screen).toMatchInlineSnapshot(`
    <View
      testID="wrapper"
    >
      <View
        testID="inner"
      />
    </View>
  `);
});

test('returns host root', () => {
  deprecated_renderSync(<View testID="inner" />);

  expect(screen.root).toBeDefined();
  expect(screen.root?.type).toBe('View');
  expect(screen.root?.props.testID).toBe('inner');
});

test('RenderAPI type', () => {
  // This test verifies that deprecated_renderSync returns a compatible type
  // Note: deprecated_renderSync has different method signatures (sync vs async)
  const result = deprecated_renderSync(<Banana />);
  expect(result).toBeTruthy();
});

test('returned output can be spread using rest operator', () => {
  // Next line should not throw
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { rerender, ...rest } = deprecated_renderSync(<View testID="test" />);
  expect(rest).toBeTruthy();
});
