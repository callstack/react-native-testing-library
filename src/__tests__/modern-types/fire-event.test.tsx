import '../../modern-types';

import * as React from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';

import { fireEvent, render, screen } from '../..';
import { configure } from '../../config';
import { _console } from '../../helpers/logger';

// Type-checked by `tsconfig.modern-types.json`, where `modern-types` switches `fireEvent` to the
// modern signatures. Calls the types reject also throw at runtime.

beforeEach(() => {
  configure({ unstable_eventSystem: 'modern' });
});

const emptyEvent = { nativeEvent: {} };

test('accepts known event types, with or without the deprecated "on" prefix', async () => {
  const warnSpy = jest.spyOn(_console, 'warn').mockImplementation(() => {});
  const onFocus = jest.fn();
  const onLayout = jest.fn();
  await render(<TextInput testID="input" onFocus={onFocus} onLayout={onLayout} />);
  const input = screen.getByTestId('input');

  await fireEvent(input, 'focus', emptyEvent);
  await fireEvent(input, 'onLayout', { nativeEvent: { layout: { width: 100 } }, timeStamp: 1 });

  expect(onFocus).toHaveBeenCalledTimes(1);
  expect(onLayout).toHaveBeenCalledTimes(1);
  expect(warnSpy).toHaveBeenCalledTimes(1);
  warnSpy.mockRestore();
});

test('accepts custom event types with dispatch', async () => {
  const onPageSelected = jest.fn();
  const onChangeText = jest.fn();
  await render(<View testID="native" {...{ onPageSelected, onChangeText }} />);
  const native = screen.getByTestId('native');

  await fireEvent(native, 'pageSelected', { nativeEvent: { position: 1 }, dispatch: 'direct' });
  // A native component's own `changeText` event.
  await fireEvent(native, 'changeText', { nativeEvent: { text: 'Hello' }, dispatch: 'direct' });

  expect(onPageSelected).toHaveBeenCalledTimes(1);
  expect(onChangeText).toHaveBeenCalledTimes(1);
});

test('accepts the helper signatures', async () => {
  const onPress = jest.fn();
  const onChangeText = jest.fn();
  const onScroll = jest.fn();
  const onLayout = jest.fn();
  await render(
    <>
      <Pressable testID="pressable" onPress={onPress} />
      <TextInput testID="input" onChangeText={onChangeText} />
      <ScrollView testID="scroll" onScroll={onScroll} onLayout={onLayout} />
    </>,
  );

  await fireEvent.press(screen.getByTestId('pressable'));
  await fireEvent.changeText(screen.getByTestId('input'), 'Hello');
  await fireEvent.scroll(screen.getByTestId('scroll'), {
    nativeEvent: { contentOffset: { y: 200 } },
  });
  await fireEvent.layout(screen.getByTestId('scroll'), { width: 100 });

  expect(onPress).toHaveBeenCalledTimes(1);
  expect(onChangeText).toHaveBeenCalledWith('Hello');
  expect(onScroll).toHaveBeenCalledTimes(1);
  expect(onLayout).toHaveBeenCalledTimes(1);
});

test('rejects custom event types without dispatch', async () => {
  await render(<View testID="pager" />);
  const pager = screen.getByTestId('pager');

  // @ts-expect-error `dispatch` is required for event types React Native doesn't know
  await expect(fireEvent(pager, 'pageSelected', emptyEvent)).rejects.toThrow();
  // @ts-expect-error `changeText` is not a native event type, the type error suggests alternatives
  await expect(fireEvent(pager, 'changeText', 'Hello')).rejects.toThrow();
  // @ts-expect-error `changeText` is not a native event type, the type error suggests alternatives
  await expect(fireEvent(pager, 'onChangeText', emptyEvent)).rejects.toThrow();
  // @ts-expect-error unsupported `dispatch` value
  await expect(fireEvent(pager, 'pageSelected', { dispatch: 'capture' })).rejects.toThrow();
});

test('rejects anything but a single event object', async () => {
  await render(<View testID="view" />);
  const view = screen.getByTestId('view');

  // @ts-expect-error missing event object
  await expect(fireEvent(view, 'focus')).rejects.toThrow();
  // @ts-expect-error more than one argument
  await expect(fireEvent(view, 'focus', emptyEvent, emptyEvent)).rejects.toThrow();
  // @ts-expect-error not an event object
  await expect(fireEvent(view, 'focus', 'event')).rejects.toThrow();
  // @ts-expect-error `nativeEvent` must be an object
  await expect(fireEvent(view, 'focus', { nativeEvent: 1 })).rejects.toThrow();
  // @ts-expect-error unsupported event object key
  await expect(fireEvent(view, 'focus', { nativeEvent: {}, target: view })).rejects.toThrow();
  // @ts-expect-error unsupported event object key
  await expect(fireEvent.press(view, { pageX: 20 })).rejects.toThrow();
});
