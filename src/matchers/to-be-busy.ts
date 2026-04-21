import { matcherHint } from 'jest-matcher-utils';
import redent from 'redent';
import type { TestInstance } from 'test-renderer';

import { computeAriaBusy } from '../helpers/accessibility';
import { formatElement } from '../helpers/format-element';
import { checkHostElement } from './utils';

export function toBeBusy(this: jest.MatcherContext, instance: TestInstance) {
  checkHostElement(instance, toBeBusy, this);

  return {
    pass: computeAriaBusy(instance),
    message: () => {
      const matcher = matcherHint(`${this.isNot ? '.not' : ''}.toBeBusy`, 'instance', '');
      return [
        matcher,
        '',
        `Received instance is ${this.isNot ? '' : 'not '}busy:`,
        redent(formatElement(instance), 2),
      ].join('\n');
    },
  };
}
