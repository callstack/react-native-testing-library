import { matcherHint, RECEIVED_COLOR } from 'jest-matcher-utils';
import redent from 'redent';
import type { TestInstance } from 'test-renderer';

import { getContainerInstance } from '../helpers/component-tree';
import { formatElement } from '../helpers/format-element';
import { screen } from '../screen';
import { checkHostElement } from './utils';

export function toBeOnTheScreen(this: jest.MatcherContext, instance: TestInstance) {
  if (instance !== null || !this.isNot) {
    checkHostElement(instance, toBeOnTheScreen, this);
  }

  const pass = instance === null ? false : screen.container === getContainerInstance(instance);

  const errorFound = () => {
    return `expected instance tree not to contain instance, but found\n${redent(
      formatElement(instance),
      2,
    )}`;
  };

  const errorNotFound = () => {
    return `instance could not be found in the instance tree`;
  };

  return {
    pass,
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeOnTheScreen`, 'instance', ''),
        '',
        RECEIVED_COLOR(this.isNot ? errorFound() : errorNotFound()),
      ].join('\n');
    },
  };
}
