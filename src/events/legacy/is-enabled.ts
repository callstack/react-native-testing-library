import type { TestInstance } from 'test-renderer';

import { isHostTextInput } from '../../helpers/host-component-names';
import { isEditableTextInput } from '../../helpers/text-input';
import { isPointerEventEnabled } from '../shared/pointer-events';

export function isTouchResponder(instance: TestInstance) {
  return Boolean(instance.props.onStartShouldSetResponder) || isHostTextInput(instance);
}

/**
 * List of events affected by `pointerEvents` prop.
 */
const EVENTS_AFFECTED_BY_POINTER_EVENTS = ['press'];

/**
 * Expects event type without the `on*` prefix (see `normalizeEventType`).
 */
export function isEventBlockableByPointerEvents(eventType: string): boolean {
  return EVENTS_AFFECTED_BY_POINTER_EVENTS.includes(eventType);
}

/**
 * List of `TextInput` events not affected by `editable` prop.
 */
const TEXT_INPUT_EVENTS_IGNORING_EDITABLE = ['contentSizeChange', 'layout', 'scroll'];

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
      TEXT_INPUT_EVENTS_IGNORING_EDITABLE.includes(eventType)
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
