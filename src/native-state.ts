import { ReactTestInstance } from 'react-test-renderer';

/**
 * Simulated native state for unmanaged controls.
 *
 * Values from `value` props (managed controls) should take precedence over these values.
 */
export type NativeState = {
  elementValues: WeakMap<ReactTestInstance, string>;
};

export let nativeState: NativeState | null = null;

export function initNativeState(): void {
  nativeState = {
    elementValues: new WeakMap(),
  };
}

export function clearNativeState(): void {
  nativeState = null;
}
