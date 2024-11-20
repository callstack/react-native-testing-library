import { HostElement } from 'universal-test-renderer';
import { matches, TextMatch, TextMatchOptions } from '../../matches';
import { computeAriaLabel } from '../accessibility';

export function matchAccessibilityLabel(
  element: HostElement,
  expectedLabel: TextMatch,
  options?: TextMatchOptions,
) {
  return matches(expectedLabel, computeAriaLabel(element), options?.normalizer, options?.exact);
}
