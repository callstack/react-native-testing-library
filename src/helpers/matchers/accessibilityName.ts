import { ReactTestInstance } from 'react-test-renderer';
import { getAccessibleName } from '../accessiblity';
import { TextMatchOptions, matches, TextMatch } from '../../matches';

export function matchAccessibleName(
  node: ReactTestInstance,
  expectedName?: TextMatch,
  normalizer?: TextMatchOptions['normalizer'],
  exact?: TextMatchOptions['exact']
): boolean {
  const accessibleName = getAccessibleName(node);

  if (expectedName) {
    return matches(expectedName, accessibleName, normalizer, exact);
  }

  return !!accessibleName;
}
