import React from 'react';
import { Pressable } from 'react-native';
import { render, screen, userEvent } from '../pure';

jest.useFakeTimers();

describe('userEvent.press', () => {
  test('calls onPress prop of touchable', () => {
    const mockOnPress = jest.fn();

    render(<Pressable onPress={mockOnPress} testID="pressable" />);
    userEvent.press(screen.getByTestId('pressable'));

    expect(mockOnPress).toHaveBeenCalled();
  });

  test('does not call press when pressable is disabled', () => {
    const mockOnPress = jest.fn();

    render(<Pressable disabled onPress={mockOnPress} testID="pressable" />);
    userEvent.press(screen.getByTestId('pressable'));

    expect(mockOnPress).not.toHaveBeenCalled();
  });
});
