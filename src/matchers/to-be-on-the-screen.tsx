import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint, RECEIVED_COLOR } from 'jest-matcher-utils';
import { getUnsafeRootElement } from '../helpers/component-tree';
import { screen } from '../screen';
import { checkHostElement, formatElement } from './utils';

export function toBeOnTheScreen(
  this: jest.MatcherContext,
  element: ReactTestInstance
) {
  if (element !== null || !this.isNot) {
    checkHostElement(element, toBeOnTheScreen, this);
  }

  const pass =
    element === null
      ? false
      : screen.UNSAFE_root === getUnsafeRootElement(element);

  const errorFound = () => {
    return `expected element tree not to contain element, but found\n${formatElement(
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
