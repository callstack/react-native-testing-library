import { matcherHint, RECEIVED_COLOR } from 'jest-matcher-utils';
import { HostElement } from 'universal-test-renderer';
import { checkHostElement, formatElementArray } from './utils';

export function toBeEmptyElement(this: jest.MatcherContext, element: HostElement) {
  checkHostElement(element, toBeEmptyElement, this);

  const hostChildren = element.children;

  return {
    pass: hostChildren.length === 0,
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeEmptyElement`, 'element', ''),
        '',
        'Received:',
        `${RECEIVED_COLOR(formatElementArray(hostChildren))}`,
      ].join('\n');
    },
  };
}
