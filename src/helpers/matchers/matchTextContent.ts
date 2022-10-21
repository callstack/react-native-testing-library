import { Text } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { getConfig } from '../../config';
import { matches, TextMatch, TextMatchOptions } from '../../matches';
import { filterNodeByType } from '../filterNodeByType';
import { getTextContent } from '../getTextContent';
import { getHostComponentNames } from '../host-component-names';

/**
 * Matches the given node's text content against string or regex matcher.
 *
 * @param node - Node which text content will be matched
 * @param text - The string or regex to match.
 * @returns - Whether the node's text content matches the given string or regex.
 */
export function matchTextContent(
  node: ReactTestInstance,
  text: TextMatch,
  options: TextMatchOptions = {}
) {
  const textType = getConfig().useBreakingChanges
    ? getHostComponentNames().text
    : Text;
  if (!filterNodeByType(node, textType)) {
    return false;
  }

  const textContent = getTextContent(node);
  const { exact, normalizer } = options;
  return matches(text, textContent, normalizer, exact);
}
