import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint, RECEIVED_COLOR } from 'jest-matcher-utils';
import { screen } from '../screen';
import { checkHostElement, printElement } from './utils';

export function toBeOnTheScreen(
  this: jest.MatcherContext,
  element: ReactTestInstance
) {
  if (element !== null || !this.isNot) {
    checkHostElement(element, toBeOnTheScreen, this);
  }

  const pass =
    element === null ? false : screen.UNSAFE_root === getRootElement(element);

  const errorFound = () => {
    return `expected element tree not to contain element, but found\n${printElement(
      element
    )}`;
  };

  const errorNotFound = () => {
    return `element could not be found in the element tree`;
  };

  return {
    pass,
    message: () => {
      return [
        matcherHint(
          `${this.isNot ? '.not' : ''}.toBeOnTheScreen`,
          'element',
          ''
        ),
        '',
        RECEIVED_COLOR(this.isNot ? errorFound() : errorNotFound()),
      ].join('\n');
    },
  };
}

function getRootElement(element: ReactTestInstance) {
  let root = element;
  while (root.parent) {
    root = root.parent;
  }
  return root;
}
