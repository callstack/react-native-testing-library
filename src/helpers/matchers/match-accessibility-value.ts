import { ReactTestInstance } from 'react-test-renderer';
import { getAccessibilityValue } from '../accessiblity';
import { TextMatch } from '../../matches';
import { matchStringProp } from './match-string-prop';

export interface AccessibilityValueMatcher {
  min?: number;
  max?: number;
  now?: number;
  text?: TextMatch;
}

export function matchAccessibilityValue(
  node: ReactTestInstance,
  matcher: AccessibilityValueMatcher,
): boolean {
  const value = getAccessibilityValue(node);
  return (
    (matcher.min === undefined || matcher.min === value?.min) &&
    (matcher.max === undefined || matcher.max === value?.max) &&
    (matcher.now === undefined || matcher.now === value?.now) &&
    (matcher.text === undefined || matchStringProp(value?.text, matcher.text))
  );
}
