import type { HostElement } from 'universal-test-renderer';

import act from '../../act';
import { getEventHandler } from '../../event-handler';
import { getHostParent, isHostElement } from '../../helpers/component-tree';
import { ErrorWithStack } from '../../helpers/errors';
import { isHostText, isHostTextInput } from '../../helpers/host-component-names';
import { isPointerEventEnabled } from '../../helpers/pointer-events';
import { EventBuilder } from '../event-builder';
import type { UserEventConfig, UserEventInstance } from '../setup';
import { dispatchEvent, wait } from '../utils';

// These are constants defined in the React Native repo
// See: https://github.com/facebook/react-native/blob/50e38cc9f1e6713228a91ad50f426c4f65e65e1a/packages/react-native/Libraries/Pressability/Pressability.js#L264
export const DEFAULT_MIN_PRESS_DURATION = 130;
export const DEFAULT_LONG_PRESS_DELAY_MS = 500;

export interface PressOptions {
  duration?: number;
}

export async function press(this: UserEventInstance, element: HostElement): Promise<void> {
  if (!isHostElement(element)) {
    throw new ErrorWithStack(
      `press() works only with host elements. Passed element has type "${element.type}".`,
      press,
    );
  }

  await basePress(this.config, element, {
    type: 'press',
  });
}

export async function longPress(
  this: UserEventInstance,
  element: HostElement,
  options?: PressOptions,
): Promise<void> {
  if (!isHostElement(element)) {
    throw new ErrorWithStack(
      `longPress() works only with host elements. Passed element has type "${element.type}".`,
      longPress,
    );
  }

  await basePress(this.config, element, {
    type: 'longPress',
    duration: options?.duration ?? DEFAULT_LONG_PRESS_DELAY_MS,
  });
}

interface BasePressOptions {
  type: 'press' | 'longPress';
  duration?: number;
}

const basePress = async (
  config: UserEventConfig,
  element: HostElement,
  options: BasePressOptions,
): Promise<void> => {
  if (isEnabledHostElement(element) && hasPressEventHandler(element)) {
    await emitDirectPressEvents(config, element, options);
    return;
  }

  if (isEnabledTouchResponder(element)) {
    await emitPressabilityPressEvents(config, element, options);
    return;
  }

  if (!element.parent) {
    return;
  }

  await basePress(config, element.parent, options);
};

function isEnabledHostElement(element: HostElement) {
  if (!isPointerEventEnabled(element)) {
    return false;
  }

  if (isHostText(element)) {
    return element.props.disabled !== true;
  }

  if (isHostTextInput(element)) {
    // @ts-expect-error - workaround incorrect HostElement type
    return element.props.editable !== false;
  }

  return true;
}

function isEnabledTouchResponder(element: HostElement) {
  return isPointerEventEnabled(element) && element.props.onStartShouldSetResponder?.();
}

function hasPressEventHandler(element: HostElement) {
  return (
    getEventHandler(element, 'press') ||
    getEventHandler(element, 'longPress') ||
    getEventHandler(element, 'pressIn') ||
    getEventHandler(element, 'pressOut')
  );
}

/**
 * Dispatches a press event sequence for host elements that have `onPress*` event handlers.
 */
async function emitDirectPressEvents(
  config: UserEventConfig,
  element: HostElement,
  options: BasePressOptions,
) {
  await wait(config);
  await dispatchEvent(element, 'pressIn', EventBuilder.Common.touch());

  await wait(config, options.duration);

  // Long press events are emitted before `pressOut`.
  if (options.type === 'longPress') {
    await dispatchEvent(element, 'longPress', EventBuilder.Common.touch());
  }

  await dispatchEvent(element, 'pressOut', EventBuilder.Common.touch());

  // Regular press events are emitted after `pressOut` according to the React Native docs.
  // See: https://reactnative.dev/docs/pressable#onpress
  // Experimentally for very short presses (< 130ms) `press` events are actually emitted before `onPressOut`, but
  // we will ignore that as in reality most pressed would be above the 130ms threshold.
  if (options.type === 'press') {
    await dispatchEvent(element, 'press', EventBuilder.Common.touch());
  }
}

async function emitPressabilityPressEvents(
  config: UserEventConfig,
  element: HostElement,
  options: BasePressOptions,
) {
  await wait(config);

  await dispatchEvent(element, 'responderGrant', EventBuilder.Common.responderGrant());

  const duration = options.duration ?? DEFAULT_MIN_PRESS_DURATION;
  await wait(config, duration);

  await dispatchEvent(element, 'responderRelease', EventBuilder.Common.responderRelease());

  // React Native will wait for minimal delay of DEFAULT_MIN_PRESS_DURATION
  // before emitting the `pressOut` event. We need to wait here, so that
  // `press()` function does not return before that.
  if (DEFAULT_MIN_PRESS_DURATION - duration > 0) {
    await act(() => wait(config, DEFAULT_MIN_PRESS_DURATION - duration));
  }
}
