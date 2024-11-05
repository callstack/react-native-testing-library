import { ReactTestInstance } from 'react-test-renderer';
import { matcherHint, RECEIVED_COLOR } from 'jest-matcher-utils';
import { getHostChildren } from '../helpers/component-tree';
import { checkHostElement, formatElementArray } from './utils';

export function toBeEmptyElement(this: jest.MatcherContext, element: ReactTestInstance) {
  checkHostElement(element, toBeEmptyElement, this);

  const hostChildren = getHostChildren(element);

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
