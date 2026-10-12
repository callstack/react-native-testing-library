import type { TestInstance } from 'test-renderer';

import { findResponder, getTouchPath } from '../../events/modern/pressability';
import { getEventHandlerByName, hasPressEventHandler } from '../../events/shared/handler';
import type { Interaction } from '../utils';

/**
 * Sets `interaction.target` to the touch responder, the element modern `fireEvent.press()` calls
 * (see `dispatchPressabilityEvent()`). A responder with `onStartShouldSetResponder` (`Pressable`,
 * `Touchable*`, `PanResponder`) is pressed with responder events (`'responder'`); a mocked host
 * without one, like `Text` or `TextInput`, gets its `onPress*` props called (`'host'`). Elements
 * between the pressed element and the responder that could handle the press, but are disabled or
 * block touches, are added to `interaction.skippedTargets`.
 *
 * @returns how to press the target, or `null` when no element receives the press.
 */
export function findPressTarget(
  interaction: Interaction,
  instance: TestInstance,
): 'host' | 'responder' | null {
  const touchResponder = findResponder(getTouchPath(instance));

  let current: TestInstance | null = instance;
  while (current != null && current !== touchResponder) {
    if (hasPressEventHandler(current.props) || current.props.onStartShouldSetResponder) {
      interaction.skippedTargets.push(current);
    }

    current = current.parent;
  }

  if (touchResponder == null) {
    return null;
  }

  interaction.target = touchResponder;
  return getEventHandlerByName(touchResponder.props, 'onStartShouldSetResponder') != null
    ? 'responder'
    : 'host';
}
