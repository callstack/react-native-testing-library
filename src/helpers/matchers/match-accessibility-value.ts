import { HostElement } from 'universal-test-renderer';
import { computeAriaValue } from '../accessibility';
import { matchStringProp } from './match-string-prop';
import type { TextMatch } from '../../matches';

export interface AccessibilityValueMatcher {
  min?: number;
  max?: number;
  now?: number;
  text?: TextMatch;
}

export function matchAccessibilityValue(
  node: HostElement,
  matcher: AccessibilityValueMatcher,
): boolean {
  const value = computeAriaValue(node);
  return (
    (matcher.min === undefined || matcher.min === value?.min) &&
    (matcher.max === undefined || matcher.max === value?.max) &&
    (matcher.now === undefined || matcher.now === value?.now) &&
    (matcher.text === undefined || matchStringProp(value?.text, matcher.text))
  );
}
