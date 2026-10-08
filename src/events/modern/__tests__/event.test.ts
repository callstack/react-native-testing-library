import { SyntheticEvent } from '../event';

test('exposes init values', () => {
  const nativeEvent = { target: 1 };
  const dispatchConfig = { registrationName: 'onLayout' };
  const event = new SyntheticEvent(
    'layout',
    { cancelable: true, rnIsDirect: true, timeStamp: 123 },
    nativeEvent,
    dispatchConfig,
  );

  expect(event.type).toBe('layout');
  expect(event.bubbles).toBe(false);
  expect(event.cancelable).toBe(true);
  expect(event.composed).toBe(false);
  expect(event.rnIsDirect).toBe(true);
  expect(event.timeStamp).toBe(123);
  expect(event.nativeEvent).toBe(nativeEvent);
  expect(event.dispatchConfig).toBe(dispatchConfig);
});

test('has no target and phase outside of dispatch', () => {
  const event = new SyntheticEvent('focus', { bubbles: true }, {});

  expect(event.target).toBeNull();
  expect(event.currentTarget).toBeNull();
  expect(event.eventPhase).toBe(SyntheticEvent.NONE);
  expect(event.composedPath()).toEqual([]);
  expect(event.isTrusted).toBe(false);
  expect(event.dispatchConfig).toBeNull();
});

test('defaults timeStamp to performance.now()', () => {
  jest.spyOn(performance, 'now').mockReturnValue(456);

  const event = new SyntheticEvent('focus', {}, {});

  expect(event.timeStamp).toBe(456);
});

test('throws when direct event bubbles', () => {
  expect(() => new SyntheticEvent('layout', { bubbles: true, rnIsDirect: true }, {})).toThrow(
    "'rnIsDirect' cannot be true when 'bubbles' is also true",
  );
});

test('preventDefault() marks cancelable event as default prevented', () => {
  const event = new SyntheticEvent('focus', { cancelable: true }, {});

  event.preventDefault();

  expect(event.defaultPrevented).toBe(true);
  expect(event.isDefaultPrevented()).toBe(true);
});

test('preventDefault() does nothing on non-cancelable event', () => {
  const event = new SyntheticEvent('focus', {}, {});

  event.preventDefault();

  expect(event.defaultPrevented).toBe(false);
  expect(event.isDefaultPrevented()).toBe(false);
});

test.each(['stopPropagation', 'stopImmediatePropagation'] as const)(
  '%s() stops propagation',
  (method) => {
    const event = new SyntheticEvent('focus', {}, {});
    expect(event.isPropagationStopped()).toBe(false);

    event[method]();

    expect(event.isPropagationStopped()).toBe(true);
    expect(event.cancelBubble).toBe(true);
  },
);

test('cancelBubble can only be set to true', () => {
  const event = new SyntheticEvent('focus', {}, {});

  event.cancelBubble = true;
  event.cancelBubble = false;

  expect(event.isPropagationStopped()).toBe(true);
});

test('persist() is a no-op', () => {
  const event = new SyntheticEvent('focus', {}, {});

  expect(() => event.persist()).not.toThrow();
});

test('defines event phase constants on class and prototype', () => {
  const event = new SyntheticEvent('focus', {}, {});

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
