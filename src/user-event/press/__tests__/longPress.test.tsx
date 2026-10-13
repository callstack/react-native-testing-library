import React from 'react';
import { Pressable, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';

import { userEvent } from '../..';
import { render, screen } from '../../..';
import { isModernEventSystem } from '../../../test-utils/event-system';
import { createEventLogger, getEventsNames } from '../../../test-utils/events';

describe('userEvent.longPress with fake timers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(0);
  });

  test('works on Pressable without holding the touch (legacy: holds it for 500 ms)', async () => {
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

    await user.longPress(screen.getByTestId('pressable'));
    expect(getEventsNames(events)).toEqual(['pressIn', 'longPress', 'pressOut']);
    const touch = {
      identifier: 0,
      locationX: 0,
      locationY: 0,
      pageX: 0,
      pageY: 0,
      target: 0,
      timestamp: 0,
    };
    // Modern matches React Native, which passes the touch in the touch arrays.
    expect(events[0].payload.nativeEvent).toEqual({
      ...touch,
      changedTouches: isModernEventSystem() ? [touch] : [],
      touches: isModernEventSystem() ? [touch] : [],
    });
    // Legacy holds the touch for Pressability's long press delay (500 ms).
    expect(events.map((event) => event.payload.nativeEvent.timestamp)).toEqual([
      0,
      0,
      isModernEventSystem() ? 0 : 500,
    ]);
  });

  test('passes the responder grant event to onPressIn and onLongPress, the release event to onPressOut and onPress', async () => {
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

    await user.longPress(screen.getByTestId('pressable'));
    await user.press(screen.getByTestId('pressable'));
    const [pressIn, longPress, pressOut, , pressOut2, press] = events.map((e) => e.payload);
    expect(longPress).toBe(pressIn);
    expect(pressIn.dispatchConfig).toMatchObject({ registrationName: 'onResponderGrant' });
    expect(pressOut.dispatchConfig).toMatchObject({ registrationName: 'onResponderRelease' });
    expect(press).toBe(pressOut2);
  });

  test('passes events with the touch history of the touch, and onLongPress without currentTarget (legacy: stub events)', async () => {
    const { events, logEvent } = createEventLogger();
    const currentTargets: unknown[] = [];
    const user = userEvent.setup();

    await render(
      <Pressable
        testID="pressable"
        onPressIn={logEvent('pressIn')}
        onLongPress={(event) => {
          currentTargets.push(event.currentTarget);
        }}
        onPressOut={logEvent('pressOut')}
      />,
    );

    await user.longPress(screen.getByTestId('pressable'));
    if (!isModernEventSystem()) return;

    // Modern matches React Native, where Pressability calls `onLongPress` from a timer, after the
    // dispatch of the responder grant event.
    expect(currentTargets).toEqual([null]);
    const [pressIn, pressOut] = events.map((e) => e.payload);
    expect(pressOut.touchHistory).toBe(pressIn.touchHistory);
    expect(pressOut.touchHistory).toMatchObject({
      numberActiveTouches: 0,
      touchBank: [{ touchActive: false }],
    });
  });

  test('works on TouchableOpacity', async () => {
    const mockOnPress = jest.fn();

    await render(
      <TouchableOpacity onPress={mockOnPress}>
        <Text>press me</Text>
      </TouchableOpacity>,
    );

    await userEvent.longPress(screen.getByText('press me'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  test('works on TouchableHighlight', async () => {
    const mockOnPress = jest.fn();

    await render(
      <TouchableHighlight onPress={mockOnPress}>
        <Text>press me</Text>
      </TouchableHighlight>,
    );

    await userEvent.longPress(screen.getByText('press me'));
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

    await userEvent.longPress(screen.getByText('press me'));
    expect(getEventsNames(events)).toEqual(['pressIn', 'longPress', 'pressOut']);
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

    await user.longPress(screen.getByTestId('subject'));
    expect(getEventsNames(events)).toEqual(['pressIn', 'longPress', 'pressOut']);
  });

  test('calls onLongPress if the delayLongPress is the default one', async () => {
    const { logEvent, events } = createEventLogger();
    const user = userEvent.setup();

    await render(
      <Pressable onPress={logEvent('press')} onLongPress={logEvent('longPress')}>
        <Text>press me</Text>
      </Pressable>,
    );
    await user.longPress(screen.getByText('press me'));

    expect(getEventsNames(events)).toEqual(['longPress']);
  });

  test('calls onLongPress when duration is greater than specified delayLongPress', async () => {
    const mockOnLongPress = jest.fn();
    const mockOnPress = jest.fn();
    const user = userEvent.setup();

    await render(
      <Pressable delayLongPress={800} onLongPress={mockOnLongPress} onPress={mockOnPress}>
        <Text>press me</Text>
      </Pressable>,
    );

    await user.longPress(screen.getByText('press me'), {
      duration: 1000,
    });

    expect(mockOnLongPress).toHaveBeenCalled();
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test('calls onLongPress whatever the delayLongPress (legacy: does not call it when duration is lesser than delayLongPress)', async () => {
    const mockOnLongPress = jest.fn();
    const mockOnPress = jest.fn();
    const user = userEvent.setup();

    await render(
      <Pressable delayLongPress={1000} onLongPress={mockOnLongPress} onPress={mockOnPress}>
        <Text>press me</Text>
      </Pressable>,
    );
    await user.longPress(screen.getByText('press me'));

    // Modern `longPress()` doesn't wait for Pressability's long press timer.
    expect(mockOnLongPress).toHaveBeenCalledTimes(isModernEventSystem() ? 1 : 0);
    expect(mockOnPress).toHaveBeenCalledTimes(isModernEventSystem() ? 0 : 1);
  });

  test('does not calls onPress when onLongPress is called', async () => {
    const mockOnLongPress = jest.fn();
    const mockOnPress = jest.fn();
    const user = userEvent.setup();

    await render(
      <Pressable onLongPress={mockOnLongPress} onPress={mockOnPress}>
        <Text>press me</Text>
      </Pressable>,
    );
    await user.longPress(screen.getByText('press me'));

    expect(mockOnLongPress).toHaveBeenCalled();
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test('longPress is accessible directly in userEvent', async () => {
    const mockOnLongPress = jest.fn();

    await render(
      <Pressable onLongPress={mockOnLongPress}>
        <Text>press me</Text>
      </Pressable>,
    );

    await userEvent.longPress(screen.getByText('press me'));

    expect(mockOnLongPress).toHaveBeenCalled();
  });

  test('calls onLongPress after custom duration (legacy: calls onPress instead when shorter than delayLongPress)', async () => {
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

    await user.longPress(screen.getByTestId('pressable'), { duration: 50 });
    // Legacy runs Pressability, whose long press timer doesn't fire within 50 ms, and which delays
    // `onPressOut` for touches shorter than its `minPressDuration` (130 ms).
    expect(getEventsNames(events)).toEqual(
      isModernEventSystem()
        ? ['pressIn', 'longPress', 'pressOut']
        : ['pressIn', 'press', 'pressOut'],
    );
    expect(events.at(-1)?.payload.nativeEvent.timestamp).toBe(50);
  });
});
