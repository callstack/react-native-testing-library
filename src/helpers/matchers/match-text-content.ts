import type { TestInstance } from 'test-renderer';

import type { TextMatch, TextMatchOptions } from '../../matches';
import { matches } from '../../matches';
import { getTextContent } from '../text-content';

/**
 * Matches the given instance's text content against string or regex matcher.
 *
 * @param instance - Instance which text content will be matched
 * @param text - The string or regex to match.
 * @returns - Whether the instance's text content matches the given string or regex.
 */
export function matchTextContent(
  instance: TestInstance,
  text: TextMatch,
  options: TextMatchOptions = {},
) {
  const textContent = getTextContent(instance);
  const { exact, normalizer } = options;
  return matches(text, textContent, normalizer, exact);
}
