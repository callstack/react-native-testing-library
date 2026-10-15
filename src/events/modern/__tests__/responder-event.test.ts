import { SyntheticEvent } from '../event';
import { createPressabilityEvent, ResponderEvent } from '../responder-event';

afterEach(() => {
  jest.restoreAllMocks();
});

const touch = {
  identifier: 0,
  locationX: 0,
  locationY: 0,
  pageX: 0,
  pageY: 0,
  target: 0,
  timestamp: 456,
};

test.each(['pressIn', 'longPress'] as const)('%s gets the responder grant event', (eventType) => {
  jest.spyOn(performance, 'now').mockReturnValue(456);

  const event = createPressabilityEvent(eventType);

  expect(event).toBeInstanceOf(ResponderEvent);
  expect(event).toBeInstanceOf(SyntheticEvent);
  expect(event.type).toBe('responderGrant');
  expect(event.dispatchConfig).toEqual({ registrationName: 'onResponderGrant', dependencies: [] });
  expect(event.nativeEvent).toEqual({ ...touch, changedTouches: [touch], touches: [touch] });
});

test.each(['pressOut', 'press'] as const)('%s gets the responder release event', (eventType) => {
  jest.spyOn(performance, 'now').mockReturnValue(456);

  const event = createPressabilityEvent(eventType);

  expect(event.type).toBe('responderRelease');
  expect(event.dispatchConfig).toEqual({
    registrationName: 'onResponderRelease',
    dependencies: ['topTouchCancel', 'topTouchEnd'],
  });
  expect(event.nativeEvent).toEqual({ ...touch, changedTouches: [touch], touches: [] });
});

test('creates the event as React Native responder system does', () => {
  jest.spyOn(performance, 'now').mockReturnValue(456);

  const event = createPressabilityEvent('press', { nativeEvent: { timestamp: 123 } });

  expect(event.bubbles).toBe(false);
  expect(event.cancelable).toBe(true);
  expect(event.composed).toBe(false);
  expect(event.rnIsDirect).toBe(false);
  expect(event.isTrusted).toBe(false);
  // From `performance.now()`, not the native timestamp.
  expect(event.timeStamp).toBe(456);
  expect(event.target).toBeNull();
  expect(event.currentTarget).toBeNull();
  expect(event.eventPhase).toBe(SyntheticEvent.NONE);
  expect(event.composedPath()).toEqual([]);
});

test('takes timeStamp from init', () => {
  expect(createPressabilityEvent('press', { timeStamp: 123 }).timeStamp).toBe(123);
});

test('fills the touch arrays from the passed nativeEvent', () => {
  const event = createPressabilityEvent('pressIn', {
    nativeEvent: { pageX: 20, pageY: 30, timestamp: 1 },
  });

  const expectedTouch = { ...touch, pageX: 20, pageY: 30, timestamp: 1 };
  expect(event.nativeEvent.changedTouches).toEqual([expectedTouch]);
  expect(event.nativeEvent.touches).toEqual([expectedTouch]);
  // Separate objects, as on a device.
  expect(event.nativeEvent.touches).not.toBe(event.nativeEvent.changedTouches);
});

test('keeps the touch arrays of the passed nativeEvent', () => {
  const touches = [{ identifier: 1, pageX: 5, pageY: 5, timestamp: 1 }];

  const event = createPressabilityEvent('pressOut', {
    nativeEvent: { changedTouches: touches, touches },
  });

  expect(event.nativeEvent.changedTouches).toBe(touches);
  expect(event.nativeEvent.touches).toBe(touches);
});
