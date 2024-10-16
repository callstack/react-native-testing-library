import { matcherHint } from 'jest-matcher-utils';
import { computeAriaSelected } from '../helpers/accessibility';
import { HostElement } from '../renderer/host-element';
import { checkHostElement, formatElement } from './utils';

export function toBeSelected(this: jest.MatcherContext, element: HostElement) {
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
