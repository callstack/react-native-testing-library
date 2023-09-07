import { ReactTestInstance } from 'react-test-renderer';
import { matchAccessibilityState } from '../helpers/matchers/accessibilityState';
import { checkHostElement } from './utils';

export function toBeBusy(
  this: jest.MatcherContext,
  element: ReactTestInstance
) {
  checkHostElement(element, toBeBusy, this);

  return {
    pass: matchAccessibilityState(element, { busy: true }),
    message: () => '',
  };
}
