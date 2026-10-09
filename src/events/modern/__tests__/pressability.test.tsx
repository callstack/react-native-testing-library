import * as React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

import { render, screen } from '../../..';
import type { SyntheticEvent } from '../event';
import { createEvent } from '../event';
import type { PressabilityCallbackName } from '../pressability';
import { dispatchPressabilityEvent } from '../pressability';

const callbackNames: PressabilityCallbackName[] = [
  'onPress',
  'onPressIn',
  'onPressOut',
  'onLongPress',
];

function createTouchEvent() {
  return createEvent('touchEnd', { nativeEvent: { pageX: 10 } }) as SyntheticEvent;
}

function logCallbacks(calls: string[], id: string) {
  const log = (name: PressabilityCallbackName) => () => {
    calls.push(`${id}.${name}`);
  };
  return {
    onPress: log('onPress'),
    onPressIn: log('onPressIn'),
    onPressOut: log('onPressOut'),
    onLongPress: log('onLongPress'),
  };
}

test.each(callbackNames)('calls only %s of Pressable and TouchableOpacity', async (name) => {
  const calls: string[] = [];
  await render(
    <>
      <Pressable {...logCallbacks(calls, 'pressable')}>
        <Text>Pressable</Text>
      </Pressable>
      <TouchableOpacity {...logCallbacks(calls, 'touchable')}>
        <Text>Touchable</Text>
      </TouchableOpacity>
    </>,
  );

  await dispatchPressabilityEvent(screen.getByText('Pressable'), name, createTouchEvent());
  await dispatchPressabilityEvent(screen.getByText('Touchable'), name, createTouchEvent());

  expect(calls).toEqual([`pressable.${name}`, `touchable.${name}`]);
});

test.each(callbackNames)('calls only %s of host elements, incl. testOnly_ props', async (name) => {
  const calls: string[] = [];
  await render(
    <>
      <Text {...logCallbacks(calls, 'text')}>Text</Text>
      <View
        testID="view"
        {...{ [`testOnly_${name}`]: () => calls.push(`view.testOnly_${name}`) }}
      />
    </>,
  );

  await dispatchPressabilityEvent(screen.getByText('Text'), name, createTouchEvent());
  await dispatchPressabilityEvent(screen.getByTestId('view'), name, createTouchEvent());

  expect(calls).toEqual([`text.${name}`, `view.testOnly_${name}`]);
});

test('passes the event, with the hit target and the responder', async () => {
  const onPressIn = jest.fn((event) => ({
    currentTarget: event.currentTarget,
    target: event.target,
  }));
  await render(
    <Pressable testID="pressable" onPressIn={onPressIn}>
      <Text>Press me</Text>
    </Pressable>,
  );
  const event = createTouchEvent();

  expect(await dispatchPressabilityEvent(screen.getByText('Press me'), 'onPressIn', event)).toBe(
    true,
  );

  expect(onPressIn).toHaveBeenCalledWith(event);
  expect(onPressIn.mock.results[0].value).toEqual({
    currentTarget: screen.getByTestId('pressable'),
    target: screen.getByText('Press me'),
  });
});

test('host element with another press callback claims the touch, but gets nothing', async () => {
  const onPressIn = jest.fn();
  await render(
    <Pressable onPressIn={onPressIn}>
      <Text onPress={jest.fn()}>Press me</Text>
    </Pressable>,
  );

  expect(
    await dispatchPressabilityEvent(screen.getByText('Press me'), 'onPressIn', createTouchEvent()),
  ).toBe(false);
  expect(onPressIn).not.toHaveBeenCalled();
});

test('returns false when the responder has no such callback', async () => {
  await render(
    <Pressable onPress={jest.fn()}>
      <Text>Press me</Text>
    </Pressable>,
  );

  expect(
    await dispatchPressabilityEvent(
      screen.getByText('Press me'),
      'onLongPress',
      createTouchEvent(),
    ),
  ).toBe(false);
});

test('does not call callbacks of disabled Pressable', async () => {
  const calls: string[] = [];
  await render(
    <Pressable {...logCallbacks(calls, 'pressable')} disabled>
      <Text>Press me</Text>
    </Pressable>,
  );

  for (const name of callbackNames) {
    await dispatchPressabilityEvent(screen.getByText('Press me'), name, createTouchEvent());
  }

  expect(calls).toEqual([]);
});
