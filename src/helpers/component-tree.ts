import { ReactTestInstance } from 'react-test-renderer';

/**
 * Checks if the given element is a host element.
 * @param element The element to check.
 */
export function isHostElement(element?: ReactTestInstance | null) {
  return typeof element?.type === 'string';
}

/**
 * Returns first host ancestor for given element.
 * @param element The element start traversing from.
 */
export function getHostParent(
  element: ReactTestInstance | null
): ReactTestInstance | null {
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
export function getHostChildren(
  element: ReactTestInstance | null
): ReactTestInstance[] {
  if (element == null) {
    return [];
  }

  const hostChildren: ReactTestInstance[] = [];

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
export function getHostSelves(
  element: ReactTestInstance | null
): ReactTestInstance[] {
  return typeof element?.type === 'string'
    ? [element]
    : getHostChildren(element);
}

/**
 * Returns host siblings for given element.
 * @param element The element start traversing from.
 */
export function getHostSiblings(
  element: ReactTestInstance | null
): ReactTestInstance[] {
  const hostParent = getHostParent(element);
  const hostSelves = getHostSelves(element);
  return getHostChildren(hostParent).filter(
    (sibling) => !hostSelves.includes(sibling)
  );
}
