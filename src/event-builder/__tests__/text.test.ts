import {
  buildTextChangeEvent,
  buildKeyPressEvent,
  buildSubmitEditingEvent,
  buildEndEditingEvent,
  buildTextSelectionChangeEvent,
  buildContentSizeChangeEvent,
} from '../text';

test('buildTextChangeEvent returns event with text', () => {
  const event = buildTextChangeEvent('Hello');

  expect(event.nativeEvent).toEqual({ text: 'Hello', target: 0, eventCount: 0 });
});

test('buildKeyPressEvent returns event with key', () => {
  const event = buildKeyPressEvent('a');

  expect(event.nativeEvent).toEqual({ key: 'a' });
});

test('buildSubmitEditingEvent returns event with text', () => {
  const event = buildSubmitEditingEvent('Hello');

  expect(event.nativeEvent).toEqual({ text: 'Hello', target: 0 });
});

test('buildEndEditingEvent returns event with text', () => {
  const event = buildEndEditingEvent('Hello');

  expect(event.nativeEvent).toEqual({ text: 'Hello', target: 0 });
});

test('buildTextSelectionChangeEvent returns event with selection', () => {
  const event = buildTextSelectionChangeEvent({ start: 0, end: 4 });

  expect(event.nativeEvent).toEqual({ selection: { start: 0, end: 4 } });
});

test('buildContentSizeChangeEvent returns event with contentSize', () => {
  const event = buildContentSizeChangeEvent({ width: 100, height: 50 });

  expect(event.nativeEvent).toEqual({
    contentSize: { width: 100, height: 50 },
    target: 0,
  });
});
