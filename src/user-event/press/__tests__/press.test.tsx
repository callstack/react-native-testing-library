import * as React from 'react';
import {
  Button,
  Pressable,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import type { HostElement } from 'universal-test-renderer';

import { render, screen } from '../../..';
import { createEventLogger, getEventsNames } from '../../../test-utils/events';
import { userEvent } from '../..';

describe('userEvent.press with fake timers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(0);
  });

  test('works on Pressable', async () => {
    const { events, logEvent } = createEventLogger();
    const user = userEvent.setup();

    render(
      <Pressable
        onPress={logEvent('press')}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
        onLongPress={logEvent('longPress')}
        testID="pressable"
      />,
    );

    await user.press(screen.getByTestId('pressable'));
    expect(getEventsNames(events)).toEqual(['pressIn', 'pressOut', 'press']);
    expect(events).toMatchSnapshot();
  });

  test('works on TouchableOpacity', async () => {
    const mockOnPress = jest.fn();

    render(
      <TouchableOpacity onPress={mockOnPress}>
        <Text>press me</Text>
      </TouchableOpacity>,
    );

    await userEvent.press(screen.getByText('press me'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  test('works on TouchableHighlight', async () => {
    const mockOnPress = jest.fn();

    render(
      <TouchableHighlight onPress={mockOnPress}>
        <Text>press me</Text>
      </TouchableHighlight>,
    );

    await userEvent.press(screen.getByText('press me'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  test('works on Text', async () => {
    const { events, logEvent } = createEventLogger();

    render(
      <Text
        onPress={logEvent('press')}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
        onLongPress={logEvent('longPress')}
      >
        press me
      </Text>,
    );

    await userEvent.press(screen.getByText('press me'));
    expect(getEventsNames(events)).toEqual(['pressIn', 'pressOut', 'press']);
  });

  test('works on TextInput', async () => {
    const { events, logEvent } = createEventLogger();

    render(
      <TextInput
        placeholder="email"
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
      />,
    );

    await userEvent.press(screen.getByPlaceholderText('email'));
    expect(getEventsNames(events)).toEqual(['pressIn', 'pressOut']);
  });

  test('works on Button', async () => {
    const { events, logEvent } = createEventLogger();

    render(<Button title="press me" onPress={logEvent('press')} />);

    await userEvent.press(screen.getByText('press me'));
    expect(getEventsNames(events)).toEqual(['press']);
  });

  test('does not trigger event when pressable is disabled', async () => {
    const { events, logEvent } = createEventLogger();
    const user = userEvent.setup();

    render(
      <Pressable
        disabled
        onPress={logEvent('press')}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
        onLongPress={logEvent('longPress')}
        testID="pressable"
      />,
    );
    await user.press(screen.getByTestId('pressable'));

    expect(events).toEqual([]);
  });

  test('does not call press when pointer events is none', async () => {
    const { events, logEvent } = createEventLogger();
    const user = userEvent.setup();

    render(
      <Pressable
        onPress={logEvent('press')}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
        onLongPress={logEvent('longPress')}
        testID="pressable"
        pointerEvents="none"
      />,
    );
    await user.press(screen.getByTestId('pressable'));

    expect(events).toEqual([]);
  });

  test('does not call press when pointer events is box-none', async () => {
    const { events, logEvent } = createEventLogger();
    const user = userEvent.setup();

    render(
      <Pressable
        onPress={logEvent('press')}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
        onLongPress={logEvent('longPress')}
        testID="pressable"
        pointerEvents="box-none"
      />,
    );
    await user.press(screen.getByTestId('pressable'));

    expect(events).toEqual([]);
  });

  test('does not call press when parent has pointer events box-only', async () => {
    const { events, logEvent } = createEventLogger();
    const user = userEvent.setup();

    render(
      <View pointerEvents="box-only">
        <Pressable
          onPress={logEvent('press')}
          onPressIn={logEvent('pressIn')}
          onPressOut={logEvent('pressOut')}
          onLongPress={logEvent('longPress')}
          testID="pressable"
        />
      </View>,
    );
    await user.press(screen.getByTestId('pressable'));

    expect(events).toEqual([]);
  });

  test('calls press when pressable has pointer events box-only', async () => {
    const { events, logEvent } = createEventLogger();
    const user = userEvent.setup();

    render(
      <Pressable
        onPress={logEvent('press')}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
        onLongPress={logEvent('longPress')}
        testID="pressable"
        pointerEvents="box-only"
      />,
    );
    await user.press(screen.getByTestId('pressable'));

    expect(getEventsNames(events)).toEqual(['pressIn', 'pressOut', 'press']);
  });

  test('crawls up in the tree to find an element that responds to touch events', async () => {
    const mockOnPress = jest.fn();

    render(
      <Pressable onPress={mockOnPress}>
        <Text>press me</Text>
      </Pressable>,
    );
    await userEvent.press(screen.getByText('press me'));

    expect(mockOnPress).toHaveBeenCalled();
  });

  test('does not call onLongPress', async () => {
    const mockOnLongPress = jest.fn();

    render(
      <Pressable onLongPress={mockOnLongPress}>
        <Text>press me</Text>
      </Pressable>,
    );
    await userEvent.press(screen.getByText('press me'));

    expect(mockOnLongPress).not.toHaveBeenCalled();
  });

  test('longPress works Text', async () => {
    const { events, logEvent } = createEventLogger();

    render(
      <Text
        onPress={logEvent('press')}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
        onLongPress={logEvent('longPress')}
      >
        press me
      </Text>,
    );

    await userEvent.longPress(screen.getByText('press me'));
    expect(getEventsNames(events)).toEqual(['pressIn', 'longPress', 'pressOut']);
  });

  test('does not trigger on disabled Text', async () => {
    const { events, logEvent } = createEventLogger();

    render(
      <Text
        onPress={logEvent('press')}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
        onLongPress={logEvent('longPress')}
        disabled
      >
        press me
      </Text>,
    );
    await userEvent.press(screen.getByText('press me'));

    expect(events).toEqual([]);
  });

  test('does not trigger on Text with disabled pointer events', async () => {
    const { events, logEvent } = createEventLogger();

    render(
      <View pointerEvents="box-only">
        <Text
          onPress={logEvent('press')}
          onPressIn={logEvent('pressIn')}
          onPressOut={logEvent('pressOut')}
          onLongPress={logEvent('longPress')}
        >
          press me
        </Text>
      </View>,
    );
    await userEvent.press(screen.getByText('press me'));

    expect(events).toEqual([]);
  });

  test('does not call onPressIn and onPressOut on non editable TextInput', async () => {
    const { events, logEvent } = createEventLogger();

    render(
      <TextInput
        placeholder="email"
        editable={false}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
      />,
    );

    await userEvent.press(screen.getByPlaceholderText('email'));
    expect(events).toEqual([]);
  });

  test('does not call onPressIn and onPressOut on TextInput with pointer events disabled', async () => {
    const { events, logEvent } = createEventLogger();

    render(
      <TextInput
        placeholder="email"
        pointerEvents="box-none"
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
      />,
    );

    await userEvent.press(screen.getByPlaceholderText('email'));
    expect(events).toEqual([]);
  });

  test('press is accessible directly in userEvent', async () => {
    const mockOnPress = jest.fn();

    render(
      <Pressable onPress={mockOnPress}>
        <Text>press me</Text>
      </Pressable>,
    );

    await userEvent.press(screen.getByText('press me'));

    expect(mockOnPress).toHaveBeenCalled();
  });

  it('press throws on composite components', async () => {
    render(<View testID="view" />);
    const user = userEvent.setup();

    const compositeView = screen.getByTestId('view').parent as HostElement;
    await expect(user.press(compositeView)).rejects.toThrowErrorMatchingInlineSnapshot(`
      "press() works only with host elements. Passed element has type "function Component() {
            (0, _classCallCheck2.default)(this, Component);
            return _callSuper(this, Component, arguments);
          }"."
    `);
  });

  test('disables act environmennt', async () => {
    // In this test there is state update during await when typing
    // Since wait is not wrapped by act there would be a warning
    // if act environment was not disabled.
    const consoleErrorSpy = jest.spyOn(console, 'error');
    jest.useFakeTimers();

    const TestComponent = () => {
      const [showText, setShowText] = React.useState(false);

      React.useEffect(() => {
        setTimeout(() => setShowText(true), 100);
      }, []);

      return (
        <>
          <Pressable testID="pressable" />
          {showText && <Text />}
        </>
      );
    };

    render(<TestComponent />);
    await userEvent.press(screen.getByTestId('pressable'));

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});

function Component() {
  const [mounted, setMounted] = React.useState(true);

  const onPressIn = () => {
    setMounted(false);
  };

  return (
    <View>
      {mounted && (
        <Pressable onPressIn={onPressIn}>
          <Text>Unmount</Text>
        </Pressable>
      )}
    </View>
  );
}

test('unmounts component', async () => {
  render(<Component />);
  await userEvent.press(screen.getByText('Unmount'));
  expect(screen.queryByText('Unmount')).not.toBeOnTheScreen();
});
