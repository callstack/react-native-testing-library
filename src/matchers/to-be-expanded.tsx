import { matcherHint } from 'jest-matcher-utils';
import { HostComponent } from 'universal-test-renderer';
import { computeAriaExpanded } from '../helpers/accessibility';
import { checkHostElement, formatElement } from './utils';

export function toBeExpanded(this: jest.MatcherContext, element: HostComponent) {
  checkHostElement(element, toBeExpanded, this);

  return {
    pass: computeAriaExpanded(element) === true,
    message: () => {
      const matcher = matcherHint(`${this.isNot ? '.not' : ''}.toBeExpanded`, 'element', '');
      return [
        matcher,
        '',
        `Received element is ${this.isNot ? '' : 'not '}expanded:`,
        formatElement(element),
      ].join('\n');
    },
  };
}

export function toBeCollapsed(this: jest.MatcherContext, element: HostComponent) {
  checkHostElement(element, toBeCollapsed, this);

  return {
    pass: computeAriaExpanded(element) === false,
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
