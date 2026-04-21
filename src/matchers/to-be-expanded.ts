import { matcherHint } from 'jest-matcher-utils';
import redent from 'redent';
import type { TestInstance } from 'test-renderer';

import { computeAriaExpanded } from '../helpers/accessibility';
import { formatElement } from '../helpers/format-element';
import { checkHostElement } from './utils';

export function toBeExpanded(this: jest.MatcherContext, element: TestInstance) {
  checkHostElement(element, toBeExpanded, this);

  return {
    pass: computeAriaExpanded(element) === true,
    message: () => {
      const matcher = matcherHint(`${this.isNot ? '.not' : ''}.toBeExpanded`, 'element', '');
      return [
        matcher,
        '',
        `Received element is ${this.isNot ? '' : 'not '}expanded:`,
        redent(formatElement(element), 2),
      ].join('\n');
    },
  };
}

export function toBeCollapsed(this: jest.MatcherContext, element: TestInstance) {
  checkHostElement(element, toBeCollapsed, this);

  return {
    pass: computeAriaExpanded(element) === false,
    message: () => {
      const matcher = matcherHint(`${this.isNot ? '.not' : ''}.toBeCollapsed`, 'element', '');
      return [
        matcher,
        '',
        `Received element is ${this.isNot ? '' : 'not '}collapsed:`,
        redent(formatElement(element), 2),
      ].join('\n');
    },
  };
}
