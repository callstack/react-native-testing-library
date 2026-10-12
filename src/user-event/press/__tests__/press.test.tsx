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

import { userEvent } from '../..';
import { render, screen } from '../../..';
import { isModernEventSystem } from '../../../test-utils/event-system';
import { createEventLogger, getEventsNames } from '../../../test-utils/events';

describe('userEvent.press with fake timers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(0);
  });

  test('works on Pressable', async () => {
    const { events, logEvent } = createEventLogger();
    const user = userEvent.setup();

    await render(
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

    await render(
      <TouchableOpacity onPress={mockOnPress}>
        <Text>press me</Text>
      </TouchableOpacity>,
    );

    await userEvent.press(screen.getByText('press me'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  test('works on TouchableHighlight', async () => {
    const mockOnPress = jest.fn();

    await render(
      <TouchableHighlight onPress={mockOnPress}>
        <Text>press me</Text>
      </TouchableHighlight>,
    );

    await userEvent.press(screen.getByText('press me'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  test('works on Text', async () => {
    const { events, logEvent } = createEventLogger();

    await render(
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

    await render(
      <TextInput
        placeholder="email"
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
      />,
    );

    await userEvent.press(screen.getByPlaceholderText('email'));
    expect(getEventsNames(events)).toEqual(['pressIn', 'pressOut']);
  });

  test('works with testOnly_onPress handlers', async () => {
    const { events, logEvent } = createEventLogger();
    const user = userEvent.setup();
    const testOnlyPressProps = {
      testOnly_onPress: logEvent('press'),
      testOnly_onPressIn: logEvent('pressIn'),
      testOnly_onPressOut: logEvent('pressOut'),
      testOnly_onLongPress: logEvent('longPress'),
    };

    await render(<View testID="subject" {...testOnlyPressProps} />);

    await user.press(screen.getByTestId('subject'));
    expect(getEventsNames(events)).toEqual(['pressIn', 'pressOut', 'press']);
  });

  test('works on Button', async () => {
    const { events, logEvent } = createEventLogger();

    await render(<Button title="press me" onPress={logEvent('press')} />);

    await userEvent.press(screen.getByText('press me'));
    expect(getEventsNames(events)).toEqual(['press']);
  });

  test('does not trigger event when pressable is disabled', async () => {
    const { events, logEvent } = createEventLogger();
    const user = userEvent.setup();

    await render(
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

    await render(
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

    await render(
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

    await render(
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

    await render(
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

    await render(
      <Pressable onPress={mockOnPress}>
        <Text>press me</Text>
      </Pressable>,
    );
    await userEvent.press(screen.getByText('press me'));

    expect(mockOnPress).toHaveBeenCalled();
  });

  test('does not call onLongPress', async () => {
    const mockOnLongPress = jest.fn();

    await render(
      <Pressable onLongPress={mockOnLongPress}>
        <Text>press me</Text>
      </Pressable>,
    );
    await userEvent.press(screen.getByText('press me'));

    expect(mockOnLongPress).not.toHaveBeenCalled();
  });

  test('longPress works Text', async () => {
    const { events, logEvent } = createEventLogger();

    await render(
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

    await render(
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

  test.each([
    ['aria-disabled', { 'aria-disabled': true }],
    ['accessibilityState.disabled', { accessibilityState: { disabled: true } }],
  ])('does not trigger on Text disabled by %s (legacy: triggers)', async (_, disabledProps) => {
    const { events, logEvent } = createEventLogger();

    await render(
      <Text
        onPress={logEvent('press')}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
        onLongPress={logEvent('longPress')}
        {...disabledProps}
      >
        press me
      </Text>,
    );
    await userEvent.press(screen.getByText('press me'));

    // Modern matches React Native's `Text`, which falls back to these props when `disabled` is
    // not set. Legacy checks only `disabled`.
    expect(getEventsNames(events)).toEqual(
      isModernEventSystem() ? [] : ['pressIn', 'pressOut', 'press'],
    );
  });

  test('triggers on Text with disabled={false} over aria-disabled', async () => {
    const { events, logEvent } = createEventLogger();

    await render(
      <Text onPress={logEvent('press')} disabled={false} aria-disabled>
        press me
      </Text>,
    );
    await userEvent.press(screen.getByText('press me'));

    // React Native's `Text` reads `disabled` first.
    expect(getEventsNames(events)).toEqual(['press']);
  });

  test('does not trigger on Text with disabled pointer events', async () => {
    const { events, logEvent } = createEventLogger();

    await render(
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

  test('does not call onPress of the Pressable around TextInput (legacy: calls it for TextInput without onPress* props)', async () => {
    const { events, logEvent } = createEventLogger();

    await render(
      <Pressable onPress={logEvent('press')}>
        <TextInput placeholder="plain" />
        <TextInput placeholder="with pressIn" onPressIn={logEvent('inputPressIn')} />
      </Pressable>,
    );

    // Modern matches React Native: TextInput's Pressability always claims the touch, even without
    // `onPress*` props, so it never reaches the Pressable.
    await userEvent.press(screen.getByPlaceholderText('plain'));
    await userEvent.press(screen.getByPlaceholderText('with pressIn'));
    expect(getEventsNames(events)).toEqual(
      isModernEventSystem() ? ['inputPressIn'] : ['press', 'inputPressIn'],
    );
  });

  test('calls onPressIn of non editable TextInput, not onPress of the Pressable around it (legacy: the reverse)', async () => {
    const { events, logEvent } = createEventLogger();

    await render(
      <Pressable onPress={logEvent('press')}>
        <TextInput placeholder="email" editable={false} onPressIn={logEvent('inputPressIn')} />
      </Pressable>,
    );

    await userEvent.press(screen.getByPlaceholderText('email'));
    // Modern matches iOS: a non-editable TextInput claims the touch too, and calls its callbacks,
    // as `editable={false}` only stops it from focusing. Legacy skips it, as Android does.
    expect(getEventsNames(events)).toEqual(isModernEventSystem() ? ['inputPressIn'] : ['press']);
  });

  test('calls onPressIn and onPressOut on non editable TextInput (legacy: calls nothing)', async () => {
    const { events, logEvent } = createEventLogger();

    await render(
      <TextInput
        placeholder="email"
        editable={false}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
      />,
    );

    await userEvent.press(screen.getByPlaceholderText('email'));
    // Modern matches iOS, where `editable={false}` only stops TextInput from focusing.
    expect(getEventsNames(events)).toEqual(isModernEventSystem() ? ['pressIn', 'pressOut'] : []);
  });

  test('does not call onPressIn and onPressOut on TextInput with pointer events disabled', async () => {
    const { events, logEvent } = createEventLogger();

    await render(
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

    await render(
      <Pressable onPress={mockOnPress}>
        <Text>press me</Text>
      </Pressable>,
    );

    await userEvent.press(screen.getByText('press me'));

    expect(mockOnPress).toHaveBeenCalled();
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

    await render(<TestComponent />);
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
  await render(<Component />);
  await userEvent.press(screen.getByText('Unmount'));
  expect(screen.queryByText('Unmount')).not.toBeOnTheScreen();
});
