import type { TestInstance } from 'test-renderer';

import { findClosestInstance } from '../../helpers/component-tree';
import { isHostSwitch, isHostTextInput } from '../../helpers/host-component-names';
import { isEditableTextInput } from '../../helpers/text-input';
import type { CreateEventInit } from './event';
import { getDisplayNoneBlocker, getTouchPath } from './pressability';

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

/** Why `getEmittingTarget()` dropped an event. */
export type DroppedEventReason =
  | { kind: 'displayNone'; displayNoneBlocker: TestInstance }
  | { kind: 'pointerEvents' }
  | { kind: 'nonEditable'; textInput: TestInstance }
  | { kind: 'disabledSwitch' };

/** The element that emits the event, or why no element would emit it. */
export type EmittingTargetResult =
  | { target: TestInstance; droppedReason?: never }
  | { target: null; droppedReason: DroppedEventReason };

/**
 * The element a device would emit the event from, or the reason no element would emit it:
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
): EmittingTargetResult {
  if (init.dispatch != null) {
    return { target };
  }

  if (HIT_TESTED_EVENT_TYPES.has(eventType)) {
    const hitTarget = getTouchPath(target)[0];
    if (hitTarget != null) {
      return { target: hitTarget };
    }

    const displayNoneBlocker = getDisplayNoneBlocker(target);
    return {
      target: null,
      droppedReason:
        displayNoneBlocker != null
          ? { kind: 'displayNone', displayNoneBlocker }
          : { kind: 'pointerEvents' },
    };
  }

  if (TEXT_EDITING_EVENT_TYPES.has(eventType)) {
    const textInput = findClosestInstance(target, isHostTextInput);
    if (textInput != null) {
      return isEditableTextInput(textInput)
        ? { target: textInput }
        : { target: null, droppedReason: { kind: 'nonEditable', textInput } };
    }
  }

  if (eventType === 'change' && isHostSwitch(target) && target.props.disabled === true) {
    return { target: null, droppedReason: { kind: 'disabledSwitch' } };
  }

  return { target };
}
