import type { HostElement } from 'universal-test-renderer';

import type { Point } from './types';

/**
 * Simulated native state for unmanaged controls.
 *
 * Values from `value` props (managed controls) should take precedence over these values.
 */
export type NativeState = {
  valueForElement: WeakMap<HostElement, string>;
  contentOffsetForElement: WeakMap<HostElement, Point>;
};

export const nativeState: NativeState = {
  valueForElement: new WeakMap(),
  contentOffsetForElement: new WeakMap(),
};
