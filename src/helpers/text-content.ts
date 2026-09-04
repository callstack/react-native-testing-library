import type { TestInstance } from 'test-renderer';

import { getCustomTextValue } from './host-component-names';

export function getTextContent(instance: TestInstance | string | null): string {
  if (!instance) {
    return '';
  }

  if (typeof instance === 'string') {
    return instance;
  }

  // Custom host text elements, e.g. `<PlainText>` from `react-native-plain-text`,
  // hold their content in a prop rather than as string children.
  const customText = getCustomTextValue(instance);
  if (customText !== undefined) {
    return customText;
  }

  const result: string[] = [];
  instance.children?.forEach((child) => {
    result.push(getTextContent(child));
  });

  return result.join('');
}
