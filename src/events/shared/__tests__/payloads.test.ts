import {
  buildAccessibilityActionNativeEvent,
  buildBlurNativeEvent,
  buildContentSizeChangeNativeEvent,
  buildEndEditingNativeEvent,
  buildFocusNativeEvent,
  buildKeyPressNativeEvent,
  buildLayoutNativeEvent,
  buildScrollNativeEvent,
  buildSubmitEditingNativeEvent,
  buildTextChangeNativeEvent,
  buildTextSelectionChangeNativeEvent,
  buildTouchNativeEvent,
} from '../payloads';

test('buildTouchNativeEvent returns touch payload', () => {
  expect(buildTouchNativeEvent()).toEqual({
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
});

test('buildFocusNativeEvent and buildBlurNativeEvent return target', () => {
  expect(buildFocusNativeEvent()).toEqual({ target: 0 });
  expect(buildBlurNativeEvent()).toEqual({ target: 0 });
});

test('buildAccessibilityActionNativeEvent returns action name', () => {
  expect(buildAccessibilityActionNativeEvent('increment')).toEqual({ actionName: 'increment' });
});

test('buildLayoutNativeEvent merges layout onto zeroed rectangle', () => {
  expect(buildLayoutNativeEvent()).toEqual({
    layout: { x: 0, y: 0, width: 0, height: 0 },
    target: 0,
  });
  expect(buildLayoutNativeEvent({ width: 100, x: undefined })).toEqual({
    layout: { x: 0, y: 0, width: 100, height: 0 },
    target: 0,
  });
});

test('buildScrollNativeEvent returns default scroll payload', () => {
  expect(buildScrollNativeEvent()).toEqual({
    contentInset: { bottom: 0, left: 0, right: 0, top: 0 },
    contentOffset: { y: 0, x: 0 },
    contentSize: { height: 0, width: 0 },
    layoutMeasurement: { height: 0, width: 0 },
    responderIgnoreScroll: true,
    target: 0,
    velocity: { y: 0, x: 0 },
  });
});

test('buildScrollNativeEvent uses provided offset and options', () => {
  const nativeEvent = buildScrollNativeEvent(
    { y: 100, x: 50 },
    {
      contentSize: { height: 1000, width: 400 },
      layoutMeasurement: { height: 800, width: 400 },
    },
  );

  expect(nativeEvent.contentOffset).toEqual({ y: 100, x: 50 });
  expect(nativeEvent.contentSize).toEqual({ height: 1000, width: 400 });
  expect(nativeEvent.layoutMeasurement).toEqual({ height: 800, width: 400 });
});

test('buildTextChangeNativeEvent returns text and selection', () => {
  expect(buildTextChangeNativeEvent('Hello', { start: 5, end: 5 })).toEqual({
    text: 'Hello',
    target: 0,
    eventCount: 0,
    selection: { start: 5, end: 5 },
  });
});

test('buildKeyPressNativeEvent returns key', () => {
  expect(buildKeyPressNativeEvent('a')).toEqual({ key: 'a' });
});

test('buildSubmitEditingNativeEvent and buildEndEditingNativeEvent return text', () => {
  expect(buildSubmitEditingNativeEvent('Hello')).toEqual({ text: 'Hello', target: 0 });
  expect(buildEndEditingNativeEvent('Hello')).toEqual({ text: 'Hello', target: 0 });
});

test('buildTextSelectionChangeNativeEvent returns selection', () => {
  expect(buildTextSelectionChangeNativeEvent({ start: 0, end: 4 })).toEqual({
    selection: { start: 0, end: 4 },
  });
});

test('buildContentSizeChangeNativeEvent returns content size', () => {
  expect(buildContentSizeChangeNativeEvent({ width: 100, height: 50 })).toEqual({
    contentSize: { width: 100, height: 50 },
    target: 0,
  });
});
