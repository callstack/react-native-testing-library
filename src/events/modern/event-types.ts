import { getEventHandlerName } from '../shared/handler';

/**
 * Event types known to React Native, without the `top` prefix (`focus`, not `topFocus`).
 *
 * `@react-native/jest-preset` mocks native components, so React Native's view config registry stays
 * empty in Jest. These are static copies of the union of `BaseViewConfig.{ios,android}.js` and the
 * built-in components' view configs. `__tests__/event-types.test.ts` checks them against the
 * installed `react-native`.
 */

export const BUBBLING_EVENT_TYPES: readonly string[] = [
  'blur',
  'change',
  'click',
  'endEditing',
  'focus',
  'gotPointerCapture',
  'keyDown',
  'keyPress',
  'keyUp',
  'lostPointerCapture',
  'pointerCancel',
  'pointerDown',
  'pointerEnter',
  'pointerLeave',
  'pointerMove',
  'pointerOut',
  'pointerOver',
  'pointerUp',
  'press',
  'select',
  'submitEditing',
  'touchCancel',
  'touchEnd',
  'touchMove',
  'touchStart',
];

/** Bubbling events that run the capture phase as usual, but call only the target when bubbling. */
export const SKIP_BUBBLING_EVENT_TYPES: readonly string[] = ['pointerEnter', 'pointerLeave'];

export const DIRECT_EVENT_TYPES: readonly string[] = [
  'accessibilityAction',
  'accessibilityEscape',
  'accessibilityTap',
  'changeSync',
  'contentSizeChange',
  'dismiss',
  'drawerClose',
  'drawerOpen',
  'drawerSlide',
  'drawerStateChanged',
  'error',
  'keyPressSync',
  'layout',
  'load',
  'loadEnd',
  'loadStart',
  'loadingError',
  'loadingFinish',
  'loadingStart',
  'magicTap',
  'message',
  'modeChange',
  'momentumScrollBegin',
  'momentumScrollEnd',
  'orientationChange',
  'partialLoad',
  'progress',
  'refresh',
  'requestClose',
  'safeAreaInsetsChange',
  'scroll',
  'scrollBeginDrag',
  'scrollEndDrag',
  'scrollToTop',
  'selectionChange',
  'show',
  // From the inline view config in `TextNativeComponent.js`, which is not exported.
  'textLayout',
];

/**
 * Direct events whose handler prop doesn't follow the `on` + event type pattern.
 */
const DIRECT_EVENT_HANDLER_NAMES: Readonly<Record<string, string>> = {
  // Added in React Native 0.89.
  safeAreaInsetsChange: 'experimental_onSafeAreaInsetsChange',
};

/** Capture phase from the root to the target, then bubble phase back to the root. */
type BubblingEventTypeConfig = {
  kind: 'bubbling';
  /** Bubble phase prop, e.g. `onFocus`. */
  handlerName: string;
  /** Capture phase prop, e.g. `onFocusCapture`. */
  captureHandlerName: string;
  /** Runs the capture phase as usual, but calls only the target when bubbling. */
  skipBubbling: boolean;
};

/** Calls only the target's prop, without the capture phase. */
type DirectEventTypeConfig = {
  kind: 'direct';
  /** e.g. `onLayout` */
  handlerName: string;
};

/** How React Native dispatches an event type, and which handler props it calls. */
export type EventTypeConfig = BubblingEventTypeConfig | DirectEventTypeConfig;

/**
 * Returns how React Native dispatches the event type (e.g. `focus`), or `null` if React Native
 * doesn't know it.
 */
export function getEventTypeConfig(eventType: string): EventTypeConfig | null {
  if (BUBBLING_EVENT_TYPES.includes(eventType)) {
    const handlerName = getEventHandlerName(eventType);
    return {
      kind: 'bubbling',
      handlerName,
      captureHandlerName: `${handlerName}Capture`,
      skipBubbling: SKIP_BUBBLING_EVENT_TYPES.includes(eventType),
    };
  }

  if (DIRECT_EVENT_TYPES.includes(eventType)) {
    return {
      kind: 'direct',
      handlerName: DIRECT_EVENT_HANDLER_NAMES[eventType] ?? getEventHandlerName(eventType),
    };
  }

  return null;
}
