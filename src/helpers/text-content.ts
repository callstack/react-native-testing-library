import type { TestInstance } from 'test-renderer';

import { getHostPlainTextValue } from './host-component-names';

export function getTextContent(instance: TestInstance | string | null): string {
  if (!instance) {
    return '';
  }

  if (typeof instance === 'string') {
    return instance;
  }

  // Plain text host elements, e.g. `<PlainText>` from `react-native-plain-text`,
  // hold their content in the `text` prop rather than as string children.
  const plainText = getHostPlainTextValue(instance);
  if (plainText !== undefined) {
    return plainText;
  }

  const result: string[] = [];
  instance.children?.forEach((child) => {
    result.push(getTextContent(child));
  });

  return result.join('');
}
