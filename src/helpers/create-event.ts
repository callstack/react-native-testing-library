// Based on: https://reactnative.dev/docs/pressevent#example
export const defaultPressEvent = {
  changedTouches: [],
  identifier: 0,
  locationX: 0,
  locationY: 0,
  pageX: 0,
  pageY: 0,
  targe: 0,
  timestamp: 0,
  touches: [],
};

// Based on: https://reactnative.dev/docs/scrollview#onscroll
export const defaultScrollEvent = {
  contentInset: { bottom: 0, left: 0, right: 0, top: 0 },
  contentOffset: { x: 0, y: 0 },
  contentSize: { height: 0, width: 0 },
  layoutMeasurement: { height: 0, width: 0 },
  zoomScale: 0,
};

const eventMap: Record<string, object> = {
  press: { ...defaultPressEvent },
  scroll: { ...defaultScrollEvent },
};

export function createEvent(eventName: string, eventInit?: object) {
  return {
    nativeEvent: {
      ...eventMap[eventName],
      ...eventInit,
    },
  };
}
