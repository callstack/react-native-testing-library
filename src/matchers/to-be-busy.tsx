import { ReactTestInstance } from 'react-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import { computeAriaBusy } from '../helpers/accessibility';
import { checkHostElement, formatElement } from './utils';

export function toBeBusy(this: jest.MatcherContext, element: ReactTestInstance) {
  checkHostElement(element, toBeBusy, this);

  return {
    pass: computeAriaBusy(element),
    message: () => {
      const matcher = matcherHint(`${this.isNot ? '.not' : ''}.toBeBusy`, 'element', '');
      return [
        matcher,
        '',
        `Received element is ${this.isNot ? '' : 'not '}busy:`,
        formatElement(element),
      ].join('\n');
    },
  };
}
