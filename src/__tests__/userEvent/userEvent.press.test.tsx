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

jest.useFakeTimers();

describe('userEvent.press', () => {
  test('calls onPressIn, onPress and onPressOut prop of touchable', () => {
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
    userEvent.press(screen.getByTestId('pressable'));

    expect(mockOnPress).toHaveBeenCalled();
    expect(mockOnPressIn).toHaveBeenCalled();
    expect(mockOnPressOut).toHaveBeenCalled();
  });

  test('does not call press when pressable is disabled', () => {
    const mockOnPress = jest.fn();

    render(<Pressable disabled onPress={mockOnPress} testID="pressable" />);
    userEvent.press(screen.getByTestId('pressable'));

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test('does not call press when pointer events is none', () => {
    const mockOnPress = jest.fn();

    render(
      <Pressable
        pointerEvents="none"
        onPress={mockOnPress}
        testID="pressable"
      />
    );
    userEvent.press(screen.getByTestId('pressable'));

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test('does not call press when pointer events is box-none', () => {
    const mockOnPress = jest.fn();

    render(
      <Pressable
        pointerEvents="box-none"
        onPress={mockOnPress}
        testID="pressable"
      />
    );
    userEvent.press(screen.getByTestId('pressable'));

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test('does not call press when parent has pointer events box-only', () => {
    const mockOnPress = jest.fn();

    render(
      <View pointerEvents="box-only">
        <Pressable onPress={mockOnPress} testID="pressable" />
      </View>
    );
    userEvent.press(screen.getByTestId('pressable'));

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test('calls press when pressable has pointer events box-only', () => {
    const mockOnPress = jest.fn();

    render(
      <Pressable
        onPress={mockOnPress}
        pointerEvents="box-only"
        testID="pressable"
      />
    );

    userEvent.press(screen.getByTestId('pressable'));

    expect(mockOnPress).toHaveBeenCalled();
  });

  test('crawls up in the tree to find an element that responds to touch events', () => {
    const mockOnPress = jest.fn();

    render(
      <Pressable onPress={mockOnPress}>
        <Text>press me</Text>
      </Pressable>
    );
    userEvent.press(screen.getByText('press me'));

    expect(mockOnPress).toHaveBeenCalled();
  });

  test('does not call onLongPress for pressDuration of 0', () => {
    const mockOnLongPress = jest.fn();

    render(
      <Pressable onLongPress={mockOnLongPress}>
        <Text>press me</Text>
      </Pressable>
    );
    userEvent.press(screen.getByText('press me'));

    expect(mockOnLongPress).not.toHaveBeenCalled();
  });

  test('calls onLongPress for a duration greater than default onLongPressDelay', () => {
    const mockOnLongPress = jest.fn();

    render(
      <Pressable onLongPress={mockOnLongPress}>
        <Text>press me</Text>
      </Pressable>
    );
    userEvent.press(screen.getByText('press me'), { pressDuration: 500 });

    expect(mockOnLongPress).toHaveBeenCalled();
  });

  test('calls onLongPress when duration is greater than specified onLongPressDelay', () => {
    const mockOnLongPress = jest.fn();
    const mockOnPress = jest.fn();

    render(
      <Pressable
        delayLongPress={1000}
        onLongPress={mockOnLongPress}
        onPress={mockOnPress}
      >
        <Text>press me</Text>
      </Pressable>
    );
    userEvent.press(screen.getByText('press me'), { pressDuration: 500 });

    expect(mockOnLongPress).not.toHaveBeenCalled();
    expect(mockOnPress).toHaveBeenCalledTimes(1);

    userEvent.press(screen.getByText('press me'), { pressDuration: 1000 });

    expect(mockOnLongPress).toHaveBeenCalled();
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test('does not calls onPress when onLongPress is called', () => {
    const mockOnLongPress = jest.fn();
    const mockOnPress = jest.fn();

    render(
      <Pressable onLongPress={mockOnLongPress} onPress={mockOnPress}>
        <Text>press me</Text>
      </Pressable>
    );
    userEvent.press(screen.getByText('press me'), { pressDuration: 500 });

    expect(mockOnLongPress).toHaveBeenCalled();
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test('works on TouchableOpacity', () => {
    const mockOnPress = jest.fn();

    render(
      <TouchableOpacity onPress={mockOnPress}>
        <Text>press me</Text>
      </TouchableOpacity>
    );
    userEvent.press(screen.getByText('press me'));

    expect(mockOnPress).toHaveBeenCalled();
  });

  test('works on TouchableHighlight', () => {
    const mockOnPress = jest.fn();

    render(
      <TouchableHighlight onPress={mockOnPress}>
        <Text>press me</Text>
      </TouchableHighlight>
    );
    userEvent.press(screen.getByText('press me'));

    expect(mockOnPress).toHaveBeenCalled();
  });

  test('works on Text', () => {
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
    userEvent.press(screen.getByText('press me'));

    expect(mockOnPress).toHaveBeenCalled();
    expect(mockOnPressIn).toHaveBeenCalled();
    expect(mockOnPressOut).toHaveBeenCalled();
  });

  test('doesnt trigger on disabled Text', () => {
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
    userEvent.press(screen.getByText('press me'));

    expect(mockOnPress).not.toHaveBeenCalled();
    expect(mockOnPressIn).not.toHaveBeenCalled();
    expect(mockOnPressOut).not.toHaveBeenCalled();
  });

  test('works on TetInput', () => {
    const mockOnPressIn = jest.fn();
    const mockOnPressOut = jest.fn();

    render(
      <TextInput
        placeholder="email"
        onPressIn={mockOnPressIn}
        onPressOut={mockOnPressOut}
      />
    );
    userEvent.press(screen.getByPlaceholderText('email'));

    expect(mockOnPressIn).toHaveBeenCalled();
    expect(mockOnPressOut).toHaveBeenCalled();
  });

  test('does not call onPressIn and onPressOut on non editable TetInput', () => {
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
    userEvent.press(screen.getByPlaceholderText('email'));

    expect(mockOnPressIn).not.toHaveBeenCalled();
    expect(mockOnPressOut).not.toHaveBeenCalled();
  });
});
