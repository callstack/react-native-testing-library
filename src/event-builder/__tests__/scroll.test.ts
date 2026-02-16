import { buildScrollEvent } from '../scroll';

test('buildScrollEvent returns default scroll event', () => {
  const event = buildScrollEvent();

  expect(event.nativeEvent).toEqual({
    contentInset: { bottom: 0, left: 0, right: 0, top: 0 },
    contentOffset: { y: 0, x: 0 },
    contentSize: { height: 0, width: 0 },
    layoutMeasurement: { height: 0, width: 0 },
    responderIgnoreScroll: true,
    target: 0,
    velocity: { y: 0, x: 0 },
  });
});

test('buildScrollEvent uses provided offset', () => {
  const event = buildScrollEvent({ y: 100, x: 50 });

  expect(event.nativeEvent.contentOffset).toEqual({ y: 100, x: 50 });
});

test('buildScrollEvent uses provided options', () => {
  const event = buildScrollEvent({ y: 0, x: 0 }, {
    contentSize: { height: 1000, width: 400 },
    layoutMeasurement: { height: 800, width: 400 },
  });

  expect(event.nativeEvent.contentSize).toEqual({ height: 1000, width: 400 });
  expect(event.nativeEvent.layoutMeasurement).toEqual({ height: 800, width: 400 });
});
