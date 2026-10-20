/** `ScrollView` scroll event types, which all carry a scroll payload. */
export const SCROLL_EVENT_TYPES = [
  'scroll',
  'scrollBeginDrag',
  'scrollEndDrag',
  'momentumScrollBegin',
  'momentumScrollEnd',
] as const;

export type ScrollEventType = (typeof SCROLL_EVENT_TYPES)[number];

/** Whether the event type is a `ScrollView` scroll event (`scroll`, `scrollBeginDrag`, ...). */
export function isScrollEventType(eventType: string): eventType is ScrollEventType {
  return (SCROLL_EVENT_TYPES as readonly string[]).includes(eventType);
}

/** Touch event types, with whether the touch is still active after each. */
const TOUCH_EVENT_TYPES: Readonly<Record<string, boolean>> = {
  touchStart: true,
  touchMove: true,
  touchEnd: false,
  touchCancel: false,
};

/** Whether the event type is a native touch event (`touchStart`, `touchMove`, ...). */
export function isTouchEventType(eventType: string): boolean {
  return Object.hasOwn(TOUCH_EVENT_TYPES, eventType);
}

/** Whether the touch is still active after a touch event of this type. */
export function isActiveTouchEventType(eventType: string): boolean {
  return TOUCH_EVENT_TYPES[eventType] === true;
}
