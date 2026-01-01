import type { HostElement } from 'universal-test-renderer';

export function getTextContent(element: HostElement | string | null): string {
  if (!element) {
    return '';
  }

  if (typeof element === 'string') {
    return element;
  }

  const result: string[] = [];
  element.children?.forEach((child) => {
    result.push(getTextContent(child));
  });

  return result.join('');
}
