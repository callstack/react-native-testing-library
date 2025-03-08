import { matcherHint, RECEIVED_COLOR } from 'jest-matcher-utils';
import { HostElement } from 'universal-test-renderer';
import { checkHostElement } from './utils';
import redent from 'redent';
import { formatElementList } from '../helpers/format-element';

export function toBeEmptyElement(this: jest.MatcherContext, element: HostElement) {
  checkHostElement(element, toBeEmptyElement, this);

  const hostChildren = element?.children;

  return {
    pass: hostChildren?.length === 0,
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
