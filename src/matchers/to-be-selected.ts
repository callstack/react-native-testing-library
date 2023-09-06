import { ReactTestInstance } from 'react-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import { getAccessibilityState } from '../helpers/accessiblity';
import { checkHostElement, formatElement, formatMessage } from './utils';

export function toBeSelected(
  this: jest.MatcherContext,
  element: ReactTestInstance
) {
  checkHostElement(element, toBeSelected, this);

  return {
    pass: getAccessibilityState(element)?.selected === true,
    message: () => {
      const is = this.isNot ? 'is' : 'is not';
      const matcher = matcherHint(
        `${this.isNot ? '.not' : ''}.toBeSelected`,
        'element',
        ''
      );
      return formatMessage(
        matcher,
        `Expected the element ${
          this.isNot ? 'not to' : 'to'
        } have accessibility state selected`,
        '',
        `Received element ${is} selected`,
        formatElement(element)
      );
    },
  };
}
