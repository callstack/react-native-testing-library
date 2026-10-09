import { StyleSheet } from 'react-native';
import type { TestInstance } from 'test-renderer';

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
