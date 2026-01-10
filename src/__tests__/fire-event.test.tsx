import * as React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { fireEvent, render, screen } from '..';
import { nativeState } from '../native-state';

describe('fireEvent.press', () => {
  test('works on Pressable', async () => {
    const onPress = jest.fn();
    await render(<Pressable testID="pressable" onPress={onPress} />);
    await fireEvent.press(screen.getByTestId('pressable'));
    expect(onPress).toHaveBeenCalled();
  });

  test('works on TouchableOpacity', async () => {
    const onPress = jest.fn();
    await render(
      <TouchableOpacity testID="touchable" onPress={onPress}>
        <Text>Press me</Text>
      </TouchableOpacity>,
    );
    await fireEvent.press(screen.getByTestId('touchable'));
    expect(onPress).toHaveBeenCalled();
  });

  test('works on TouchableHighlight', async () => {
    const onPress = jest.fn();
    await render(
      <TouchableHighlight testID="touchable" onPress={onPress}>
        <Text>Press me</Text>
      </TouchableHighlight>,
    );
    await fireEvent.press(screen.getByTestId('touchable'));
    expect(onPress).toHaveBeenCalled();
  });

  test('works on TouchableWithoutFeedback', async () => {
    const onPress = jest.fn();
    await render(
      <TouchableWithoutFeedback testID="touchable" onPress={onPress}>
        <View>
          <Text>Press me</Text>
        </View>
      </TouchableWithoutFeedback>,
    );
    await fireEvent.press(screen.getByTestId('touchable'));
    expect(onPress).toHaveBeenCalled();
  });

  test('works on TouchableNativeFeedback', async () => {
    if (Platform.OS !== 'android') {
      return;
    }

    const onPress = jest.fn();
    await render(
      <TouchableNativeFeedback testID="touchable" onPress={onPress}>
        <View>
          <Text>Press me</Text>
        </View>
      </TouchableNativeFeedback>,
    );
    await fireEvent.press(screen.getByTestId('touchable'));
    expect(onPress).toHaveBeenCalled();
  });
});

test('fireEvent.changeText works on TextInput', async () => {
  const onChangeText = jest.fn();
  await render(<TextInput testID="input" onChangeText={onChangeText} />);
  await fireEvent.changeText(screen.getByTestId('input'), 'new text');
  expect(onChangeText).toHaveBeenCalledWith('new text');
});

test('fireEvent.scroll works on ScrollView', async () => {
  const onScroll = jest.fn();
  const eventData = { nativeEvent: { contentOffset: { y: 200 } } };
  await render(
    <ScrollView testID="scroll" onScroll={onScroll}>
      <Text>Content</Text>
    </ScrollView>,
  );
  await fireEvent.scroll(screen.getByTestId('scroll'), eventData);
  expect(onScroll).toHaveBeenCalledWith(eventData);
});

test('fireEvent bubbles event to parent handler', async () => {
  const onPress = jest.fn();
  await render(
    <TouchableOpacity onPress={onPress}>
      <Text>Press me</Text>
    </TouchableOpacity>,
  );
  await fireEvent.press(screen.getByText('Press me'));
  expect(onPress).toHaveBeenCalled();
});

test('fireEvent accepts event name with or without "on" prefix', async () => {
  const onPress = jest.fn();
  await render(<Pressable testID="btn" onPress={onPress} />);

  await fireEvent(screen.getByTestId('btn'), 'press');
  expect(onPress).toHaveBeenCalledTimes(1);

  await fireEvent(screen.getByTestId('btn'), 'onPress');
  expect(onPress).toHaveBeenCalledTimes(2);
});

test('fireEvent does not fire on elements with pointerEvents="none"', async () => {
  const onPress = jest.fn();
  await render(
    <View pointerEvents="none">
      <Pressable testID="btn" onPress={onPress} />
    </View>,
  );
  await fireEvent.press(screen.getByTestId('btn'));
  expect(onPress).not.toHaveBeenCalled();
});

test('fireEvent.changeText does not fire on non-editable TextInput', async () => {
  const onChangeText = jest.fn();
  await render(<TextInput testID="input" editable={false} onChangeText={onChangeText} />);
  await fireEvent.changeText(screen.getByTestId('input'), 'new text');
  expect(onChangeText).not.toHaveBeenCalled();
});

test('fireEvent.changeText updates native state for uncontrolled TextInput', async () => {
  await render(<TextInput testID="input" />);
  const input = screen.getByTestId('input');
  await fireEvent.changeText(input, 'hello');
  expect(input).toHaveDisplayValue('hello');
  expect(nativeState.valueForElement.get(input)).toBe('hello');
});

test('fireEvent returns handler return value', async () => {
  const handler = jest.fn().mockReturnValue('result');
  await render(<Pressable testID="btn" onPress={handler} />);
  const result = await fireEvent.press(screen.getByTestId('btn'));
  expect(result).toBe('result');
});

test('fireEvent does nothing when element is unmounted', async () => {
  const onPress = jest.fn();
  const { unmount } = await render(<Pressable testID="btn" onPress={onPress} />);
  const element = screen.getByTestId('btn');

  await unmount();

  await fireEvent.press(element);
  expect(onPress).not.toHaveBeenCalled();
});

describe('edge cases', () => {
  test('scroll event without contentOffset does not update native state', async () => {
    const onScroll = jest.fn();
    await render(
      <ScrollView testID="scroll" onScroll={onScroll}>
        <Text>Content</Text>
      </ScrollView>,
    );
    const scrollView = screen.getByTestId('scroll');
    await fireEvent.scroll(scrollView, {});
    expect(onScroll).toHaveBeenCalled();
    expect(nativeState.contentOffsetForElement.get(scrollView)).toBeUndefined();
  });

  test('scroll event with non-finite contentOffset values uses 0', async () => {
    const onScroll = jest.fn();
    await render(
      <ScrollView testID="scroll" onScroll={onScroll}>
        <Text>Content</Text>
      </ScrollView>,
    );
    const scrollView = screen.getByTestId('scroll');
    await fireEvent.scroll(scrollView, {
      nativeEvent: { contentOffset: { x: Infinity, y: NaN } },
    });
    expect(onScroll).toHaveBeenCalled();
    expect(nativeState.contentOffsetForElement.get(scrollView)).toEqual({ x: 0, y: 0 });
  });

  test('scroll event with valid x and y contentOffset updates native state', async () => {
    const onScroll = jest.fn();
    await render(
      <ScrollView testID="scroll" onScroll={onScroll}>
        <Text>Content</Text>
      </ScrollView>,
    );
    const scrollView = screen.getByTestId('scroll');
    await fireEvent.scroll(scrollView, {
      nativeEvent: { contentOffset: { x: 100, y: 200 } },
    });
    expect(onScroll).toHaveBeenCalled();
    expect(nativeState.contentOffsetForElement.get(scrollView)).toEqual({ x: 100, y: 200 });
  });

  test('layout event fires on non-editable TextInput', async () => {
    const onLayout = jest.fn();
    await render(<TextInput testID="input" editable={false} onLayout={onLayout} />);
    await fireEvent(screen.getByTestId('input'), 'layout');
    expect(onLayout).toHaveBeenCalled();
  });

  test('scroll event fires on non-editable TextInput', async () => {
    const onScroll = jest.fn();
    await render(<TextInput testID="input" editable={false} onScroll={onScroll} />);
    await fireEvent(screen.getByTestId('input'), 'scroll');
    expect(onScroll).toHaveBeenCalled();
  });

  test('does not fire when onStartShouldSetResponder returns false', async () => {
    const onPress = jest.fn();
    await render(
      <View onStartShouldSetResponder={() => false} onPress={onPress}>
        <Text testID="text">Press</Text>
      </View>,
    );
    await fireEvent.press(screen.getByTestId('text'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
