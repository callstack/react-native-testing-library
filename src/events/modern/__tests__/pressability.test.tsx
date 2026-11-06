import * as React from 'react';
import { PanResponder, Pressable, Text, TouchableOpacity, View } from 'react-native';
import type { TestInstance } from 'test-renderer';

import { render, screen } from '../../..';
import { getEventHandlerName } from '../../shared/handler';
import type { SyntheticEvent } from '../event';
import { createEvent } from '../event';
import type { PressabilityEventType } from '../event-types';
import { PRESSABILITY_EVENT_TYPES } from '../event-types';
import type { TouchResponder } from '../pressability';
import { dispatchPressabilityEvent, findTouchResponder, getTouchPath } from '../pressability';
import { getPressDiagnostics } from '../warnings';

function createTouchEvent() {
  return createEvent('touchEnd', { nativeEvent: { pageX: 10 } });
}

/** Touches the element and calls one callback of the touch responder, as modern `fireEvent`. */
async function touch(
  instance: TestInstance,
  eventType: PressabilityEventType,
  event: SyntheticEvent = createTouchEvent(),
) {
  const path = getTouchPath(instance);
  const responder = findTouchResponder(path);
  return responder != null
    ? (await dispatchPressabilityEvent(responder.instance, [eventType], event, path[0]))
        .calledEventTypes.length > 0
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

test('does not call callbacks of Text disabled during the touch', async () => {
  const onPress = jest.fn();
  function DisabledOnPressIn() {
    const [disabled, setDisabled] = React.useState(false);
    return (
      <Text disabled={disabled} onPressIn={() => setDisabled(true)} onPress={onPress}>
        Press me
      </Text>
    );
  }
  await render(<DisabledOnPressIn />);
  const path = getTouchPath(screen.getByText('Press me'));
  const responder = (findTouchResponder(path) as TouchResponder).instance;

  await dispatchPressabilityEvent(responder, ['pressIn'], createTouchEvent(), path[0]);
  const result = await dispatchPressabilityEvent(responder, ['press'], createTouchEvent(), path[0]);

  expect(result).toEqual({ calledEventTypes: [] });
  expect(onPress).not.toHaveBeenCalled();
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

test('findTouchResponder classifies a responder without Pressability as responderHandlers', async () => {
  const panResponder = PanResponder.create({ onStartShouldSetPanResponder: () => true });
  await render(
    <View testID="pan" {...panResponder.panHandlers}>
      <Text>Press me</Text>
    </View>,
  );

  expect(findTouchResponder(getTouchPath(screen.getByText('Press me')))).toEqual({
    instance: screen.getByTestId('pan'),
    kind: 'responderHandlers',
  });
});

test('findTouchResponder classifies Pressable as pressabilityConfig and mocked hosts as pressHandlers', async () => {
  await render(
    <Pressable testID="pressable" onPress={jest.fn()}>
      <Text>Press me</Text>
      <Text onPress={jest.fn()}>Press text</Text>
    </Pressable>,
  );

  expect(findTouchResponder(getTouchPath(screen.getByText('Press me')))).toEqual({
    instance: screen.getByTestId('pressable'),
    kind: 'pressabilityConfig',
  });
  expect(findTouchResponder(getTouchPath(screen.getByText('Press text')))).toEqual({
    instance: screen.getByText('Press text'),
    kind: 'pressHandlers',
  });
});

test('getPressDiagnostics returns the display: none blocker and the skipped elements', async () => {
  await render(
    <View testID="hider" style={{ display: 'none' }}>
      <Pressable testID="pressable" onPress={jest.fn()}>
        <Text>Press me</Text>
      </Pressable>
    </View>,
  );

  const options = { includeHiddenElements: true };

  expect(getPressDiagnostics(screen.getByText('Press me', options), null)).toEqual({
    displayNoneBlocker: screen.getByTestId('hider', options),
    skippedTargets: [screen.getByTestId('pressable', options)],
  });
});

test('getPressDiagnostics skips the pressed element when no element can receive the touch', async () => {
  await render(
    <View pointerEvents="none">
      <Text>Press me</Text>
    </View>,
  );
  const text = screen.getByText('Press me');

  expect(getPressDiagnostics(text, null)).toEqual({
    displayNoneBlocker: null,
    skippedTargets: [text],
  });
});

test('getPressDiagnostics returns nothing for a press that reaches the responder', async () => {
  await render(
    <Pressable testID="pressable" onPress={jest.fn()}>
      <Text>Press me</Text>
    </Pressable>,
  );

  expect(
    getPressDiagnostics(screen.getByText('Press me'), screen.getByTestId('pressable')),
  ).toEqual({ displayNoneBlocker: null, skippedTargets: [] });
});
