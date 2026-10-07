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
export function isPointerEventEnabled(instance: TestInstance): boolean {
  return getPointerEventsBlocker(instance) == null;
}

/**
 * Returns the element whose `pointerEvents` prevents the instance from being the target of
 * touch events: the instance itself or one of its ancestors. Returns `null` if nothing blocks it.
 */
export function getPointerEventsBlocker(instance: TestInstance): TestInstance | null {
  return findPointerEventsBlocker(instance, false);
}

export function isTouchResponder(instance: TestInstance) {
  return Boolean(instance.props.onStartShouldSetResponder) || isHostTextInput(instance);
}

/**
 * List of events affected by `pointerEvents` prop.
 */
const eventsAffectedByPointerEventsProp = new Set(['press']);

/**
 * Expects event type without the `on*` prefix (see `normalizeEventType`).
 */
export function isEventBlockableByPointerEvents(eventType: string): boolean {
  return eventsAffectedByPointerEventsProp.has(eventType);
}

/**
 * List of `TextInput` events not affected by `editable` prop.
 */
const textInputEventsIgnoringEditableProp = new Set(['contentSizeChange', 'layout', 'scroll']);

/**
 * Checks whether a device would deliver the event to the instance, taking into account
 * `pointerEvents`, non-editable `TextInput` and touch responders that decline the touch.
 * Expects event type without the `on*` prefix (see `normalizeEventType`).
 */
export function isEventEnabled(
  instance: TestInstance,
  eventType: string,
  nearestTouchResponder?: TestInstance,
) {
  if (nearestTouchResponder != null && isHostTextInput(nearestTouchResponder)) {
    return (
      isEditableTextInput(nearestTouchResponder) ||
      textInputEventsIgnoringEditableProp.has(eventType)
    );
  }

  if (isEventBlockableByPointerEvents(eventType) && !isPointerEventEnabled(instance)) {
    return false;
  }

  const touchStart = nearestTouchResponder?.props.onStartShouldSetResponder?.();
  const touchMove = nearestTouchResponder?.props.onMoveShouldSetResponder?.();
  if (touchStart || touchMove) {
    return true;
  }

  return touchStart === undefined && touchMove === undefined;
}

function findPointerEventsBlocker(instance: TestInstance, isParent: boolean): TestInstance | null {
  // Check both props.pointerEvents and props.style.pointerEvents
  const pointerEvents =
    instance?.props.pointerEvents ?? StyleSheet.flatten(instance?.props.style)?.pointerEvents;

  const parentCondition = isParent ? pointerEvents === 'box-only' : pointerEvents === 'box-none';

  if (pointerEvents === 'none' || parentCondition) {
    return instance;
  }

  if (!instance.parent) {
    return null;
  }

  return findPointerEventsBlocker(instance.parent, true);
}
