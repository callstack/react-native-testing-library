import type { TestInstance } from 'test-renderer';

export function getTextContent(instance: TestInstance | string | null): string {
  if (!instance) {
    return '';
  }

  if (typeof instance === 'string') {
    return instance;
  }

  const result: string[] = [];
  instance.children?.forEach((child) => {
    result.push(getTextContent(child));
  });

  return result.join('');
}
