import { configure } from '../..';
import {
  buildAccessibilityActionEvent,
  buildBlurEvent,
  buildContentSizeChangeEvent,
  buildEndEditingEvent,
  createEvent,
  buildFocusEvent,
  buildKeyPressEvent,
  buildPressEvent,
  buildScrollEvent,
  buildSubmitEditingEvent,
  buildTextChangeEvent,
  buildTextSelectionChangeEvent,
} from '../create-event';
import { SyntheticEvent } from '../modern/event';

afterEach(() => {
  jest.restoreAllMocks();
});

test('builds a legacy event object in the legacy event system', () => {
  configure({ unstable_eventSystem: 'legacy' });
  const nativeEvent = { target: 0 };

  const event = createEvent('focus', nativeEvent);

  expect(event).not.toBeInstanceOf(SyntheticEvent);
  expect(event).toMatchObject({ nativeEvent, timeStamp: 0, preventDefault: expect.any(Function) });
});

test('builds a SyntheticEvent in the modern event system', () => {
  configure({ unstable_eventSystem: 'modern' });
  const nativeEvent = { target: 0 };

  const event = createEvent('focus', nativeEvent);

  expect(event).toBeInstanceOf(SyntheticEvent);
  expect(event.nativeEvent).toBe(nativeEvent);
  expect(event.type).toBe('focus');
});

test.each(['legacy', 'modern'] as const)(
  'throws for event types that are not native in the %s event system',
  (eventSystem) => {
    configure({ unstable_eventSystem: eventSystem });

    expect(() => createEvent('changeText', {})).toThrow(
      '"changeText" is not a native event type. Use invokeEventHandler() instead.',
    );
  },
);

test.each([
  ['press', () => buildPressEvent()],
  ['focus', () => buildFocusEvent()],
  ['blur', () => buildBlurEvent()],
  ['accessibilityaction', () => buildAccessibilityActionEvent('increment')],
  ['momentumscrollend', () => buildScrollEvent('momentumScrollEnd', { x: 0, y: 100 })],
  ['change', () => buildTextChangeEvent('Hello', { start: 5, end: 5 })],
  ['keypress', () => buildKeyPressEvent('a')],
  ['submitediting', () => buildSubmitEditingEvent('Hello')],
  ['endediting', () => buildEndEditingEvent('Hello')],
  ['selectionchange', () => buildTextSelectionChangeEvent({ start: 0, end: 5 })],
  ['contentsizechange', () => buildContentSizeChangeEvent({ width: 100, height: 20 })],
])('builds %s event for the configured event system', (type, build) => {
  // The touch payload has a `Date.now()` timestamp.
  jest.spyOn(Date, 'now').mockReturnValue(1);
  configure({ unstable_eventSystem: 'legacy' });
  const legacyEvent = build();
  configure({ unstable_eventSystem: 'modern' });
  const modernEvent = build();

  expect(legacyEvent).not.toBeInstanceOf(SyntheticEvent);
  expect(modernEvent).toBeInstanceOf(SyntheticEvent);
  expect(modernEvent.type).toBe(type);
  expect(modernEvent.nativeEvent).toEqual(legacyEvent.nativeEvent);
});

test('buildScrollEvent passes its arguments to the native event', () => {
  expect(buildScrollEvent('scroll', { x: 0, y: 100 }).nativeEvent).toMatchObject({
    contentOffset: { x: 0, y: 100 },
  });
});
