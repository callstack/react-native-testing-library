import { matcherHint, RECEIVED_COLOR } from 'jest-matcher-utils';
import redent from 'redent';
import type { HostElement } from 'universal-test-renderer';

import { isHostElement } from '../helpers/component-tree';
import { formatElementList } from '../helpers/format-element';
import { checkHostElement } from './utils';

export function toBeEmptyElement(this: jest.MatcherContext, element: HostElement) {
  checkHostElement(element, toBeEmptyElement, this);

  // TODO check
  const children = element.children.filter((child) => isHostElement(child));

  return {
    pass: children.length === 0,
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeEmptyElement`, 'element', ''),
        '',
        'Received:',
        `${RECEIVED_COLOR(redent(formatElementList(children), 2))}`,
      ].join('\n');
    },
  };
}
