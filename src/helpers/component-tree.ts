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
 * Returns host children for given element.
 * @param element The element start traversing from.
 */
export function getHostChildren(element: HostElement | null): HostElement[] {
  if (element == null) {
    return [];
  }

  const hostChildren: HostElement[] = [];

  element.children.forEach((child) => {
    if (typeof child !== 'object') {
      return;
    }

    if (isHostElement(child)) {
      hostChildren.push(child);
    } else {
      hostChildren.push(...getHostChildren(child));
    }
  });

  return hostChildren;
}

/**
 * Return the array of host elements that represent the passed element.
 *
 * @param element The element start traversing from.
 * @returns If the passed element is a host element, it will return an array containing only that element,
 * if the passed element is a composite element, it will return an array containing its host children (zero, one or many).
 */
export function getHostSelves(element: HostElement | null): HostElement[] {
  return isHostElement(element) ? [element] : getHostChildren(element);
}

/**
 * Returns host siblings for given element.
 * @param element The element start traversing from.
 */
export function getHostSiblings(element: HostElement | null): HostElement[] {
  const hostParent = element?.parent;
  const hostSelves = getHostSelves(element);
  return getHostChildren(hostParent).filter((sibling) => !hostSelves.includes(sibling));
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
