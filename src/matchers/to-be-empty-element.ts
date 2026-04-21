import { matcherHint, RECEIVED_COLOR } from 'jest-matcher-utils';
import redent from 'redent';
import type { TestInstance } from 'test-renderer';

import { isTestInstance } from '../helpers/component-tree';
import { formatElementList } from '../helpers/format-element';
import { checkHostElement } from './utils';

export function toBeEmptyElement(this: jest.MatcherContext, instance: TestInstance) {
  checkHostElement(instance, toBeEmptyElement, this);

  // TODO check
  const children = instance.children.filter((child) => isTestInstance(child));

  return {
    pass: children.length === 0,
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeEmptyElement`, 'instance', ''),
        '',
        'Received:',
        `${RECEIVED_COLOR(redent(formatElementList(children), 2))}`,
      ].join('\n');
    },
  };
}
