import * as eventBuilder from '..';

test('re-exports all event builders', () => {
  expect(eventBuilder.baseSyntheticEvent).toBeInstanceOf(Function);
  expect(eventBuilder.wrapNativeEvent).toBeInstanceOf(Function);
  expect(eventBuilder.buildTouchEvent).toBeInstanceOf(Function);
  expect(eventBuilder.buildResponderGrantEvent).toBeInstanceOf(Function);
  expect(eventBuilder.buildResponderReleaseEvent).toBeInstanceOf(Function);
  expect(eventBuilder.mergeEventProps).toBeInstanceOf(Function);
});
