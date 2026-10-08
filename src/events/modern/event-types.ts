import { getEventHandlerName } from '../shared/handler';

/**
 * Event types known to React Native, keyed by event type (`focus`, not `topFocus`).
 *
 * `@react-native/jest-preset` mocks native components, so React Native's view config registry stays
 * empty in Jest. These are static copies of the union of `BaseViewConfig.{ios,android}.js` and the
 * built-in components' view configs. `__tests__/event-types.test.ts` checks them against the
 * installed `react-native`.
 *
 * Prop names follow from the event type: `onFocus` (bubble phase, direct events) and
 * `onFocusCapture`.
 */

export const BUBBLING_EVENT_TYPES = [
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
] as const;

/** Bubbling events that run the capture phase as usual, but call only the target when bubbling. */
export const SKIP_BUBBLING_EVENT_TYPES = ['pointerEnter', 'pointerLeave'] as const;

export const DIRECT_EVENT_TYPES = [
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
] as const;

/** Event type React Native dispatches natively, e.g. `focus` or `layout`. */
export type NativeEventType =
  | (typeof BUBBLING_EVENT_TYPES)[number]
  | (typeof DIRECT_EVENT_TYPES)[number];

const bubblingEventTypes: readonly string[] = BUBBLING_EVENT_TYPES;
const skipBubblingEventTypes: readonly string[] = SKIP_BUBBLING_EVENT_TYPES;
const directEventTypes: readonly string[] = DIRECT_EVENT_TYPES;

// React Native's `DispatchConfig` shape: `TouchableOpacity` reads its `registrationName`.
export type DispatchConfig =
  | {
      phasedRegistrationNames: { bubbled: string; captured: string; skipBubbling?: boolean };
    }
  | { registrationName: string };

type EventTypeConfig =
  | { kind: 'bubbling'; skipBubbling: boolean; dispatchConfig: DispatchConfig }
  | { kind: 'direct'; dispatchConfig: DispatchConfig };

/**
 * Returns how React Native dispatches the event type (e.g. `focus`), or `null` if React Native
 * doesn't know it.
 */
export function getEventTypeConfig(eventType: string): EventTypeConfig | null {
  if (bubblingEventTypes.includes(eventType)) {
    const propName = getEventHandlerName(eventType);
    const skipBubbling = skipBubblingEventTypes.includes(eventType);
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

  if (directEventTypes.includes(eventType)) {
    return { kind: 'direct', dispatchConfig: { registrationName: getEventHandlerName(eventType) } };
  }

  return null;
}
