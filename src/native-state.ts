import type { TestInstance } from 'test-renderer';

import type { Point } from './types';

/**
 * Simulated native state for unmanaged controls.
 *
 * Values from `value` props (managed controls) should take precedence over these values.
 */
export type NativeState = {
  valueForInstance: WeakMap<TestInstance, string>;
  contentOffsetForInstance: WeakMap<TestInstance, Point>;
};

export const nativeState: NativeState = {
  valueForInstance: new WeakMap(),
  contentOffsetForInstance: new WeakMap(),
};
