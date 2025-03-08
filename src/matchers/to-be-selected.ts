import { matcherHint } from 'jest-matcher-utils';
import { HostElement } from 'universal-test-renderer';
import { computeAriaSelected } from '../helpers/accessibility';
import { formatElement } from '../helpers/format-element';
import { checkHostElement } from './utils';
import redent from 'redent';

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
        redent(formatElement(element), 2),
      ].join('\n');
    },
  };
}
