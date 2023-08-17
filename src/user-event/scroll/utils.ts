import { ContentOffset } from '../event-builder/scroll';

const DEFAULT_STEPS_COUNT = 5;

export function generateScrollSteps(
  targetOffset: { x?: number | number[]; y?: number | number[] },
  initialOffset: ContentOffset
): ContentOffset[] {
  if (Array.isArray(targetOffset.y)) {
    return targetOffset.y.map((y) => ({ y, x: initialOffset.x }));
  }

  if (targetOffset.y != null) {
    return generateScrollValues(
      initialOffset.y,
      targetOffset.y,
      DEFAULT_STEPS_COUNT
    ).map((y) => ({ y, x: initialOffset.x }));
  }

  if (Array.isArray(targetOffset.x)) {
    return targetOffset.x.map((x) => ({ x, y: initialOffset.y }));
  }

  if (targetOffset.x != null) {
    return generateScrollValues(
      initialOffset.x,
      targetOffset.x,
      DEFAULT_STEPS_COUNT
    ).map((x) => ({ x, y: initialOffset.y }));
  }

  return [];
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
