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

  return generateScrollValues(
    initialOffset.y,
    targetY,
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

  return generateScrollValues(
    initialOffset.x,
    targetX,
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
export function generateScrollValues(
  from: number,
  to: number,
  count: number
): number[] {
  if (from === to) {
    return [];
  }

  const step = (to - from) / count;
  const stepsArray = [];
  for (let i = 0; i <= count; i++) {
    stepsArray.push(from + step * i);
  }

  return stepsArray;
}
