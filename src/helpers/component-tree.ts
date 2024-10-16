import { HostElement } from '../renderer/host-element';

/**
 * Checks if the given element is a host element.
 * @param element The element to check.
 */
export function isHostElement(element?: HostElement | null): element is HostElement {
  return typeof element?.type === 'string' && element.type !== 'CONTAINER';
}

/**
 * Returns host siblings for given element.
 * @param element The element start traversing from.
 */
export function getHostSiblings(element: HostElement | null): HostElement[] {
  const hostParent = element?.parent ?? null;
  return (
    hostParent?.children.filter(
      (sibling): sibling is HostElement => typeof sibling === 'object' && sibling !== element,
    ) ?? []
  );
}

/**
 * Returns the unsafe root element of the tree (probably composite).
 *
 * @param element The element start traversing from.
 * @returns The root element of the tree (host or composite).
 */
export function getUnsafeRootElement(element: HostElement) {
  let current: HostElement | null = element;
  while (current?.parent) {
    current = current.parent;
  }

  return current;
}
