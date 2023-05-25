import * as React from 'react';
import {
  Pressable,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { createEventLogger, getEventsName } from '../../../test-utils';
import { render, screen } from '../../..';
import { userEvent } from '../..';
import * as WarnAboutRealTimers from '../utils/warnAboutRealTimers';

const mockWarnAboutRealTimers = jest
  .spyOn(WarnAboutRealTimers, 'warnAboutRealTimers')
  .mockImplementation();

describe('userEvent.press with real timers', () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  test('calls onPressIn, onPress and onPressOut prop of touchable', async () => {
    const { events, logEvent } = createEventLogger();
    const user = userEvent.setup();

    render(
      <Pressable
        onPress={logEvent('press')}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
        testID="pressable"
      />
    );
    await user.press(screen.getByTestId('pressable'));

    expect(getEventsName(events)).toEqual(['pressIn', 'press', 'pressOut']);
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
        testID="pressable"
      />
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
        testID="pressable"
        pointerEvents="none"
      />
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
        testID="pressable"
        pointerEvents="box-none"
      />
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
          testID="pressable"
        />
      </View>
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
        testID="pressable"
        pointerEvents="box-only"
      />
    );
    await user.press(screen.getByTestId('pressable'));

    expect(getEventsName(events)).toEqual(['pressIn', 'press', 'pressOut']);
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
    const { events, logEvent } = createEventLogger();

    render(
      <Text
        onPress={logEvent('press')}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
      >
        press me
      </Text>
    );
    await userEvent.press(screen.getByText('press me'));

    expect(getEventsName(events)).toEqual(['pressIn', 'press', 'pressOut']);
  });

  test('doesnt trigger on disabled Text', async () => {
    const { events, logEvent } = createEventLogger();

    render(
      <Text
        onPress={logEvent('press')}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
        disabled
      >
        press me
      </Text>
    );
    await userEvent.press(screen.getByText('press me'));

    expect(events).toEqual([]);
  });

  test('doesnt trigger on Text with disabled pointer events', async () => {
    const { events, logEvent } = createEventLogger();

    render(
      <View pointerEvents="box-only">
        <Text
          onPress={logEvent('press')}
          onPressIn={logEvent('pressIn')}
          onPressOut={logEvent('pressOut')}
        >
          press me
        </Text>
      </View>
    );
    await userEvent.press(screen.getByText('press me'));

    expect(events).toEqual([]);
  });

  test('works on TetInput', async () => {
    const { events, logEvent } = createEventLogger();

    render(
      <TextInput
        placeholder="email"
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
      />
    );
    await userEvent.press(screen.getByPlaceholderText('email'));

    expect(getEventsName(events)).toEqual(['pressIn', 'pressOut']);
  });

  test('does not call onPressIn and onPressOut on non editable TetInput', async () => {
    const { events, logEvent } = createEventLogger();

    render(
      <TextInput
        placeholder="email"
        editable={false}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
      />
    );
    await userEvent.press(screen.getByPlaceholderText('email'));
    expect(events).toEqual([]);
  });

  test('does not call onPressIn and onPressOut on TetInput with pointer events disabled', async () => {
    const { events, logEvent } = createEventLogger();

    render(
      <TextInput
        placeholder="email"
        pointerEvents="box-none"
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
      />
    );
    await userEvent.press(screen.getByPlaceholderText('email'));
    expect(events).toEqual([]);
  });

  test('press is accessible directly in userEvent', async () => {
    const mockOnPress = jest.fn();

    render(
      <Pressable onPress={mockOnPress}>
        <Text>press me</Text>
      </Pressable>
    );

    await userEvent.press(screen.getByText('press me'));

    expect(mockOnPress).toHaveBeenCalled();
  });

  test('warns about using real timers with userEvent', async () => {
    render(<Pressable testID="pressable" />);

    await userEvent.press(screen.getByTestId('pressable'));

    expect(mockWarnAboutRealTimers).toHaveBeenCalledTimes(1);
  });
});
