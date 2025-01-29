import type { ReactTestInstance } from 'react-test-renderer';

import type { TextMatch, TextMatchOptions } from '../../matches';
import { matches } from '../../matches';
import { getTextContent } from '../text-content';

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
  options: TextMatchOptions = {},
) {
  const textContent = getTextContent(node);
  const { exact, normalizer } = options;
  return matches(text, textContent, normalizer, exact);
}
