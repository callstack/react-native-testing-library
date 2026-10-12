import * as React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import type { TestInstance } from 'test-renderer';

import { render, screen } from '../../..';
import { getEventHandlerName } from '../../shared/handler';
import type { SyntheticEvent } from '../event';
import { createEvent } from '../event';
import type { PressabilityEventType } from '../event-types';
import { PRESSABILITY_EVENT_TYPES } from '../event-types';
import { dispatchPressabilityEvent, findResponder, getTouchPath } from '../pressability';

function createTouchEvent() {
  return createEvent('touchEnd', { nativeEvent: { pageX: 10 } }) as SyntheticEvent;
}

/** Touches the element and calls one callback of the touch responder, as modern `fireEvent`. */
async function touch(
  instance: TestInstance,
  eventType: PressabilityEventType,
  event: SyntheticEvent = createTouchEvent(),
) {
  const path = getTouchPath(instance);
  const responder = findResponder(path);
  return responder != null
    ? await dispatchPressabilityEvent(responder, eventType, event, path)
    : false;
}

function logCallbacks(calls: string[], id: string) {
  const log = (name: string) => () => {
    calls.push(`${id}.${name}`);
  };
  return {
    onPress: log('onPress'),
    onPressIn: log('onPressIn'),
    onPressOut: log('onPressOut'),
    onLongPress: log('onLongPress'),
  };
}

test.each(PRESSABILITY_EVENT_TYPES)(
  '%s calls only Pressable and TouchableOpacity callback',
  async (eventType) => {
    const name = getEventHandlerName(eventType);
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

    await touch(screen.getByText('Pressable'), eventType);
    await touch(screen.getByText('Touchable'), eventType);

    expect(calls).toEqual([`pressable.${name}`, `touchable.${name}`]);
  },
);

test.each(PRESSABILITY_EVENT_TYPES)(
  '%s calls only host callback, incl. testOnly_ props',
  async (eventType) => {
    const name = getEventHandlerName(eventType);
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

    await touch(screen.getByText('Text'), eventType);
    await touch(screen.getByTestId('view'), eventType);

    expect(calls).toEqual([`text.${name}`, `view.testOnly_${name}`]);
  },
);

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

  await touch(screen.getByText('Press me'), 'pressIn', event);

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

  await touch(screen.getByText('Press me'), 'pressIn');

  expect(onPressIn).not.toHaveBeenCalled();
});

test('responder without the callback keeps the touch from its ancestors', async () => {
  const onLongPress = jest.fn();
  await render(
    <Pressable onLongPress={onLongPress}>
      <Pressable onPress={jest.fn()}>
        <Text>Press me</Text>
      </Pressable>
    </Pressable>,
  );

  await touch(screen.getByText('Press me'), 'longPress');

  expect(onLongPress).not.toHaveBeenCalled();
});

test('does not call callbacks of disabled Pressable', async () => {
  const calls: string[] = [];
  await render(
    <Pressable {...logCallbacks(calls, 'pressable')} disabled>
      <Text>Press me</Text>
    </Pressable>,
  );

  for (const eventType of PRESSABILITY_EVENT_TYPES) {
    await touch(screen.getByText('Press me'), eventType);
  }

  expect(calls).toEqual([]);
});

test('returns whether the responder had the callback', async () => {
  await render(
    <Pressable onPress={jest.fn()}>
      <Text>Press me</Text>
    </Pressable>,
  );

  expect(await touch(screen.getByText('Press me'), 'press')).toBe(true);
  expect(await touch(screen.getByText('Press me'), 'longPress')).toBe(false);
});
