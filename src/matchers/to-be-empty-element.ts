import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint, RECEIVED_COLOR } from 'jest-matcher-utils';
import redent from 'redent';
import { getHostChildren } from '../helpers/component-tree';
import { formatElementList } from '../helpers/format-element';
import { checkHostElement } from './utils';

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
        `${RECEIVED_COLOR(redent(formatElementList(hostChildren), 2))}`,
      ].join('\n');
    },
  };
}
