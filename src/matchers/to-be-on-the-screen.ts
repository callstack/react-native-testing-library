import type { HostElement } from 'universal-test-renderer';
import { matcherHint, RECEIVED_COLOR } from 'jest-matcher-utils';
import redent from 'redent';

import { getContainerElement } from '../helpers/component-tree';
import { formatElement } from '../helpers/format-element';
import { screen } from '../screen';
import { checkHostElement } from './utils';

export function toBeOnTheScreen(this: jest.MatcherContext, element: HostElement) {
  if (element !== null || !this.isNot) {
    checkHostElement(element, toBeOnTheScreen, this);
  }

  const pass = element === null ? false : screen.container === getContainerElement(element);

  const errorFound = () => {
    return `expected element tree not to contain element, but found\n${redent(
      formatElement(element),
      2,
    )}`;
  };

  const errorNotFound = () => {
    return `element could not be found in the element tree`;
  };

  return {
    pass,
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeOnTheScreen`, 'element', ''),
        '',
        RECEIVED_COLOR(this.isNot ? errorFound() : errorNotFound()),
      ].join('\n');
    },
  };
}
