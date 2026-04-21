import type { TestInstance } from 'test-renderer';

import type { TextMatch, TextMatchOptions } from '../../matches';
import { matches } from '../../matches';
import { computeAriaLabel } from '../accessibility';

export function matchAccessibilityLabel(
  instance: TestInstance,
  expectedLabel: TextMatch,
  options?: TextMatchOptions,
) {
  return matches(expectedLabel, computeAriaLabel(instance), options?.normalizer, options?.exact);
}
