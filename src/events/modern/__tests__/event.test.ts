import { format } from 'pretty-format';
import type { TestInstance } from 'test-renderer';

import { createEvent, getEventInternals, SyntheticEvent } from '../event';
import type { EventTypeConfig } from '../event-types';

const typeConfig: EventTypeConfig = { kind: 'direct', handlerName: 'onFocus' };

afterEach(() => {
  jest.restoreAllMocks();
});

test('exposes init values', () => {
  const nativeEvent = { target: 1 };
  const event = new SyntheticEvent(
    'layout',
    { cancelable: true, timeStamp: 123 },
    nativeEvent,
    typeConfig,
  );

  expect(event.type).toBe('layout');
  expect(event.bubbles).toBe(false);
  expect(event.cancelable).toBe(true);
  expect(event.rnIsDirect).toBe(true);
  expect(event.timeStamp).toBe(123);
  expect(event.nativeEvent).toBe(nativeEvent);
  expect(event.dispatchConfig).toEqual({ registrationName: 'onFocus' });
  expect(event.isTrusted).toBe(true);
});

test('has no target and phase outside of dispatch', () => {
  const event = new SyntheticEvent('focus', {}, {}, typeConfig);

  expect(event.target).toBeNull();
  expect(event.currentTarget).toBeNull();
  expect(event.eventPhase).toBe(SyntheticEvent.NONE);
  expect(event.composedPath()).toEqual([]);
});

test('keeps dispatch fields out of printed and compared events', () => {
  const event = new SyntheticEvent('focus', { timeStamp: 1 }, {}, typeConfig);
  const target = { type: 'View', props: { testID: 'target' } } as unknown as TestInstance;
  getEventInternals(event).target = target;

  expect(event.target).toBe(target);
  expect(event).toEqual(new SyntheticEvent('focus', { timeStamp: 1 }, {}, typeConfig));
  expect(format(event)).not.toContain('target');
});

test('defaults timeStamp to performance.now()', () => {
  jest.spyOn(performance, 'now').mockReturnValue(456);

  const event = new SyntheticEvent('focus', {}, {}, typeConfig);

  expect(event.timeStamp).toBe(456);
});

test('preventDefault() marks cancelable event as default prevented', () => {
  const event = new SyntheticEvent('focus', { cancelable: true }, {}, typeConfig);

  event.preventDefault();

  expect(event.defaultPrevented).toBe(true);
  expect(event.isDefaultPrevented()).toBe(true);
});

test('preventDefault() does nothing on non-cancelable event', () => {
  const event = new SyntheticEvent('focus', {}, {}, typeConfig);

  event.preventDefault();

  expect(event.defaultPrevented).toBe(false);
  expect(event.isDefaultPrevented()).toBe(false);
});

test.each(['stopPropagation', 'stopImmediatePropagation'] as const)(
  '%s() stops propagation',
  (method) => {
    const event = new SyntheticEvent('focus', {}, {}, typeConfig);
    expect(event.isPropagationStopped()).toBe(false);

    event[method]();

    expect(event.isPropagationStopped()).toBe(true);
    expect(event.cancelBubble).toBe(true);
  },
);

test('cancelBubble can only be set to true', () => {
  const event = new SyntheticEvent('focus', {}, {}, typeConfig);

  event.cancelBubble = true;
  event.cancelBubble = false;

  expect(event.isPropagationStopped()).toBe(true);
});

test('persist() is a no-op', () => {
  const event = new SyntheticEvent('focus', {}, {}, typeConfig);

  expect(() => event.persist()).not.toThrow();
});

test('defines event phase constants on class and prototype', () => {
  const event = new SyntheticEvent('focus', {}, {}, typeConfig);

  expect([
    SyntheticEvent.NONE,
    SyntheticEvent.CAPTURING_PHASE,
    SyntheticEvent.AT_TARGET,
    SyntheticEvent.BUBBLING_PHASE,
  ]).toEqual([0, 1, 2, 3]);
  expect([event.NONE, event.CAPTURING_PHASE, event.AT_TARGET, event.BUBBLING_PHASE]).toEqual([
    0, 1, 2, 3,
  ]);
  expect(Object.keys(event)).not.toContain('NONE');
});

describe('createEvent()', () => {
  test('creates bubbling event', () => {
    const nativeEvent = { pageX: 10, timestamp: 1234 };

    const event = createEvent('pointerUp', { nativeEvent });

    expect(event).toBeInstanceOf(SyntheticEvent);
    expect(event?.type).toBe('pointerup');
    expect(event?.bubbles).toBe(true);
    expect(event?.cancelable).toBe(true);
    expect(event?.rnIsDirect).toBe(false);
    expect(event?.nativeEvent).toBe(nativeEvent);
    expect(event?.timeStamp).toBe(1234);
    expect(event?.dispatchConfig).toEqual({
      phasedRegistrationNames: { bubbled: 'onPointerUp', captured: 'onPointerUpCapture' },
    });
  });

  test('creates non-bubbling event for skipBubbling event types', () => {
    const event = createEvent('pointerEnter');

    expect(event?.bubbles).toBe(false);
    expect(event?.rnIsDirect).toBe(false);
    expect(event?.dispatchConfig).toEqual({
      phasedRegistrationNames: {
        bubbled: 'onPointerEnter',
        captured: 'onPointerEnterCapture',
        skipBubbling: true,
      },
    });
  });

  test('creates direct event', () => {
    const event = createEvent('layout');

    expect(event?.type).toBe('layout');
    expect(event?.bubbles).toBe(false);
    expect(event?.rnIsDirect).toBe(true);
    expect(event?.dispatchConfig).toEqual({ registrationName: 'onLayout' });
  });

  test('defaults nativeEvent to an empty object', () => {
    expect(createEvent('focus')?.nativeEvent).toEqual({});
  });

  test.each([
    [{ nativeEvent: { timeStamp: 1 } }, 1],
    [{ nativeEvent: { timestamp: 2 } }, 2],
    [{ nativeEvent: { timeStamp: 1, timestamp: 2 } }, 1],
    [{ nativeEvent: { timeStamp: 1, timestamp: 2 }, timeStamp: 3 }, 3],
    [{ nativeEvent: { timestamp: 'later' } }, 456],
  ])('takes timeStamp from %p', (init, timeStamp) => {
    jest.spyOn(performance, 'now').mockReturnValue(456);

    expect(createEvent('focus', init)?.timeStamp).toBe(timeStamp);
  });

  test('returns null for events unknown to React Native', () => {
    expect(createEvent('changeText', { nativeEvent: { text: 'Hello' } })).toBeNull();
  });
});
