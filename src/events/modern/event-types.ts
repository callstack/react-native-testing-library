import { getEventHandlerName } from '../shared/handler';

/**
 * Event types known to React Native.
 *
 * React Native fills its view config registry at runtime from the view configs of native
 * components, but `@react-native/jest-preset` mocks native components, so the registry stays empty
 * in Jest. These are static copies of the union of `BaseViewConfig.{ios,android}.js` and the view
 * configs of built-in components, keyed by event type instead of React Native's top-level type
 * (`focus` instead of `topFocus`). `__tests__/event-types.test.ts` checks them against the installed
 * `react-native`.
 *
 * Prop names follow from the event type: `onFocus` for the bubble phase and direct events,
 * `onFocusCapture` for the capture phase.
 */

export const bubblingEventTypes: ReadonlySet<string> = new Set([
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
]);

/** Bubbling events that run the capture phase as usual, but call only the target when bubbling. */
export const skipBubblingEventTypes: ReadonlySet<string> = new Set([
  'pointerEnter',
  'pointerLeave',
]);

export const directEventTypes: ReadonlySet<string> = new Set([
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
  'scroll',
  'scrollBeginDrag',
  'scrollEndDrag',
  'scrollToTop',
  'selectionChange',
  'show',
  // From the inline view config in `TextNativeComponent.js`, which is not exported.
  'textLayout',
]);

/** Same shape as React Native's `DispatchConfig`, exposed as `event.dispatchConfig`. */
export type DispatchConfig =
  | {
      phasedRegistrationNames: { bubbled: string; captured: string; skipBubbling?: boolean };
    }
  | { registrationName: string };

export type EventTypeConfig =
  | { kind: 'bubbling'; skipBubbling: boolean; dispatchConfig: DispatchConfig }
  | { kind: 'direct'; dispatchConfig: DispatchConfig };

/**
 * Returns how React Native dispatches the event type (e.g. `focus`), or `null` if React Native
 * doesn't know it.
 */
export function getEventTypeConfig(eventType: string): EventTypeConfig | null {
  if (bubblingEventTypes.has(eventType)) {
    const propName = getEventHandlerName(eventType);
    const skipBubbling = skipBubblingEventTypes.has(eventType);
    return {
      kind: 'bubbling',
      skipBubbling,
      dispatchConfig: {
        phasedRegistrationNames: {
          bubbled: propName,
          captured: `${propName}Capture`,
          ...(skipBubbling ? { skipBubbling } : {}),
        },
      },
    };
  }

  if (directEventTypes.has(eventType)) {
    return { kind: 'direct', dispatchConfig: { registrationName: getEventHandlerName(eventType) } };
  }

  return null;
}
