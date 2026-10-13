import { isObject } from '../../helpers/object';
import { mergeEventProps } from '../shared/merge';
import { buildTouchNativeEvent } from '../shared/payloads';
import type { CreateEventInit, NativeEventPayload } from './event';
import { SyntheticEvent } from './event';
import type { PressabilityEventType } from './event-types';

/** React Native's `TouchRecord`, one touch in `TouchHistory.touchBank`. */
export type TouchRecord = {
  touchActive: boolean;
  startPageX: number;
  startPageY: number;
  startTimeStamp: number;
  currentPageX: number;
  currentPageY: number;
  currentTimeStamp: number;
  previousPageX: number;
  previousPageY: number;
  previousTimeStamp: number;
};

/**
 * React Native's `TouchHistory` (`src/private/renderer/events/ResponderTouchHistoryStore.js`),
 * exposed as `event.touchHistory`. `touchBank` is indexed by touch `identifier`.
 */
export type TouchHistory = {
  touchBank: TouchRecord[];
  numberActiveTouches: number;
  indexOfSingleActiveTouch: number;
  mostRecentTimeStamp: number;
};

type Touch = { identifier: number; pageX: number; pageY: number; timestamp: number };

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
  private readonly _touchHistory: TouchHistory;

  constructor(
    type: ResponderEventType,
    init: { timeStamp?: number },
    nativeEvent: NativeEventPayload,
    touchHistory: TouchHistory,
  ) {
    const dispatchConfig = RESPONDER_DISPATCH_CONFIGS[type];
    super(
      type,
      { bubbles: false, cancelable: true, rnIsDirect: false, timeStamp: init.timeStamp },
      nativeEvent,
      { kind: 'direct', handlerName: dispatchConfig.registrationName },
      dispatchConfig,
    );
    this._touchHistory = touchHistory;
  }

  get touchHistory(): TouchHistory {
    return this._touchHistory;
  }
}

export function createTouchHistory(): TouchHistory {
  return {
    touchBank: [],
    numberActiveTouches: 0,
    indexOfSingleActiveTouch: -1,
    mostRecentTimeStamp: 0,
  };
}

/**
 * Creates the event Pressability passes to the callback, ready for `dispatchPressabilityEvent()`.
 * As in React Native, `onPressIn` and `onLongPress` get the `responderGrant` event (touch start),
 * and `onPressOut` and `onPress` the `responderRelease` event (touch end).
 *
 * `nativeEvent` is deep merged onto a default touch payload. As on a device, `changedTouches` has
 * the touch, and `touches` has it on touch start and is empty on touch end, unless `nativeEvent`
 * sets them.
 *
 * @param touchHistory records the touch start or end. Pass the same one to the events of a touch,
 * as React Native shares one between all events.
 */
export function createPressabilityEvent(
  eventType: PressabilityEventType,
  init: CreateEventInit = {},
  touchHistory: TouchHistory = createTouchHistory(),
): ResponderEvent {
  const isTouchStart = eventType === 'pressIn' || eventType === 'longPress';
  const nativeEvent = buildResponderNativeEvent(isTouchStart, init.nativeEvent);
  recordTouches(touchHistory, isTouchStart, nativeEvent);
  return new ResponderEvent(
    isTouchStart ? 'responderGrant' : 'responderRelease',
    { timeStamp: init.timeStamp },
    nativeEvent,
    touchHistory,
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

/** As React Native's `ResponderTouchHistoryStore.recordTouchTrack()` on touch start or end. */
function recordTouches(
  touchHistory: TouchHistory,
  isTouchStart: boolean,
  nativeEvent: NativeEventPayload,
) {
  const changedTouches = getTouches(nativeEvent.changedTouches);
  const touches = getTouches(nativeEvent.touches);
  for (const touch of changedTouches) {
    if (isTouchStart) {
      recordTouchStart(touchHistory, touch);
    } else {
      recordTouchEnd(touchHistory, touch);
    }
  }

  touchHistory.numberActiveTouches = touches.length;
  if (touches.length === 1) {
    touchHistory.indexOfSingleActiveTouch = isTouchStart
      ? touches[0].identifier
      : touchHistory.touchBank.findIndex((record) => record?.touchActive);
  }
}

function recordTouchStart(touchHistory: TouchHistory, touch: Touch) {
  touchHistory.touchBank[touch.identifier] = {
    touchActive: true,
    startPageX: touch.pageX,
    startPageY: touch.pageY,
    startTimeStamp: touch.timestamp,
    currentPageX: touch.pageX,
    currentPageY: touch.pageY,
    currentTimeStamp: touch.timestamp,
    previousPageX: touch.pageX,
    previousPageY: touch.pageY,
    previousTimeStamp: touch.timestamp,
  };
  touchHistory.mostRecentTimeStamp = touch.timestamp;
}

function recordTouchEnd(touchHistory: TouchHistory, touch: Touch) {
  // `fireEvent.press()` creates only the touch end event, so the touch starts here.
  if (touchHistory.touchBank[touch.identifier] == null) {
    recordTouchStart(touchHistory, touch);
  }

  const record = touchHistory.touchBank[touch.identifier];
  record.touchActive = false;
  record.previousPageX = record.currentPageX;
  record.previousPageY = record.currentPageY;
  record.previousTimeStamp = record.currentTimeStamp;
  record.currentPageX = touch.pageX;
  record.currentPageY = touch.pageY;
  record.currentTimeStamp = touch.timestamp;
  touchHistory.mostRecentTimeStamp = touch.timestamp;
}

/** Touches with a valid `identifier`. React Native throws on others, RNTL skips them. */
function getTouches(value: unknown): Touch[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (touch): touch is Touch =>
      isObject(touch) && Number.isInteger(touch.identifier) && (touch.identifier as number) >= 0,
  );
}
