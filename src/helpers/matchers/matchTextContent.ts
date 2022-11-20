import { ElementType } from 'react';
import type { ReactTestInstance } from 'react-test-renderer';
import { matches, TextMatch, TextMatchOptions } from '../../matches';
import { filterNodeByType } from '../filterNodeByType';
import { getTextContent } from '../getTextContent';

export function matchTextContent(
  node: ReactTestInstance,
  text: TextMatch,
  typeToMatch: ElementType | string,
  options: TextMatchOptions = {}
) {
  if (!filterNodeByType(node, typeToMatch)) {
    return false;
  }

  const textContent = getTextContent(node);
  const { exact, normalizer } = options;
  return matches(text, textContent, normalizer, exact);
}
