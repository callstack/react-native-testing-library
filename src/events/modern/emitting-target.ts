import type { TestInstance } from 'test-renderer';

import { isHostSwitch, isHostTextInput } from '../../helpers/host-component-names';
import { isEditableTextInput } from '../../helpers/text-input';
import type { CreateEventInit } from './event';
import { getTouchPath } from './pressability';

/**
 * Native touch and pointer events, which a device emits from the view its hit testing finds, as
 * `pointerEvents` decides. Pointer capture events go to the capturing view instead.
 */
const HIT_TESTED_EVENT_TYPES = new Set([
  'click',
  'pointerCancel',
  'pointerDown',
  'pointerEnter',
  'pointerLeave',
  'pointerMove',
  'pointerOut',
  'pointerOver',
  'pointerUp',
  'touchCancel',
  'touchEnd',
  'touchMove',
  'touchStart',
]);

/**
 * `TextInput` events a non-editable `TextInput` doesn't emit, as it can't be focused. Its
 * `selectionChange` stays, as iOS emits it for a non-editable multiline `TextInput`, and so do
 * events that don't need focus, like `layout`, `scroll` and `contentSizeChange`.
 */
const TEXT_EDITING_EVENT_TYPES = new Set([
  'blur',
  'change',
  'changeSync',
  'endEditing',
  'focus',
  'keyPress',
  'keyPressSync',
  'submitEditing',
]);

/**
 * The element a device would emit the event from, or `null` when no element would emit it:
 *
 * - Touch and pointer events: the hit target, as for `press` (`getTouchPath()`). `pointerEvents`
 *   moves them to the nearest ancestor it doesn't block, and drops them when it blocks every
 *   element. Dropped when `display: none` hides the element.
 * - Text editing events: the nearest host `TextInput`, as a `Text` nested in a `TextInput` isn't a
 *   native view on a device. Dropped when it isn't editable.
 * - `change` of a disabled `Switch`: dropped, as it can't be toggled.
 *
 * `disabled` doesn't block touch and pointer events, as on iOS, where only Pressability checks it.
 * Known difference from Android: there, a disabled view is never the hit target, so the touch goes
 * to its ancestors.
 *
 * Events with `dispatch` are declared by a native component, which decides when to emit them, so
 * they keep the target.
 */
export function getEmittingTarget(
  target: TestInstance,
  eventType: string,
  init: CreateEventInit,
): TestInstance | null {
  if (init.dispatch != null) {
    return target;
  }

  if (HIT_TESTED_EVENT_TYPES.has(eventType)) {
    return getTouchPath(target)[0] ?? null;
  }

  if (TEXT_EDITING_EVENT_TYPES.has(eventType)) {
    const textInput = findHostTextInput(target);
    if (textInput != null) {
      return isEditableTextInput(textInput) ? textInput : null;
    }
  }

  if (eventType === 'change' && isHostSwitch(target) && target.props.disabled === true) {
    return null;
  }

  return target;
}

/** The element or its nearest host `TextInput` ancestor, or `null` when there is none. */
function findHostTextInput(instance: TestInstance): TestInstance | null {
  let current: TestInstance | null = instance;
  while (current != null && !isHostTextInput(current)) {
    current = current.parent;
  }

  return current;
}
