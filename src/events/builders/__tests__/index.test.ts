import * as eventBuilder from '..';

test('re-exports all event builders', () => {
  expect(eventBuilder.buildTouchEvent).toBeInstanceOf(Function);
  expect(eventBuilder.buildResponderGrantEvent).toBeInstanceOf(Function);
  expect(eventBuilder.buildResponderReleaseEvent).toBeInstanceOf(Function);
  expect(eventBuilder.buildFocusEvent).toBeInstanceOf(Function);
  expect(eventBuilder.buildBlurEvent).toBeInstanceOf(Function);
  expect(eventBuilder.buildScrollEvent).toBeInstanceOf(Function);
  expect(eventBuilder.buildTextChangeEvent).toBeInstanceOf(Function);
  expect(eventBuilder.buildKeyPressEvent).toBeInstanceOf(Function);
  expect(eventBuilder.buildSubmitEditingEvent).toBeInstanceOf(Function);
  expect(eventBuilder.buildEndEditingEvent).toBeInstanceOf(Function);
  expect(eventBuilder.buildTextSelectionChangeEvent).toBeInstanceOf(Function);
  expect(eventBuilder.buildContentSizeChangeEvent).toBeInstanceOf(Function);
});
