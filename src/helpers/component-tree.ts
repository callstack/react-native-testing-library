import { ReactTestInstance } from 'react-test-renderer';

/**
 * Checks if the given element is a host element.
 * @param element The element to check.
 */
export function isHostElement(element?: ReactTestInstance | null): boolean {
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
 * Return a single host element that represent the passed host or composite element.
 *
 * @param element The element start traversing from.
 * @throws Error if the passed element is a composite element and has no host children or has more than one host child.
 * @returns If the passed element is a host element, it will return itself, if the passed element is a composite
 * element, it will return a single host descendant.
 */
export function getHostSelf(
  element: ReactTestInstance | null
): ReactTestInstance {
  const hostSelves = getHostSelves(element);

  if (hostSelves.length === 0) {
    throw new Error(`Expected exactly one host element, but found none.`);
  }

  if (hostSelves.length > 1) {
    throw new Error(
      `Expected exactly one host element, but found ${hostSelves.length}.`
    );
  }

  return hostSelves[0];
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
