import type { TestInstance, TestNode } from 'test-renderer';

import { screen } from '../screen';

/**
 * Checks if the given element is a host element.
 * @param node The element to check.
 */
export function isTestInstance(node?: TestNode | null): node is TestInstance {
  return typeof node !== 'string' && typeof node?.type === 'string';
}

export function isInstanceMounted(instance: TestInstance) {
  return getContainerInstance(instance) === screen.container;
}

/**
 * Returns host siblings for given element.
 * @param instance The element start traversing from.
 */
export function getInstanceSiblings(instance: TestInstance): TestInstance[] {
  // Should not happen
  const parent = instance.parent;
  if (!parent) {
    return [];
  }

  return parent.children.filter(
    (sibling) => typeof sibling !== 'string' && sibling !== instance,
  ) as TestInstance[];
}

/**
 * Returns the container element of the tree.
 *
 * @param instance The element start traversing from.
 * @returns The container element of the tree.
 */
export function getContainerInstance(instance: TestInstance) {
  let current = instance;
  while (current.parent) {
    current = current.parent;
  }

  return current;
}

/**
 * Returns the element itself or its nearest ancestor that matches the predicate.
 *
 * @param instance The element start traversing from.
 * @returns The matching element, or `null` when there is none.
 */
export function findClosestInstance(
  instance: TestInstance,
  predicate: (instance: TestInstance) => boolean,
): TestInstance | null {
  let current: TestInstance | null = instance;
  while (current != null && !predicate(current)) {
    current = current.parent;
  }

  return current;
}
