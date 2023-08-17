import { ContentOffset } from '../event-builder/scroll';

const DEFAULT_STEPS_COUNT = 5;

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

export function generateScrollSteps(
  targetY: number | number[] | undefined,
  targetX: number | number[] | undefined,
  initialState: ContentOffset
): ContentOffset[] {
  if (Array.isArray(targetY)) {
    return targetY.map((y) => ({ y, x: initialState.x }));
  }

  if (targetY != null) {
    return generateScrollValues(
      initialState.y,
      targetY,
      DEFAULT_STEPS_COUNT
    ).map((y) => ({ y, x: initialState.x }));
  }

  if (Array.isArray(targetX)) {
    return targetX.map((x) => ({ x, y: initialState.y }));
  }

  if (targetX != null) {
    return generateScrollValues(
      initialState.x,
      targetX,
      DEFAULT_STEPS_COUNT
    ).map((x) => ({ x, y: initialState.y }));
  }

  return [];
}
