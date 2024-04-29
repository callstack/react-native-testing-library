import { ReactTestInstance } from 'react-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import { isElementCollapsed } from '../helpers/accessibility';
import { checkHostElement, formatElement } from './utils';

export function toBeCollapsed(this: jest.MatcherContext, element: ReactTestInstance) {
  checkHostElement(element, toBeCollapsed, this);

  return {
    pass: isElementCollapsed(element),
    message: () => {
      const matcher = matcherHint(`${this.isNot ? '.not' : ''}.toBeCollapsed`, 'element', '');
      return [
        matcher,
        '',
        `Received element is ${this.isNot ? '' : 'not '}collapsed:`,
        formatElement(element),
      ].join('\n');
    },
  };
}
