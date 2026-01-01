import type { HostElement } from 'universal-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import redent from 'redent';

import { computeAriaBusy } from '../helpers/accessibility';
import { formatElement } from '../helpers/format-element';
import { checkHostElement } from './utils';

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
        redent(formatElement(element), 2),
      ].join('\n');
    },
  };
}
