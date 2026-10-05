import { StyleSheet } from 'react-native';
import type { TestInstance } from 'test-renderer';

import { isHostTextInput } from '../helpers/host-component-names';
import { isEditableTextInput } from '../helpers/text-input';

/**
 * pointerEvents controls whether the View can be the target of touch events.
 * 'auto': The View and its children can be the target of touch events.
 * 'none': The View is never the target of touch events.
 * 'box-none': The View is never the target of touch events but its subviews can be
 * 'box-only': The view can be the target of touch events but its subviews cannot be
 * see the official react native doc https://reactnative.dev/docs/view#pointerevents */
export const isPointerEventEnabled = (instance: TestInstance, isParent?: boolean): boolean => {
  // Check both props.pointerEvents and props.style.pointerEvents
  const pointerEvents =
    instance?.props.pointerEvents ?? StyleSheet.flatten(instance?.props.style)?.pointerEvents;

  const parentCondition = isParent ? pointerEvents === 'box-only' : pointerEvents === 'box-none';

  if (pointerEvents === 'none' || parentCondition) {
    return false;
  }

  if (!instance.parent) {
    return true;
  }

  return isPointerEventEnabled(instance.parent, true);
};

export function isTouchResponder(instance: TestInstance) {
  return Boolean(instance.props.onStartShouldSetResponder) || isHostTextInput(instance);
}

/**
 * List of events affected by `pointerEvents` prop.
 */
const eventsAffectedByPointerEventsProp = new Set(['press']);

/**
 * List of `TextInput` events not affected by `editable` prop.
 */
const textInputEventsIgnoringEditableProp = new Set(['contentSizeChange', 'layout', 'scroll']);

/**
 * Checks whether a device would deliver the event to the instance, taking into account
 * `pointerEvents`, non-editable `TextInput` and touch responders that decline the touch.
 * Expects event name without the `on*` prefix (see `normalizeEventName`).
 */
export function isEventEnabled(
  instance: TestInstance,
  eventName: string,
  nearestTouchResponder?: TestInstance,
) {
  if (nearestTouchResponder != null && isHostTextInput(nearestTouchResponder)) {
    return (
      isEditableTextInput(nearestTouchResponder) ||
      textInputEventsIgnoringEditableProp.has(eventName)
    );
  }

  if (eventsAffectedByPointerEventsProp.has(eventName) && !isPointerEventEnabled(instance)) {
    return false;
  }

  const touchStart = nearestTouchResponder?.props.onStartShouldSetResponder?.();
  const touchMove = nearestTouchResponder?.props.onMoveShouldSetResponder?.();
  if (touchStart || touchMove) {
    return true;
  }

  return touchStart === undefined && touchMove === undefined;
}
