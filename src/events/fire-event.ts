import type { TestInstance } from 'test-renderer';

import { act } from '../act';
import { getConfig } from '../config';
import { computeAriaDisabled } from '../helpers/accessibility';
import { isInstanceMounted } from '../helpers/component-tree';
import { isHostScrollView, isHostTextInput } from '../helpers/host-component-names';
import { logger } from '../helpers/logger';
import { isEditableTextInput } from '../helpers/text-input';
import { buildLayoutEvent, buildTouchEvent } from './builders/common';
import { mergeEventProps } from './builders/merge';
import { buildScrollEvent } from './builders/scroll';
import { normalizeEventName } from './handler';
import { isTouchResponder } from './is-enabled';
import { nativeState } from './native-state';
import { findEventHandler } from './propagation';
import type { EventName, EventProps, LayoutRectangle } from './types';
import { updateNativeStateFromEvent } from './update-native-state';

/**
 * Walks up from the target to the nearest element that can respond to touches
 * (a touch responder or a host `TextInput`), mirroring `findEventHandler`.
 */
function getNearestTouchResponder(instance: TestInstance): TestInstance | null {
  let current: TestInstance | null = instance;
  while (current != null) {
    if (isTouchResponder(current)) {
      return current;
    }

    current = current.parent;
  }

  return null;
}

/**
 * Warns when an event did not trigger any handler because the responding
 * element is disabled. Helps debug tests that silently do nothing.
 * Can be opted out via `configure({ disabledEventWarning: false })`.
 */
function warnAboutDisabledEventTarget(instance: TestInstance, eventName: string) {
  if (!getConfig().disabledEventWarning) {
    return;
  }

  const target = getNearestTouchResponder(instance) ?? instance;

  // `TextInput` editability (`editable={false}`) is a separate concern from
  // disabled state, so we don't warn about non-editable TextInput here to avoid false positives.
  if (isHostTextInput(target) && !isEditableTextInput(target)) {
    return;
  }

  if (!computeAriaDisabled(target)) {
    return;
  }

  logger.warn(
    `Tried to fire the "${eventName}" event on a disabled element, so no handler was called.\n` +
      'If this is intentional, you can disable this warning via `configure({ disabledEventWarning: false })`.',
  );
}

async function fireEvent(instance: TestInstance, eventName: EventName, ...data: unknown[]) {
  if (!isInstanceMounted(instance)) {
    return;
  }

  // `fireEvent` accepts event names with and without the `on*` prefix.
  updateNativeStateFromEvent(instance, normalizeEventName(eventName), data[0]);

  const handler = findEventHandler(instance, eventName);
  if (!handler) {
    warnAboutDisabledEventTarget(instance, eventName);
    return;
  }

  let returnValue;
  await act(() => {
    returnValue = handler(...data);
  });

  return returnValue;
}

fireEvent.changeText = async (instance: TestInstance, text: string) =>
  await fireEvent(instance, 'changeText', text);

fireEvent.press = async (instance: TestInstance, eventProps?: EventProps) => {
  await fireEvent(instance, 'press', mergeEventProps(buildTouchEvent(), eventProps));
};

fireEvent.scroll = async (instance: TestInstance, eventProps?: EventProps) => {
  const layoutMeasurement = isHostScrollView(instance)
    ? nativeState.layoutSizeForInstance.get(instance)
    : undefined;
  const event = buildScrollEvent(undefined, { layoutMeasurement });
  await fireEvent(instance, 'scroll', mergeEventProps(event, eventProps));
};

fireEvent.layout = async (instance: TestInstance, layout?: Partial<LayoutRectangle>) => {
  await fireEvent(instance, 'layout', buildLayoutEvent(layout));
};

export { fireEvent };
