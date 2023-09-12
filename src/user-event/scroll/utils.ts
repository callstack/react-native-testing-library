import { ContentOffset } from '../event-builder/scroll';

const DEFAULT_STEPS_COUNT = 5;

type InterpolatorFn = (end: number, start: number, steps: number) => number[];

export function createScrollSteps(
  target: Partial<ContentOffset>,
  initialOffset: ContentOffset,
  interpolator: InterpolatorFn
): ContentOffset[] {
  if (target.y != null) {
    return interpolator(target.y, initialOffset.y, DEFAULT_STEPS_COUNT).map(
      (y) => ({ y, x: initialOffset.x })
    );
  }

  if (target.x != null) {
    return interpolator(target.x, initialOffset.x, DEFAULT_STEPS_COUNT).map(
      (x) => ({ x, y: initialOffset.y })
    );
  }

  return [];
}

/**
 * Generate linear scroll values (with equal steps).
 */
export function linearInterpolator(
  end: number,
  start: number,
  steps: number
): number[] {
  if (end === start) {
    return [end];
  }

  const delta = (end - start) / (steps - 1);

  const result = [];
  for (let i = 0; i < steps; i += 1) {
    result.push(start + delta * i);
  }

  return result;
}

/**
 * Generate inertial scroll values (exponentially slowing down).
 */
export function inertialInterpolator(
  end: number,
  start: number,
  steps: number
): number[] {
  if (end === start) {
    return [end];
  }

  const result = [];
  let factor = 1;
  for (let i = 0; i < steps - 1; i += 1) {
    result.push(lerp(end, start, factor));
    factor /= 2;
  }

  result.push(end);
  return result;
}

/**
 * Linear interpolation function
 * @param v0
 * @param v1
 * @param t
 * @returns
 */
export function lerp(v0: number, v1: number, t: number) {
  return v0 + t * (v1 - v0);
}
