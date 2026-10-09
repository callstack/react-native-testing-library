import { mergeEventProps } from '../merge';

function buildEvent() {
  return {
    nativeEvent: { pageX: 0, pageY: 0, locationX: 0, touches: [] as unknown[] },
    preventDefault: () => {},
    timeStamp: 0,
  };
}

test('returns the same event when no props are passed', () => {
  const event = buildEvent();
  const nativeEvent = { ...event.nativeEvent };

  expect(mergeEventProps(event)).toBe(event);
  expect(event.nativeEvent).toEqual(nativeEvent);
});

test('deep merges nested objects and keeps other default fields', () => {
  const event = mergeEventProps(buildEvent(), { nativeEvent: { pageX: 10, pageY: 20 } });

  expect(event.nativeEvent.pageX).toBe(10);
  expect(event.nativeEvent.pageY).toBe(20);
  expect(event.nativeEvent.locationX).toBe(0);
  expect(typeof event.preventDefault).toBe('function');
});

test('replaces arrays and primitive values instead of merging them', () => {
  const event = mergeEventProps(buildEvent(), {
    nativeEvent: { touches: [{ identifier: 1 }] },
    timeStamp: 42,
  });

  expect(event.nativeEvent.touches).toEqual([{ identifier: 1 }]);
  expect(event.timeStamp).toBe(42);
});

test('adds props that the event does not have', () => {
  const event = mergeEventProps(buildEvent(), { custom: { value: 1 } });

  expect(event).toMatchObject({ custom: { value: 1 } });
});

test('merges multiple props in order, skipping undefined ones', () => {
  const event = mergeEventProps(
    buildEvent(),
    { nativeEvent: { pageX: 10, pageY: 20 } },
    undefined,
    { nativeEvent: { pageX: 30 } },
  );

  expect(event.nativeEvent).toMatchObject({ pageX: 30, pageY: 20, locationX: 0 });
});

test('does not pollute Object.prototype through a __proto__ key', () => {
  const props = JSON.parse(
    '{"__proto__": {"polluted": true}, "nativeEvent": {"__proto__": {"polluted": true}}}',
  );

  mergeEventProps(buildEvent(), props);

  expect(({} as Record<string, unknown>).polluted).toBeUndefined();
});
