import * as React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { configure, fireEvent, render, screen } from '../..';
import { getConfig } from '../../config';
import { SyntheticEvent } from '../modern/event';

test('fireEvent calls handlers of the selected event system', async () => {
  const onPointerDown = jest.fn();
  const onParentPointerDownCapture = jest.fn();
  await render(
    <View onPointerDownCapture={onParentPointerDownCapture}>
      <View testID="target" onPointerDown={onPointerDown} />
    </View>,
  );

  const init = { nativeEvent: { pointerId: 1 } };
  await fireEvent(screen.getByTestId('target'), 'pointerDown', init);
  const isModern = getConfig().unstable_eventSystem === 'modern';
  // Modern dispatches a `SyntheticEvent` through capture and bubble phases. Legacy calls only the
  // target prop with the passed arguments.
  expect(onParentPointerDownCapture).toHaveBeenCalledTimes(isModern ? 1 : 0);
  expect(onPointerDown.mock.calls[0][0] instanceof SyntheticEvent).toBe(isModern);
  expect(onPointerDown.mock.calls[0][0].nativeEvent).toEqual({ pointerId: 1 });
});

test('fireEvent with an event type React Native does not dispatch natively', async () => {
  const onChangeText = jest.fn();
  await render(<TextInput testID="input" onChangeText={onChangeText} />);

  const error = await fireEvent(screen.getByTestId('input'), 'changeText', 'Hello').then(
    () => undefined,
    (e: Error) => e.message,
  );
  const isModern = getConfig().unstable_eventSystem === 'modern';
  expect(error).toBe(
    isModern
      ? `Unable to fire a "changeText" event. React Native doesn't dispatch "changeText" natively. Use fireEvent.changeText() or userEvent.type() instead.`
      : undefined,
  );
  expect(onChangeText.mock.calls).toEqual(isModern ? [] : [['Hello']]);
});

test('fireEvent.changeText', async () => {
  const calls: string[] = [];
  await render(
    <TextInput
      testID="input"
      onChange={(event) => calls.push(`onChange: ${event.nativeEvent.text}`)}
      onChangeText={(text) => calls.push(`onChangeText: ${text}`)}
    />,
  );

  await fireEvent.changeText(screen.getByTestId('input'), 'Hello');
  expect(calls).toEqual(
    getConfig().unstable_eventSystem === 'modern'
      ? ['onChange: Hello', 'onChangeText: Hello']
      : ['onChangeText: Hello'],
  );
});

test('fireEvent.press calls onPress of Pressable with the event of the selected event system', async () => {
  const onPress = jest.fn();
  await render(
    <Pressable testID="pressable" onPress={onPress}>
      <Text>Press me</Text>
    </Pressable>,
  );

  await fireEvent.press(screen.getByText('Press me'));
  const isModern = getConfig().unstable_eventSystem === 'modern';
  expect(onPress).toHaveBeenCalledTimes(1);
  expect(onPress.mock.calls[0][0] instanceof SyntheticEvent).toBe(isModern);
});

test('fireEvent.scroll and fireEvent.layout pass events of the selected event system', async () => {
  const onScroll = jest.fn();
  const onLayout = jest.fn();
  await render(<ScrollView testID="scrollView" onScroll={onScroll} onLayout={onLayout} />);

  await fireEvent.scroll(screen.getByTestId('scrollView'));
  await fireEvent.layout(screen.getByTestId('scrollView'));
  const isModern = getConfig().unstable_eventSystem === 'modern';
  expect(onScroll.mock.calls[0][0] instanceof SyntheticEvent).toBe(isModern);
  expect(onLayout.mock.calls[0][0] instanceof SyntheticEvent).toBe(isModern);
});

test('reads the event system on each call', async () => {
  const onLayout = jest.fn();
  await render(<View testID="view" onLayout={onLayout} />);

  configure({ unstable_eventSystem: 'legacy' });
  await fireEvent.layout(screen.getByTestId('view'));
  configure({ unstable_eventSystem: 'modern' });
  await fireEvent.layout(screen.getByTestId('view'));
  expect(onLayout.mock.calls[0][0]).not.toBeInstanceOf(SyntheticEvent);
  expect(onLayout.mock.calls[1][0]).toBeInstanceOf(SyntheticEvent);
});
