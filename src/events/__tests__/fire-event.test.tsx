import * as React from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

import { configure, fireEvent, render, screen } from '../..';
import { SyntheticEvent } from '../modern/event';

describe('legacy event system', () => {
  test('fireEvent calls only the target prop with the passed arguments', async () => {
    const onPointerDown = jest.fn();
    const onParentPointerDownCapture = jest.fn();
    await render(
      <View onPointerDownCapture={onParentPointerDownCapture}>
        <View testID="target" onPointerDown={onPointerDown} />
      </View>,
    );

    await fireEvent(screen.getByTestId('target'), 'pointerDown', 'a', 'b');
    expect(onPointerDown).toHaveBeenCalledWith('a', 'b');
    expect(onParentPointerDownCapture).not.toHaveBeenCalled();
  });

  test('fireEvent.changeText calls onChangeText without onChange', async () => {
    const onChange = jest.fn();
    const onChangeText = jest.fn();
    await render(<TextInput testID="input" onChange={onChange} onChangeText={onChangeText} />);

    await fireEvent.changeText(screen.getByTestId('input'), 'Hello');
    expect(onChangeText).toHaveBeenCalledWith('Hello');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('fireEvent.press calls onPress', async () => {
    const onPress = jest.fn();
    await render(<Text testID="text" onPress={onPress} />);

    expect(await fireEvent.press(screen.getByTestId('text'))).toBeUndefined();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('fireEvent.scroll and fireEvent.layout pass legacy event objects', async () => {
    const onScroll = jest.fn();
    const onLayout = jest.fn();
    await render(<ScrollView testID="scrollView" onScroll={onScroll} onLayout={onLayout} />);

    expect(await fireEvent.scroll(screen.getByTestId('scrollView'))).toBeUndefined();
    expect(await fireEvent.layout(screen.getByTestId('scrollView'))).toBeUndefined();
    expect(onScroll.mock.calls[0][0]).not.toBeInstanceOf(SyntheticEvent);
    expect(onLayout.mock.calls[0][0]).not.toBeInstanceOf(SyntheticEvent);
  });
});

describe('modern event system', () => {
  beforeEach(() => {
    configure({ eventSystem: 'modern' });
  });

  test('fireEvent dispatches a SyntheticEvent through capture and bubble phases', async () => {
    const onPointerDown = jest.fn();
    const onParentPointerDownCapture = jest.fn();
    await render(
      <View onPointerDownCapture={onParentPointerDownCapture}>
        <View testID="target" onPointerDown={onPointerDown} />
      </View>,
    );

    expect(
      await fireEvent(screen.getByTestId('target'), 'pointerDown', {
        nativeEvent: { pointerId: 1 },
      }),
    ).toBe(true);
    expect(onParentPointerDownCapture).toHaveBeenCalledTimes(1);
    expect(onPointerDown.mock.calls[0][0]).toBeInstanceOf(SyntheticEvent);
    expect(onPointerDown.mock.calls[0][0].nativeEvent).toEqual({ pointerId: 1 });
  });

  test('fireEvent throws for event types React Native does not dispatch natively', async () => {
    const onChangeText = jest.fn();
    await render(<TextInput testID="input" onChangeText={onChangeText} />);

    await expect(fireEvent(screen.getByTestId('input'), 'changeText', 'Hello')).rejects.toThrow(
      `React Native doesn't dispatch "changeText" natively`,
    );
    expect(onChangeText).not.toHaveBeenCalled();
  });

  test('fireEvent.changeText fires onChange, then onChangeText', async () => {
    const calls: string[] = [];
    await render(
      <TextInput
        testID="input"
        onChange={(event) => calls.push(`onChange: ${event.nativeEvent.text}`)}
        onChangeText={(text) => calls.push(`onChangeText: ${text}`)}
      />,
    );

    expect(await fireEvent.changeText(screen.getByTestId('input'), 'Hello')).toBe(true);
    expect(calls).toEqual(['onChange: Hello', 'onChangeText: Hello']);
  });

  test('fireEvent.press throws as not supported', async () => {
    const onPress = jest.fn();
    await render(<Text testID="text" onPress={onPress} />);

    await expect(fireEvent.press(screen.getByTestId('text'))).rejects.toThrow(
      'fireEvent.press() is not supported yet in the modern event system.',
    );
    expect(onPress).not.toHaveBeenCalled();
  });

  test('fireEvent.scroll and fireEvent.layout pass SyntheticEvents', async () => {
    const onScroll = jest.fn();
    const onLayout = jest.fn();
    await render(<ScrollView testID="scrollView" onScroll={onScroll} onLayout={onLayout} />);

    expect(await fireEvent.scroll(screen.getByTestId('scrollView'))).toBe(true);
    expect(await fireEvent.layout(screen.getByTestId('scrollView'))).toBe(true);
    expect(onScroll.mock.calls[0][0]).toBeInstanceOf(SyntheticEvent);
    expect(onLayout.mock.calls[0][0]).toBeInstanceOf(SyntheticEvent);
  });
});

test('reads the event system on each call', async () => {
  const onPress = jest.fn();
  await render(<Text testID="text" onPress={onPress} />);

  await fireEvent.press(screen.getByTestId('text'));
  configure({ eventSystem: 'modern' });
  await expect(fireEvent.press(screen.getByTestId('text'))).rejects.toThrow('not supported');
  expect(onPress).toHaveBeenCalledTimes(1);
});
