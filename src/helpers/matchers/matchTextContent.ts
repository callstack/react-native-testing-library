import { Text } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { getConfig } from '../../config';
import { matches, TextMatch, TextMatchOptions } from '../../matches';
import { filterNodeByType } from '../filterNodeByType';
import { getTextContent } from '../getTextContent';
import { detectHostComponentNamesIfNeeded } from '../host-component-names';

type MatchTextContentParams = {
  node: ReactTestInstance;
  text: TextMatch;
  options?: TextMatchOptions;
};

export function matchTextContent({
  node,
  text,
  options = {},
}: MatchTextContentParams) {
  const typeToMatch = getConfig().useBreakingChanges
    ? detectHostComponentNamesIfNeeded().text
    : Text;
  if (!filterNodeByType(node, typeToMatch)) {
    return false;
  }

  const textContent = getTextContent(node);
  const { exact, normalizer } = options;
  return matches(text, textContent, normalizer, exact);
}
