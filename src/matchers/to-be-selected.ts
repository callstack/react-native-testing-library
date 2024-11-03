import { matcherHint } from 'jest-matcher-utils';
import { HostComponent } from 'universal-test-renderer';
import { computeAriaSelected } from '../helpers/accessibility';
import { checkHostElement, formatElement } from './utils';

export function toBeSelected(this: jest.MatcherContext, element: HostComponent) {
  checkHostElement(element, toBeSelected, this);

  return {
    pass: computeAriaSelected(element),
    message: () => {
      const is = this.isNot ? 'is' : 'is not';
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeSelected`, 'element', ''),
        '',
        `Received element ${is} selected`,
        formatElement(element),
      ].join('\n');
    },
  };
}
