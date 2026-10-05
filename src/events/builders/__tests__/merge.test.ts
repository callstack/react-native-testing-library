import { buildTouchEvent } from '../common';
import { mergeEventProps } from '../merge';

test('returns the same event when no props are passed', () => {
  const event = buildTouchEvent();
  const nativeEvent = { ...event.nativeEvent };

  expect(mergeEventProps(event)).toBe(event);
  expect(event.nativeEvent).toEqual(nativeEvent);
});

test('deep merges nested objects and keeps other default fields', () => {
  const event = mergeEventProps(buildTouchEvent(), { nativeEvent: { pageX: 10, pageY: 20 } });

  expect(event.nativeEvent.pageX).toBe(10);
  expect(event.nativeEvent.pageY).toBe(20);
  expect(event.nativeEvent.locationX).toBe(0);
  expect(typeof event.preventDefault).toBe('function');
});

test('replaces arrays and primitive values instead of merging them', () => {
  const event = mergeEventProps(buildTouchEvent(), {
    nativeEvent: { touches: [{ identifier: 1 }] },
    timeStamp: 42,
  });

  expect(event.nativeEvent.touches).toEqual([{ identifier: 1 }]);
  expect(event.timeStamp).toBe(42);
});

test('adds props that the event does not have', () => {
  const event = mergeEventProps(buildTouchEvent(), { custom: { value: 1 } });

  expect(event).toMatchObject({ custom: { value: 1 } });
});
