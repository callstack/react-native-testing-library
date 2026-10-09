import type { Point, Size, TextRange } from '../../types';
import type { LayoutRectangle } from './types';

/**
 * `nativeEvent` payloads, matching what React Native sends on a device. Both event systems use them:
 * legacy wraps them in a stub event (`legacy/builders/`), modern in a `SyntheticEvent`.
 */

/**
 * Experimental values:
 * - iOS: `{"changedTouches": [[Circular]], "identifier": 1, "locationX": 253, "locationY": 30.333328247070312, "pageX": 273, "pageY": 141.3333282470703, "target": 75, "timestamp": 875928682.0450834, "touches": [[Circular]]}`
 * - Android: `{"changedTouches": [[Circular]], "identifier": 0, "locationX": 160, "locationY": 40.3636360168457, "pageX": 180, "pageY": 140.36363220214844, "target": 53, "targetSurface": -1, "timestamp": 10290805, "touches": [[Circular]]}`
 */
export function buildTouchNativeEvent() {
  return {
    changedTouches: [] as unknown[],
    identifier: 0,
    locationX: 0,
    locationY: 0,
    pageX: 0,
    pageY: 0,
    target: 0,
    timestamp: Date.now(),
    touches: [] as unknown[],
  };
}

/**
 * Experimental values:
 * - iOS: `{"eventCount": 0, "target": 75, "text": ""}`
 * - Android: `{"target": 53}`
 */
export function buildFocusNativeEvent() {
  return { target: 0 };
}

/**
 * Experimental values:
 * - iOS: `{"eventCount": 0, "target": 75, "text": ""}`
 * - Android: `{"target": 53}`
 */
export function buildBlurNativeEvent() {
  return { target: 0 };
}

/**
 * Delivered to `onAccessibilityAction` when an assistive technology triggers an action.
 *
 * Experimental values:
 * - `{"actionName": "increment"}`
 */
export function buildAccessibilityActionNativeEvent(actionName: string) {
  return { actionName };
}

/**
 * Delivered to `onLayout` when the layout engine measures an element. The passed `layout` values
 * are merged onto a zeroed rectangle, so only the fields relevant to the test need to be provided.
 */
export function buildLayoutNativeEvent(layout?: Partial<LayoutRectangle>) {
  return {
    // `??` rather than spread, so that explicit `undefined` values fall back to `0`.
    layout: {
      x: layout?.x ?? 0,
      y: layout?.y ?? 0,
      width: layout?.width ?? 0,
      height: layout?.height ?? 0,
    },
    target: 0,
  };
}

export type ScrollNativeEventOptions = {
  contentSize?: Size;
  layoutMeasurement?: Size;
};

/**
 * Experimental values:
 * - iOS: `{"contentInset": {"bottom": 0, "left": 0, "right": 0, "top": 0}, "contentOffset": {"x": 0, "y": 5.333333333333333}, "contentSize": {"height": 1676.6666259765625, "width": 390}, "layoutMeasurement": {"height": 753, "width": 390}, "zoomScale": 1}`
 * - Android: `{"contentInset": {"bottom": 0, "left": 0, "right": 0, "top": 0}, "contentOffset": {"x": 0, "y": 31.619047164916992}, "contentSize": {"height": 1624.761962890625, "width": 411.4285583496094}, "layoutMeasurement": {"height": 785.5238037109375, "width": 411.4285583496094}, "responderIgnoreScroll": true, "target": 139, "velocity": {"x": -1.3633992671966553, "y": -1.3633992671966553}}`
 */
export function buildScrollNativeEvent(
  offset: Point = { y: 0, x: 0 },
  options?: ScrollNativeEventOptions,
) {
  return {
    contentInset: { bottom: 0, left: 0, right: 0, top: 0 },
    contentOffset: { y: offset.y, x: offset.x },
    contentSize: {
      height: options?.contentSize?.height ?? 0,
      width: options?.contentSize?.width ?? 0,
    },
    layoutMeasurement: {
      height: options?.layoutMeasurement?.height ?? 0,
      width: options?.layoutMeasurement?.width ?? 0,
    },
    responderIgnoreScroll: true,
    target: 0,
    velocity: { y: 0, x: 0 },
  };
}

/**
 * Experimental values:
 * - iOS: `{"eventCount": 4, "target": 75, "text": "Test"}`
 * - Android: `{"eventCount": 6, "target": 53, "text": "Tes"}`
 */
export function buildTextChangeNativeEvent(text: string, { start, end }: TextRange) {
  return { text, target: 0, eventCount: 0, selection: { start, end } };
}

/**
 * Experimental values:
 * - iOS: `{"eventCount": 3, "key": "a", "target": 75}`
 * - Android: `{"key": "a"}`
 */
export function buildKeyPressNativeEvent(key: string) {
  return { key };
}

/**
 * Experimental values:
 * - iOS: `{"eventCount": 4, "target": 75, "text": "Test"}`
 * - Android: `{"target": 53, "text": "Test"}`
 */
export function buildSubmitEditingNativeEvent(text: string) {
  return { text, target: 0 };
}

/**
 * Experimental values:
 * - iOS: `{"eventCount": 4, "target": 75, "text": "Test"}`
 * - Android: `{"target": 53, "text": "Test"}`
 */
export function buildEndEditingNativeEvent(text: string) {
  return { text, target: 0 };
}

/**
 * Experimental values:
 * - iOS: `{"selection": {"end": 4, "start": 4}, "target": 75}`
 * - Android: `{"selection": {"end": 4, "start": 4}}`
 */
export function buildTextSelectionChangeNativeEvent({ start, end }: TextRange) {
  return { selection: { start, end } };
}

/**
 * Experimental values:
 * - iOS: `{"contentSize": {"height": 21.666666666666668, "width": 11.666666666666666}, "target": 75}`
 * - Android: `{"contentSize": {"height": 61.45454406738281, "width": 352.7272644042969}, "target": 53}`
 */
export function buildContentSizeChangeNativeEvent({ width, height }: Size) {
  return { contentSize: { width, height }, target: 0 };
}
