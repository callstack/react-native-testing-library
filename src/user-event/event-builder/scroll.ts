/**
 * Experimental values:
 * - iOS: `{"contentInset": {"bottom": 0, "left": 0, "right": 0, "top": 0}, "contentOffset": {"x": 0, "y": 5.333333333333333}, "contentSize": {"height": 1676.6666259765625, "width": 390}, "layoutMeasurement": {"height": 753, "width": 390}, "zoomScale": 1}`
 * - Android: `{"contentInset": {"bottom": 0, "left": 0, "right": 0, "top": 0}, "contentOffset": {"x": 0, "y": 31.619047164916992}, "contentSize": {"height": 1624.761962890625, "width": 411.4285583496094}, "layoutMeasurement": {"height": 785.5238037109375, "width": 411.4285583496094}, "responderIgnoreScroll": true, "target": 139, "velocity": {"x": -1.3633992671966553, "y": -1.3633992671966553}}`
 */

/**
 * Scroll position of a scrollable element.
 */
export interface ContentOffset {
  x: number;
  y: number;
}

export const ScrollEventBuilder = {
  scroll: (offset: ContentOffset = { x: 0, y: 0 }) => {
    return {
      contentInset: { bottom: 0, left: 0, right: 0, top: 0 },
      contentOffset: { x: offset.x, y: offset.y },
      contentSize: { height: 0, width: 0 },
      layoutMeasurement: {
        height: 0,
        width: 0,
      },
      responderIgnoreScroll: true,
      target: 0,
      velocity: { x: 0, y: 0 },
    };
  },
};
