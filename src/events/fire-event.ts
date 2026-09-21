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
import { nativeState } from './native-state';
import type { FindEventHandlerContext } from './propagation';
import { findEventHandler } from './propagation';
import type { EventName, EventProps, LayoutRectangle } from './types';
import { updateNativeStateFromEvent } from './update-native-state';

function isWarnableDisabledTarget(target: TestInstance): boolean {
  // `computeAriaDisabled` treats non-editable TextInput as disabled for a11y purposes,
  // but firing events on it is expected, not a bug worth warning about.
  if (isHostTextInput(target) && !isEditableTextInput(target)) {
    return false;
  }

  return computeAriaDisabled(target);
}

/**
 * Warns when no handler ran because the target is disabled.
 * Opt out via `configure({ warnOnDisabledElementEvent: false })`.
 */
function warnAboutDisabledEventTarget(target: TestInstance | null, eventName: string) {
  if (!getConfig().warnOnDisabledElementEvent || target == null) {
    return;
  }

  if (!isWarnableDisabledTarget(target)) {
    return;
  }

  logger.warn(
    `Tried to fire the "${eventName}" event on a disabled element, so no handler was called.\n` +
      'If this is intentional, you can disable this warning via `configure({ warnOnDisabledElementEvent: false })`.',
  );
}

async function fireEvent(instance: TestInstance, eventName: EventName, ...data: unknown[]) {
  if (!isInstanceMounted(instance)) {
    return;
  }

  // `fireEvent` accepts event names with and without the `on*` prefix.
  updateNativeStateFromEvent(instance, normalizeEventName(eventName), data[0]);

  const context: FindEventHandlerContext = { rejectedTargetRef: { current: null } };
  const handler = findEventHandler(instance, eventName, context);
  if (!handler) {
    warnAboutDisabledEventTarget(context.rejectedTargetRef.current, eventName);
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
