import { baseSyntheticEvent } from '../base';

test('returns object with all required properties and default values', () => {
  const event = baseSyntheticEvent();

  expect(event.currentTarget).toEqual({});
  expect(event.target).toEqual({});
  expect(event.timeStamp).toBe(0);
  expect(event.isDefaultPrevented?.()).toBe(false);
  expect(event.isPropagationStopped?.()).toBe(false);
  expect(event.isPersistent?.()).toBe(false);
  expect(typeof event.stopPropagation).toBe('function');
  expect(typeof event.preventDefault).toBe('function');
  expect(typeof event.persist).toBe('function');
});

test('returns a new object instance on each call', () => {
  const event1 = baseSyntheticEvent();
  const event2 = baseSyntheticEvent();

  expect(event1).not.toBe(event2);
  expect(event1.currentTarget).not.toBe(event2.currentTarget);
  expect(event1.target).not.toBe(event2.target);
});

test('can be spread into other objects', () => {
  const extendedEvent = {
    ...baseSyntheticEvent(),
    nativeEvent: { test: 'value' },
  };

  expect(extendedEvent).toHaveProperty('currentTarget');
  expect(extendedEvent).toHaveProperty('preventDefault');
  expect(extendedEvent.nativeEvent).toEqual({ test: 'value' });
});
