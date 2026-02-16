import {
  buildTouchEvent,
  buildResponderGrantEvent,
  buildResponderReleaseEvent,
  buildFocusEvent,
  buildBlurEvent,
} from '../common';

test('buildTouchEvent returns event with touch nativeEvent', () => {
  const event = buildTouchEvent();

  expect(event.nativeEvent).toEqual({
    changedTouches: [],
    identifier: 0,
    locationX: 0,
    locationY: 0,
    pageX: 0,
    pageY: 0,
    target: 0,
    timestamp: expect.any(Number),
    touches: [],
  });
  expect(event.currentTarget).toHaveProperty('measure');
  expect(event).toHaveProperty('preventDefault');
});

test('buildResponderGrantEvent returns touch event with dispatchConfig', () => {
  const event = buildResponderGrantEvent();

  expect(event.dispatchConfig).toEqual({
    registrationName: 'onResponderGrant',
  });
  expect(event.nativeEvent).toHaveProperty('touches');
});

test('buildResponderReleaseEvent returns touch event with dispatchConfig', () => {
  const event = buildResponderReleaseEvent();

  expect(event.dispatchConfig).toEqual({
    registrationName: 'onResponderRelease',
  });
  expect(event.nativeEvent).toHaveProperty('touches');
});

test('buildFocusEvent returns event with target', () => {
  const event = buildFocusEvent();

  expect(event.nativeEvent).toEqual({ target: 0 });
  expect(event).toHaveProperty('preventDefault');
});

test('buildBlurEvent returns event with target', () => {
  const event = buildBlurEvent();

  expect(event.nativeEvent).toEqual({ target: 0 });
  expect(event).toHaveProperty('preventDefault');
});
