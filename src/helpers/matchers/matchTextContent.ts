import { Text } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { matches, TextMatch, TextMatchOptions } from '../../matches';
import { filterNodeByType } from '../filterNodeByType';
import { getTextContent } from '../textContent';

export function matchTextContent(
  node: ReactTestInstance,
  text: TextMatch,
  options: TextMatchOptions = {}
) {
  if (!filterNodeByType(node, Text)) {
    return false;
  }

  const textContent = getTextContent(node);
  const { exact, normalizer } = options;
  return matches(text, textContent, normalizer, exact);
}
