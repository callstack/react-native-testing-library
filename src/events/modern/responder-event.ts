import { mergeEventProps } from '../shared/merge';
import { buildTouchNativeEvent } from '../shared/payloads';
import type { CreateEventInit, NativeEventPayload } from './event';
import { SyntheticEvent } from './event';
import type { PressabilityEventType } from './event-types';

/** The dispatch configs React Native's responder system passes to `ResponderEvent`. */
const RESPONDER_DISPATCH_CONFIGS = {
  responderGrant: { registrationName: 'onResponderGrant', dependencies: [] },
  responderRelease: {
    registrationName: 'onResponderRelease',
    dependencies: ['topTouchCancel', 'topTouchEnd'],
  },
} as const;

type ResponderEventType = keyof typeof RESPONDER_DISPATCH_CONFIGS;

/**
 * Event object of responder handlers (`onResponderGrant`, ...), which Pressability passes on to
 * its callbacks. Mirrors React Native's `ResponderEvent`
 * (`src/private/renderer/events/ResponderEvent.js`). The responder system creates it in
 * JavaScript and calls the handler directly, so unlike native events it is neither direct nor
 * trusted, has no event phase or composed path, and its `timeStamp` is `performance.now()`.
 */
export class ResponderEvent extends SyntheticEvent {
  constructor(
    type: ResponderEventType,
    init: { timeStamp?: number },
    nativeEvent: NativeEventPayload,
  ) {
    const dispatchConfig = RESPONDER_DISPATCH_CONFIGS[type];
    super(
      type,
      { bubbles: false, cancelable: true, rnIsDirect: false, timeStamp: init.timeStamp },
      nativeEvent,
      { kind: 'direct', handlerName: dispatchConfig.registrationName },
      dispatchConfig,
    );
  }
}

/**
 * Creates the event Pressability passes to the callback, ready for `dispatchPressabilityEvent()`.
 * As in React Native, `onPressIn` and `onLongPress` get the `responderGrant` event (touch start),
 * and `onPressOut` and `onPress` the `responderRelease` event (touch end).
 *
 * `nativeEvent` is deep merged onto a default touch payload. As on a device, `changedTouches` has
 * the touch, and `touches` has it on touch start and is empty on touch end, unless `nativeEvent`
 * sets them.
 */
export function createPressabilityEvent(
  eventType: PressabilityEventType,
  init: CreateEventInit = {},
): ResponderEvent {
  const isTouchStart = eventType === 'pressIn' || eventType === 'longPress';
  const nativeEvent = buildResponderNativeEvent(isTouchStart, init.nativeEvent);
  return new ResponderEvent(
    isTouchStart ? 'responderGrant' : 'responderRelease',
    { timeStamp: init.timeStamp },
    nativeEvent,
  );
}

/**
 * React Native's touch payload (`touchEventPayload()` in `TouchEventEmitter.cpp`): the changed
 * touch's fields, plus the touch arrays. On the New Architecture, `timestamp` uses the clock of
 * `performance.now()`.
 */
function buildResponderNativeEvent(
  isTouchStart: boolean,
  init: NativeEventPayload | undefined,
): NativeEventPayload {
  const nativeEvent: NativeEventPayload = mergeEventProps(
    buildTouchNativeEvent(),
    { timestamp: performance.now() },
    init,
  );

  const touch = { ...nativeEvent };
  delete touch.changedTouches;
  delete touch.touches;
  if (init == null || !Object.hasOwn(init, 'changedTouches')) {
    nativeEvent.changedTouches = [{ ...touch }];
  }
  if (init == null || !Object.hasOwn(init, 'touches')) {
    nativeEvent.touches = isTouchStart ? [{ ...touch }] : [];
  }

  return nativeEvent;
}
