import { matcherHint } from 'jest-matcher-utils';
import { HostElement } from 'universal-test-renderer';
import { computeAriaBusy } from '../helpers/accessibility';
import { checkHostElement, formatElement } from './utils';

export function toBeBusy(this: jest.MatcherContext, element: HostElement) {
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
