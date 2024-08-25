import { ReactTestInstance } from 'react-test-renderer';

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
