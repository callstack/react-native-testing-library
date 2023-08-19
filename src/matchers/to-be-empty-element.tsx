import { ReactTestInstance } from 'react-test-renderer';
import { matcherHint, printReceived } from 'jest-matcher-utils';
import { getHostChildren } from '../helpers/component-tree';
import { checkHostElement } from './utils';

export function toBeEmptyElement(
  this: jest.MatcherContext,
  element: ReactTestInstance
) {
  checkHostElement(element, toBeEmptyElement, this);

  const pass = getHostChildren(element).length === 0;

  return {
    pass,
    message: () => {
      return [
        matcherHint(
          `${this.isNot ? '.not' : ''}.toBeEmptyElement`,
          'element',
          ''
        ),
        '',
        'Received:',
        `  ${printReceived(element.children)}`,
      ].join('\n');
    },
  };
}
