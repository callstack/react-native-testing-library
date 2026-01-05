import React from 'react';
import { Pressable, Text, TouchableHighlight, TouchableOpacity } from 'react-native';

import { render, screen } from '../../..';
import { createEventLogger, getEventsNames } from '../../../test-utils/events';
import { userEvent } from '../..';

describe('userEvent.longPress with fake timers', () => {
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

    await user.longPress(screen.getByTestId('pressable'));
    expect(getEventsNames(events)).toEqual(['pressIn', 'longPress', 'pressOut']);
    expect(events).toMatchSnapshot();
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

  test('calls onLongPress if the delayLongPress is the default one', async () => {
    const { logEvent, events } = createEventLogger();
    const user = userEvent.setup();

    await render(
      <Pressable onPress={logEvent('press')} onLongPress={logEvent('longPress')}>
        <Text>press me</Text>
      </Pressable>,
    );
    await user.longPress(screen.getByText('press me'));

    expect(events).toMatchSnapshot();
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

  test('does not calls onLongPress when duration is lesser than specified delayLongPress', async () => {
    const mockOnLongPress = jest.fn();
    const mockOnPress = jest.fn();
    const user = userEvent.setup();

    await render(
      <Pressable delayLongPress={1000} onLongPress={mockOnLongPress} onPress={mockOnPress}>
        <Text>press me</Text>
      </Pressable>,
    );
    await user.longPress(screen.getByText('press me'));

    expect(mockOnLongPress).not.toHaveBeenCalled();
    expect(mockOnPress).toHaveBeenCalledTimes(1);
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

  test('longPress accepts custom duration', async () => {
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
    expect(getEventsNames(events)).toEqual(['pressIn', 'press', 'pressOut']);
  });
});
