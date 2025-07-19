import { StyleSheet } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';

import { getHostParent } from './component-tree';

/**
 * pointerEvents controls whether the View can be the target of touch events.
 * 'auto': The View and its children can be the target of touch events.
 * 'none': The View is never the target of touch events.
 * 'box-none': The View is never the target of touch events but its subviews can be
 * 'box-only': The view can be the target of touch events but its subviews cannot be
 * see the official react native doc https://reactnative.dev/docs/view#pointerevents */
export const isPointerEventEnabled = (element: ReactTestInstance, isParent?: boolean): boolean => {
  // Check both props.pointerEvents and props.style.pointerEvents
  const pointerEvents =
    element?.props.pointerEvents ?? StyleSheet.flatten(element?.props.style)?.pointerEvents;

  const parentCondition = isParent ? pointerEvents === 'box-only' : pointerEvents === 'box-none';

  if (pointerEvents === 'none' || parentCondition) {
    return false;
  }

  const hostParent = getHostParent(element);
  if (!hostParent) return true;

  return isPointerEventEnabled(hostParent, true);
};
