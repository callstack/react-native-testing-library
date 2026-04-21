import { matcherHint } from 'jest-matcher-utils';
import redent from 'redent';
import type { TestInstance } from 'test-renderer';

import { computeAriaSelected } from '../helpers/accessibility';
import { formatElement } from '../helpers/format-element';
import { checkHostElement } from './utils';

export function toBeSelected(this: jest.MatcherContext, instance: TestInstance) {
  checkHostElement(instance, toBeSelected, this);

  return {
    pass: computeAriaSelected(instance),
    message: () => {
      const is = this.isNot ? 'is' : 'is not';
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeSelected`, 'instance', ''),
        '',
        `Received instance ${is} selected`,
        redent(formatElement(instance), 2),
      ].join('\n');
    },
  };
}
