import type { ReactTestInstance } from 'react-test-renderer';
import { screen } from '../screen';
/**
 * ReactTestInstance referring to host element.
 */
export type HostTestInstance = ReactTestInstance & { type: string };

/**
 * Checks if the given element is a host element.
 * @param element The element to check.
 */
export function isHostElement(element?: ReactTestInstance | null): element is HostTestInstance {
  return typeof element?.type === 'string';
}

export function isElementMounted(element: ReactTestInstance) {
  return getUnsafeRootElement(element) === screen.UNSAFE_root;
}

/**
 * Returns first host ancestor for given element.
 * @param element The element start traversing from.
 */
export function getHostParent(element: ReactTestInstance | null): HostTestInstance | null {
  if (element == null) {
    return null;
  }

  let current = element.parent;
  while (current) {
    if (isHostElement(current)) {
      return current;
    }

    current = current.parent;
  }

  return null;
}

/**
 * Returns host children for given element.
 * @param element The element start traversing from.
 */
export function getHostChildren(element: ReactTestInstance | null): HostTestInstance[] {
  if (element == null) {
    return [];
  }

  const hostChildren: HostTestInstance[] = [];

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
export function getHostSelves(element: ReactTestInstance | null): HostTestInstance[] {
  return isHostElement(element) ? [element] : getHostChildren(element);
}

/**
 * Returns host siblings for given element.
 * @param element The element start traversing from.
 */
export function getHostSiblings(element: ReactTestInstance | null): HostTestInstance[] {
  const hostParent = getHostParent(element);
  const hostSelves = getHostSelves(element);
  return getHostChildren(hostParent).filter((sibling) => !hostSelves.includes(sibling));
}

/**
 * Returns the unsafe root element of the tree (probably composite).
 *
 * @param element The element start traversing from.
 * @returns The root element of the tree (host or composite).
 */
export function getUnsafeRootElement(element: ReactTestInstance) {
  let current = element;
  while (current.parent) {
    current = current.parent;
  }

  return current;
}
