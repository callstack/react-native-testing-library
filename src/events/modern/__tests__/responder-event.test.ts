import { SyntheticEvent } from '../event';
import { createPressabilityEvent, createTouchHistory, ResponderEvent } from '../responder-event';

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

test('records the touch in the touch history shared by the touch events', () => {
  const touchHistory = createTouchHistory();

  const startEvent = createPressabilityEvent(
    'pressIn',
    { nativeEvent: { pageX: 10, pageY: 20, timestamp: 100 } },
    touchHistory,
  );
  expect(startEvent.touchHistory).toEqual({
    touchBank: [
      {
        touchActive: true,
        startPageX: 10,
        startPageY: 20,
        startTimeStamp: 100,
        currentPageX: 10,
        currentPageY: 20,
        currentTimeStamp: 100,
        previousPageX: 10,
        previousPageY: 20,
        previousTimeStamp: 100,
      },
    ],
    numberActiveTouches: 1,
    indexOfSingleActiveTouch: 0,
    mostRecentTimeStamp: 100,
  });

  const endEvent = createPressabilityEvent(
    'pressOut',
    { nativeEvent: { pageX: 15, pageY: 25, timestamp: 200 } },
    touchHistory,
  );
  expect(endEvent.touchHistory).toBe(startEvent.touchHistory);
  expect(endEvent.touchHistory).toEqual({
    touchBank: [
      {
        touchActive: false,
        startPageX: 10,
        startPageY: 20,
        startTimeStamp: 100,
        currentPageX: 15,
        currentPageY: 25,
        currentTimeStamp: 200,
        previousPageX: 10,
        previousPageY: 20,
        previousTimeStamp: 100,
      },
    ],
    numberActiveTouches: 0,
    indexOfSingleActiveTouch: 0,
    mostRecentTimeStamp: 200,
  });
});

test('records a whole touch for a touch end without a touch start', () => {
  const event = createPressabilityEvent('press', { nativeEvent: { timestamp: 100 } });

  expect(event.touchHistory.touchBank[0]).toMatchObject({
    touchActive: false,
    startTimeStamp: 100,
    currentTimeStamp: 100,
  });
  expect(event.touchHistory.numberActiveTouches).toBe(0);
});

test('skips touches without a valid identifier in the touch history', () => {
  const event = createPressabilityEvent('pressIn', {
    nativeEvent: { changedTouches: [{ pageX: 1 }], touches: [] },
  });

  expect(event.touchHistory.touchBank).toEqual([]);
});
