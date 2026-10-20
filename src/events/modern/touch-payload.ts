import { mergeEventProps } from '../shared/merge';
import { buildTouchNativeEvent } from '../shared/payloads';
import type { NativeEventPayload } from './event';

/**
 * React Native's touch payload (`touchEventPayload()` in `TouchEventEmitter.cpp`): the changed
 * touch's fields, plus the touch arrays. On the New Architecture, `timestamp` uses the clock of
 * `performance.now()`.
 *
 * `init` is deep merged onto a default touch. As on a device, `changedTouches` has the touch, and
 * `touches` has it while the touch is active (touch start and move) and is empty once it ends,
 * unless `init` sets them.
 *
 * @param isActive whether the touch is still on the screen: `true` on touch start and move, `false`
 * on touch end and cancel.
 */
export function buildTouchPayload(
  isActive: boolean,
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
    nativeEvent.touches = isActive ? [{ ...touch }] : [];
  }

  return nativeEvent;
}
