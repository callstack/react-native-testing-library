import { baseSyntheticEvent } from './base';

/**
 * Experimental values:
 * - iOS: `{"changedTouches": [[Circular]], "identifier": 1, "locationX": 253, "locationY": 30.333328247070312, "pageX": 273, "pageY": 141.3333282470703, "target": 75, "timestamp": 875928682.0450834, "touches": [[Circular]]}`
 * - Android: `{"changedTouches": [[Circular]], "identifier": 0, "locationX": 160, "locationY": 40.3636360168457, "pageX": 180, "pageY": 140.36363220214844, "target": 53, "targetSurface": -1, "timestamp": 10290805, "touches": [[Circular]]}`
 */
export function buildTouchEvent() {
  return {
    ...baseSyntheticEvent(),
    nativeEvent: {
      changedTouches: [] as unknown[],
      identifier: 0,
      locationX: 0,
      locationY: 0,
      pageX: 0,
      pageY: 0,
      target: 0,
      timestamp: Date.now(),
      touches: [] as unknown[],
    },
    currentTarget: { measure: () => {} },
  };
}

export type TouchEvent = ReturnType<typeof buildTouchEvent>;

export function buildResponderGrantEvent() {
  return {
    ...buildTouchEvent(),
    dispatchConfig: { registrationName: 'onResponderGrant' },
  };
}

export function buildResponderReleaseEvent() {
  return {
    ...buildTouchEvent(),
    dispatchConfig: { registrationName: 'onResponderRelease' },
  };
}

/**
 * Experimental values:
 * - iOS: `{"eventCount": 0, "target": 75, "text": ""}`
 * - Android: `{"target": 53}`
 */
export function buildFocusEvent() {
  return {
    ...baseSyntheticEvent(),
    nativeEvent: {
      target: 0,
    },
  };
}

/**
 * Experimental values:
 * - iOS: `{"eventCount": 0, "target": 75, "text": ""}`
 * - Android: `{"target": 53}`
 */
export function buildBlurEvent() {
  return {
    ...baseSyntheticEvent(),
    nativeEvent: {
      target: 0,
    },
  };
}

/**
 * Builds an accessibility action event, as delivered to the `onAccessibilityAction`
 * handler when an assistive technology triggers an action.
 *
 * Experimental values:
 * - `{"actionName": "increment"}`
 */
export function buildAccessibilityActionEvent(actionName: string) {
  return {
    ...baseSyntheticEvent(),
    nativeEvent: {
      actionName,
    },
  };
}

/**
 * Layout rectangle of an element, as measured by the layout engine.
 */
export interface LayoutRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Builds a layout event, as delivered to the `onLayout` handler when an element's
 * size or position is measured by the layout engine.
 *
 * The passed `layout` values are merged onto a zeroed rectangle, so only the
 * fields relevant to the test need to be provided.
 */
export function buildLayoutEvent(layout?: Partial<LayoutRectangle>) {
  return {
    ...baseSyntheticEvent(),
    nativeEvent: {
      layout: { x: 0, y: 0, width: 0, height: 0, ...layout },
      target: 0,
    },
  };
}
