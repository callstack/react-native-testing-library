import type { TestInstance } from 'test-renderer';

import { getEventHandlerByEventType, isPointerEventEnabled } from '../../events/legacy';
import { isHostText, isHostTextInput } from '../../helpers/host-component-names';
import type { Interaction } from '../utils';

/**
 * Finds the element that receives the press, from the instance up to the root, and sets it as
 * `interaction.target`: the nearest enabled host element with `onPress*` props (`'host'`), or
 * touch responder that accepts the touch (`'responder'`). Elements that could handle the press,
 * but are disabled or block touches, are added to `interaction.skippedTargets`.
 *
 * On a device, `TextInput`'s Pressability always claims the touch, so the press never reaches its
 * ancestors. It calls its callbacks even when not editable, as on iOS, where `editable={false}`
 * only stops it from focusing. Known difference from Android: there, a non-editable `TextInput` is
 * disabled and never the touch target, so the touch goes to its ancestors.
 *
 * @returns how to press the target, or `null` when no element receives the press.
 */
export function findPressTarget(
  interaction: Interaction,
  instance: TestInstance,
): 'host' | 'responder' | null {
  let current: TestInstance | null = instance;
  while (current != null) {
    if (isHostTextInput(current) && isPointerEventEnabled(current)) {
      interaction.target = current;
      return 'host';
    }

    if (isEnabledHostElement(current) && hasPressEventHandler(current)) {
      interaction.target = current;
      return 'host';
    }

    if (isEnabledTouchResponder(current)) {
      interaction.target = current;
      return 'responder';
    }

    // The element could handle the press, but is disabled or blocks touches.
    if (hasPressEventHandler(current) || current.props.onStartShouldSetResponder) {
      interaction.skippedTargets.push(current);
    }

    current = current.parent;
  }

  return null;
}

function isEnabledHostElement(instance: TestInstance) {
  if (!isPointerEventEnabled(instance)) {
    return false;
  }

  if (isHostText(instance)) {
    return instance.props.disabled !== true;
  }

  return true;
}

function isEnabledTouchResponder(instance: TestInstance) {
  return isPointerEventEnabled(instance) && instance.props.onStartShouldSetResponder?.();
}

function hasPressEventHandler(instance: TestInstance) {
  return (
    getEventHandlerByEventType(instance.props, 'press') ||
    getEventHandlerByEventType(instance.props, 'longPress') ||
    getEventHandlerByEventType(instance.props, 'pressIn') ||
    getEventHandlerByEventType(instance.props, 'pressOut')
  );
}
