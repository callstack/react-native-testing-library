import type { TestInstance } from 'test-renderer';

export function getTextContent(element: TestInstance | string | null): string {
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
