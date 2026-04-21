import { matcherHint } from 'jest-matcher-utils';
import redent from 'redent';
import type { TestInstance } from 'test-renderer';

import { computeAriaExpanded } from '../helpers/accessibility';
import { formatElement } from '../helpers/format-element';
import { checkHostElement } from './utils';

export function toBeExpanded(this: jest.MatcherContext, instance: TestInstance) {
  checkHostElement(instance, toBeExpanded, this);

  return {
    pass: computeAriaExpanded(instance) === true,
    message: () => {
      const matcher = matcherHint(`${this.isNot ? '.not' : ''}.toBeExpanded`, 'instance', '');
      return [
        matcher,
        '',
        `Received instance is ${this.isNot ? '' : 'not '}expanded:`,
        redent(formatElement(instance), 2),
      ].join('\n');
    },
  };
}

export function toBeCollapsed(this: jest.MatcherContext, instance: TestInstance) {
  checkHostElement(instance, toBeCollapsed, this);

  return {
    pass: computeAriaExpanded(instance) === false,
    message: () => {
      const matcher = matcherHint(`${this.isNot ? '.not' : ''}.toBeCollapsed`, 'instance', '');
      return [
        matcher,
        '',
        `Received instance is ${this.isNot ? '' : 'not '}collapsed:`,
        redent(formatElement(instance), 2),
      ].join('\n');
    },
  };
}
