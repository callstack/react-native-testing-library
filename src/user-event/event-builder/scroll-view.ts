import { Point, Size } from '../../types';
import { baseSyntheticEvent } from './base';

/**
 * Other options for constructing a scroll event.
 */
export type ScrollEventOptions = {
  contentSize?: Size;
  layoutMeasurement?: Size;
};

/**
 * Experimental values:
 * - iOS: `{"contentInset": {"bottom": 0, "left": 0, "right": 0, "top": 0}, "contentOffset": {"x": 0, "y": 5.333333333333333}, "contentSize": {"height": 1676.6666259765625, "width": 390}, "layoutMeasurement": {"height": 753, "width": 390}, "zoomScale": 1}`
 * - Android: `{"contentInset": {"bottom": 0, "left": 0, "right": 0, "top": 0}, "contentOffset": {"x": 0, "y": 31.619047164916992}, "contentSize": {"height": 1624.761962890625, "width": 411.4285583496094}, "layoutMeasurement": {"height": 785.5238037109375, "width": 411.4285583496094}, "responderIgnoreScroll": true, "target": 139, "velocity": {"x": -1.3633992671966553, "y": -1.3633992671966553}}`
 */
export const ScrollViewEventBuilder = {
  scroll: (offset: Point = { y: 0, x: 0 }, options?: ScrollEventOptions) => {
    return {
      ...baseSyntheticEvent(),
      nativeEvent: {
        contentInset: { bottom: 0, left: 0, right: 0, top: 0 },
        contentOffset: { y: offset.y, x: offset.x },
        contentSize: {
          height: options?.contentSize?.height ?? 0,
          width: options?.contentSize?.width ?? 0,
        },
        layoutMeasurement: {
          height: options?.layoutMeasurement?.height ?? 0,
          width: options?.layoutMeasurement?.width ?? 0,
        },
        responderIgnoreScroll: true,
        target: 0,
        velocity: { y: 0, x: 0 },
      },
    };
  },
};
