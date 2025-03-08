import type { Point } from '../../types';

const DEFAULT_STEPS_COUNT = 5;

type InterpolatorFn = (end: number, start: number, steps: number) => number[];

export function createScrollSteps(
  target: Partial<Point>,
  initialOffset: Point,
  interpolator: InterpolatorFn,
): Point[] {
  if (target.y != null) {
    return interpolator(target.y, initialOffset.y, DEFAULT_STEPS_COUNT).map((y) => ({
      y,
      x: initialOffset.x,
    }));
  }

  if (target.x != null) {
    return interpolator(target.x, initialOffset.x, DEFAULT_STEPS_COUNT).map((x) => ({
      x,
      y: initialOffset.y,
    }));
  }

  return [];
}

/**
 * Generate linear scroll values (with equal steps).
 */
export function linearInterpolator(end: number, start: number, steps: number): number[] {
  if (end === start) {
    return [end, start];
  }

  const result = [];
  for (let i = 0; i < steps; i += 1) {
    result.push(lerp(start, end, i / (steps - 1)));
  }

  return result;
}

/**
 * Generate inertial scroll values (exponentially slowing down).
 */
export function inertialInterpolator(end: number, start: number, steps: number): number[] {
  if (end === start) {
    return [end, start];
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
 * @param v0 initial value (when t = 0)
 * @param v1 final value (when t = 1)
 * @param t interpolation factor form 0 to 1
 * @returns interpolated value between v0 and v1
 */
export function lerp(v0: number, v1: number, t: number) {
  return v0 + t * (v1 - v0);
}
