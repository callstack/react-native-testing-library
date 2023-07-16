import React from 'react';
import { Pressable, Text } from 'react-native';
import { render, screen } from '../../../pure';
import { userEvent } from '../..';
import * as WarnAboutRealTimers from '../utils/warnAboutRealTimers';

describe('userEvent.longPress with real timers', () => {
  beforeEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    jest.spyOn(WarnAboutRealTimers, 'warnAboutRealTimers').mockImplementation();
  });

  test('calls onLongPress if the delayLongPress is the default one', async () => {
    const mockOnLongPress = jest.fn();
    const user = userEvent.setup();

    render(
      <Pressable onLongPress={mockOnLongPress}>
        <Text>press me</Text>
      </Pressable>
    );
    await user.longPress(screen.getByText('press me'));

    expect(mockOnLongPress).toHaveBeenCalled();
  });

  test('calls onLongPress when duration is greater than specified delayLongPress', async () => {
    const mockOnLongPress = jest.fn();
    const mockOnPress = jest.fn();
    const user = userEvent.setup();

    render(
      <Pressable
        delayLongPress={800}
        onLongPress={mockOnLongPress}
        onPress={mockOnPress}
      >
        <Text>press me</Text>
      </Pressable>
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

    render(
      <Pressable
        delayLongPress={1000}
        onLongPress={mockOnLongPress}
        onPress={mockOnPress}
      >
        <Text>press me</Text>
      </Pressable>
    );
    await user.longPress(screen.getByText('press me'));

    expect(mockOnLongPress).not.toHaveBeenCalled();
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test('does not calls onPress when onLongPress is called', async () => {
    const mockOnLongPress = jest.fn();
    const mockOnPress = jest.fn();
    const user = userEvent.setup();

    render(
      <Pressable onLongPress={mockOnLongPress} onPress={mockOnPress}>
        <Text>press me</Text>
      </Pressable>
    );
    await user.longPress(screen.getByText('press me'));

    expect(mockOnLongPress).toHaveBeenCalled();
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test('longPress is accessible directly in userEvent', async () => {
    const mockOnLongPress = jest.fn();

    render(
      <Pressable onLongPress={mockOnLongPress}>
        <Text>press me</Text>
      </Pressable>
    );

    await userEvent.longPress(screen.getByText('press me'));

    expect(mockOnLongPress).toHaveBeenCalled();
  });
});

test('warns about using real timers with userEvent', async () => {
  jest.restoreAllMocks();
  const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();

  render(<Pressable testID="pressable" />);

  await userEvent.longPress(screen.getByTestId('pressable'));

  expect(mockConsoleWarn.mock.calls[0][0]).toMatchInlineSnapshot(`
    "It is recommended to use userEvent with fake timers
    Some events involve duration so your tests may take a long time to run.
    For instance calling userEvent.longPress with real timers will take 500 ms."
  `);
});
