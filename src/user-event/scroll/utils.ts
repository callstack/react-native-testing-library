import { ContentOffset } from '../event-builder/scroll';

const DEFAULT_STEPS_COUNT = 5;

export function createVerticalScrollSteps(
  targetY: number | number[] | undefined,
  initialOffset: ContentOffset
): ContentOffset[] {
  if (targetY == null) {
    return [];
  }

  if (Array.isArray(targetY)) {
    return targetY.map((y) => ({ y, x: initialOffset.x }));
  }

  return interpolateLinearSteps(
    targetY,
    initialOffset.y,
    DEFAULT_STEPS_COUNT
  ).map((y) => ({ y, x: initialOffset.x }));
}

export function createHorizontalScrollSteps(
  targetX: number | number[] | undefined,
  initialOffset: ContentOffset
): ContentOffset[] {
  if (targetX == null) {
    return [];
  }

  if (Array.isArray(targetX)) {
    return targetX.map((x) => ({ x, y: initialOffset.y }));
  }

  return interpolateLinearSteps(
    targetX,
    initialOffset.x,
    DEFAULT_STEPS_COUNT
  ).map((x) => ({ x, y: initialOffset.y }));
}

/**
 * Generates scroll intermediate values.
 * @param from
 * @param to
 * @param count
 * @returns
 */
export function interpolateLinearSteps(
  end: number,
  start: number,
  steps: number
): number[] {
  if (end === start) {
    return [];
  }

  const delta = (end - start) / (steps - 1);

  const result = [];
  for (let i = 0; i < steps; i++) {
    result.push(start + delta * i);
  }

  return result;
}
