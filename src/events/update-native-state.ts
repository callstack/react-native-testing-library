import type { TestInstance } from 'test-renderer';

import { isHostScrollView } from '../helpers/host-component-names';
import { isEditableTextInput } from '../helpers/text-input';
import type { Point, Size } from '../types';
import { nativeState } from './native-state';

const scrollEventNames = new Set([
  'scroll',
  'scrollBeginDrag',
  'scrollEndDrag',
  'momentumScrollBegin',
  'momentumScrollEnd',
]);

/**
 * Updates native state the way a device would have before emitting the event.
 */
export function updateNativeStateFromEvent(
  instance: TestInstance,
  eventName: string,
  value: unknown,
) {
  if (eventName === 'changeText' && typeof value === 'string' && isEditableTextInput(instance)) {
    nativeState.valueForInstance.set(instance, value);
  }

  if (scrollEventNames.has(eventName) && isHostScrollView(instance)) {
    const contentOffset = tryGetContentOffset(value);
    if (contentOffset) {
      nativeState.contentOffsetForInstance.set(instance, contentOffset);
    }
  }

  if (eventName === 'layout' || eventName === 'onLayout') {
    const layoutSize = tryGetLayoutSize(value);
    if (layoutSize) {
      nativeState.layoutSizeForInstance.set(instance, layoutSize);
    }
  }
}

function tryGetContentOffset(event: unknown): Point | null {
  try {
    // @ts-expect-error: try to extract contentOffset from the event value
    const contentOffset = event?.nativeEvent?.contentOffset;
    const x = contentOffset?.x;
    const y = contentOffset?.y;

    if (typeof x === 'number' || typeof y === 'number') {
      return {
        x: Number.isFinite(x) ? x : 0,
        y: Number.isFinite(y) ? y : 0,
      };
    }
  } catch {
    // Do nothing
  }

  return null;
}

function tryGetLayoutSize(event: unknown): Size | null {
  try {
    // @ts-expect-error: try to extract layout from the event value
    const layout = event?.nativeEvent?.layout;
    const width = layout?.width;
    const height = layout?.height;

    if (typeof width === 'number' || typeof height === 'number') {
      return {
        width: Number.isFinite(width) ? width : 0,
        height: Number.isFinite(height) ? height : 0,
      };
    }
  } catch {
    // Do nothing
  }

  return null;
}
