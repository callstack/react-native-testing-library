import { matcherHint } from 'jest-matcher-utils';
import { HostElement } from 'universal-test-renderer';
import { computeAriaExpanded } from '../helpers/accessibility';
import { formatElement } from '../helpers/format-element';
import { checkHostElement } from './utils';
import redent from 'redent';

export function toBeExpanded(this: jest.MatcherContext, element: HostElement) {
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

export function toBeCollapsed(this: jest.MatcherContext, element: HostElement) {
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
