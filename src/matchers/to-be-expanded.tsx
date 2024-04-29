import { ReactTestInstance } from 'react-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import { isElementExpanded } from '../helpers/accessibility';
import { checkHostElement, formatElement } from './utils';

export function toBeExpanded(this: jest.MatcherContext, element: ReactTestInstance) {
  checkHostElement(element, toBeExpanded, this);

  return {
    pass: isElementExpanded(element),
    message: () => {
      const matcher = matcherHint(`${this.isNot ? '.not' : ''}.toBeExpanded`, 'element', '');
      return [
        matcher,
        '',
        `Received element is ${this.isNot ? '' : 'not '}expanded:`,
        formatElement(element),
      ].join('\n');
    },
  };
}
