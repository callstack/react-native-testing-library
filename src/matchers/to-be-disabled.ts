import { matcherHint } from 'jest-matcher-utils';
import redent from 'redent';
import type { TestInstance } from 'test-renderer';

import { computeAriaDisabled } from '../helpers/accessibility';
import { formatElement } from '../helpers/format-element';
import { checkHostElement } from './utils';

export function toBeDisabled(this: jest.MatcherContext, instance: TestInstance) {
  checkHostElement(instance, toBeDisabled, this);

  const isDisabled = computeAriaDisabled(instance);

  return {
    pass: isDisabled,
    message: () => {
      const is = this.isNot ? 'is' : 'is not';
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeDisabled`, 'instance', ''),
        '',
        `Received instance ${is} disabled:`,
        redent(formatElement(instance), 2),
      ].join('\n');
    },
  };
}

export function toBeEnabled(this: jest.MatcherContext, instance: TestInstance) {
  checkHostElement(instance, toBeEnabled, this);

  const isEnabled = !computeAriaDisabled(instance);

  return {
    pass: isEnabled,
    message: () => {
      const is = this.isNot ? 'is' : 'is not';
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeEnabled`, 'instance', ''),
        '',
        `Received instance ${is} enabled:`,
        redent(formatElement(instance), 2),
      ].join('\n');
    },
  };
}
