import type { HostElement } from 'universal-test-renderer';

import { screen } from '../screen';

/**
 * Checks if the given element is a host element.
 * @param element The element to check.
 */
export function isHostElement(element?: HostElement | null): element is HostElement {
  return typeof element?.type === 'string';
}

export function isElementMounted(element: HostElement) {
  return getContainerElement(element) === screen.container;
}

/**
 * Returns host siblings for given element.
 * @param element The element start traversing from.
 */
export function getHostSiblings(element: HostElement): HostElement[] {
  // Should not happen
  const parent = element.parent;
  if (!parent) {
    return [];
  }

  return parent.children.filter(
    (sibling) => typeof sibling !== 'string' && sibling !== element,
  ) as HostElement[];
}

/**
 * Returns the containerelement of the tree.
 *
 * @param element The element start traversing from.
 * @returns The container element of the tree.
 */
export function getContainerElement(element: HostElement) {
  let current = element;
  while (current.parent) {
    current = current.parent;
  }

  return current;
}
