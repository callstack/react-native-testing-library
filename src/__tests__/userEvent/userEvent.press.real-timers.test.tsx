import React from 'react';
import {
  Pressable,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { render, screen, userEvent } from '../../pure';
import * as WarnAboutRealTimers from '../../userEvent/utils/warnAboutRealTimers';

const mockWarnAboutRealTimers = jest
  .spyOn(WarnAboutRealTimers, 'warnAboutRealTimers')
  .mockImplementation();

describe('userEvent.press using real timers', () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  test('calls onPressIn, onPress and onPressOut prop of touchable', async () => {
    const mockOnPress = jest.fn();
    const mockOnPressIn = jest.fn();
    const mockOnPressOut = jest.fn();

    render(
      <Pressable
        onPress={mockOnPress}
        onPressIn={mockOnPressIn}
        onPressOut={mockOnPressOut}
        testID="pressable"
      />
    );
    await userEvent.press(screen.getByTestId('pressable'));

    expect(mockOnPress).toHaveBeenCalled();
    expect(mockOnPressIn).toHaveBeenCalled();
    expect(mockOnPressOut).toHaveBeenCalled();
  });

  test('does not call press when pressable is disabled', async () => {
    const mockOnPress = jest.fn();

    render(<Pressable disabled onPress={mockOnPress} testID="pressable" />);
    await userEvent.press(screen.getByTestId('pressable'));

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test('does not call press when pointer events is none', async () => {
    const mockOnPress = jest.fn();

    render(
      <Pressable
        pointerEvents="none"
        onPress={mockOnPress}
        testID="pressable"
      />
    );
    await userEvent.press(screen.getByTestId('pressable'));

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test('does not call press when pointer events is box-none', async () => {
    const mockOnPress = jest.fn();

    render(
      <Pressable
        pointerEvents="box-none"
        onPress={mockOnPress}
        testID="pressable"
      />
    );
    await userEvent.press(screen.getByTestId('pressable'));

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test('does not call press when parent has pointer events box-only', async () => {
    const mockOnPress = jest.fn();

    render(
      <View pointerEvents="box-only">
        <Pressable onPress={mockOnPress} testID="pressable" />
      </View>
    );
    await userEvent.press(screen.getByTestId('pressable'));

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test('calls press when pressable has pointer events box-only', async () => {
    const mockOnPress = jest.fn();

    render(
      <Pressable
        onPress={mockOnPress}
        pointerEvents="box-only"
        testID="pressable"
      />
    );

    await userEvent.press(screen.getByTestId('pressable'));

    expect(mockOnPress).toHaveBeenCalled();
  });

  test('crawls up in the tree to find an element that responds to touch events', async () => {
    const mockOnPress = jest.fn();

    render(
      <Pressable onPress={mockOnPress}>
        <Text>press me</Text>
      </Pressable>
    );
    await userEvent.press(screen.getByText('press me'));

    expect(mockOnPress).toHaveBeenCalled();
  });

  test('does not call onLongPress for pressDuration of 0', async () => {
    const mockOnLongPress = jest.fn();

    render(
      <Pressable onLongPress={mockOnLongPress}>
        <Text>press me</Text>
      </Pressable>
    );
    await userEvent.press(screen.getByText('press me'));

    expect(mockOnLongPress).not.toHaveBeenCalled();
  });

  test('works on TouchableOpacity', async () => {
    const mockOnPress = jest.fn();

    render(
      <TouchableOpacity onPress={mockOnPress}>
        <Text>press me</Text>
      </TouchableOpacity>
    );
    await userEvent.press(screen.getByText('press me'));

    expect(mockOnPress).toHaveBeenCalled();
  });

  test('works on TouchableHighlight', async () => {
    const mockOnPress = jest.fn();

    render(
      <TouchableHighlight onPress={mockOnPress}>
        <Text>press me</Text>
      </TouchableHighlight>
    );
    await userEvent.press(screen.getByText('press me'));

    expect(mockOnPress).toHaveBeenCalled();
  });

  test('works on Text', async () => {
    const mockOnPress = jest.fn();
    const mockOnPressIn = jest.fn();
    const mockOnPressOut = jest.fn();

    render(
      <Text
        onPress={mockOnPress}
        onPressIn={mockOnPressIn}
        onPressOut={mockOnPressOut}
      >
        press me
      </Text>
    );
    await userEvent.press(screen.getByText('press me'));

    expect(mockOnPress).toHaveBeenCalled();
    expect(mockOnPressIn).toHaveBeenCalled();
    expect(mockOnPressOut).toHaveBeenCalled();
  });

  test('doesnt trigger on disabled Text', async () => {
    const mockOnPress = jest.fn();
    const mockOnPressIn = jest.fn();
    const mockOnPressOut = jest.fn();

    render(
      <Text
        onPress={mockOnPress}
        onPressIn={mockOnPressIn}
        onPressOut={mockOnPressOut}
        disabled
      >
        press me
      </Text>
    );
    await userEvent.press(screen.getByText('press me'));

    expect(mockOnPress).not.toHaveBeenCalled();
    expect(mockOnPressIn).not.toHaveBeenCalled();
    expect(mockOnPressOut).not.toHaveBeenCalled();
  });

  test('works on TetInput', async () => {
    const mockOnPressIn = jest.fn();
    const mockOnPressOut = jest.fn();

    render(
      <TextInput
        placeholder="email"
        onPressIn={mockOnPressIn}
        onPressOut={mockOnPressOut}
      />
    );
    await userEvent.press(screen.getByPlaceholderText('email'));

    expect(mockOnPressIn).toHaveBeenCalled();
    expect(mockOnPressOut).toHaveBeenCalled();
  });

  test('does not call onPressIn and onPressOut on non editable TetInput', async () => {
    const mockOnPressIn = jest.fn();
    const mockOnPressOut = jest.fn();

    render(
      <TextInput
        placeholder="email"
        editable={false}
        onPressIn={mockOnPressIn}
        onPressOut={mockOnPressOut}
      />
    );
    await userEvent.press(screen.getByPlaceholderText('email'));

    expect(mockOnPressIn).not.toHaveBeenCalled();
    expect(mockOnPressOut).not.toHaveBeenCalled();
  });

  test('warns about using real timers with userEvent', async () => {
    render(<Pressable testID="pressable" />);

    await userEvent.press(screen.getByTestId('pressable'));

    expect(mockWarnAboutRealTimers).toHaveBeenCalledTimes(1);
  });
});
