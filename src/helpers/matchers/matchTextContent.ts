import { ElementType } from 'react';
import type { ReactTestInstance } from 'react-test-renderer';
import { matches, TextMatch, TextMatchOptions } from '../../matches';
import { filterNodeByType } from '../filterNodeByType';
import { getTextContent } from '../getTextContent';

type MatchTextContentParams = {
  node: ReactTestInstance;
  text: TextMatch;
  typeToMatch: ElementType | string;
  options?: TextMatchOptions;
};

export function matchTextContent({
  node,
  text,
  typeToMatch,
  options = {},
}: MatchTextContentParams) {
  if (!filterNodeByType(node, typeToMatch)) {
    return false;
  }

  const textContent = getTextContent(node);
  const { exact, normalizer } = options;
  return matches(text, textContent, normalizer, exact);
}
