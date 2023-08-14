import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint, RECEIVED_COLOR } from 'jest-matcher-utils';
import { checkReactElement, printElement } from './utils';

export function toBeOnTheScreen(
  this: jest.MatcherContext,
  element: ReactTestInstance
) {
  if (element !== null) {
    checkReactElement(element, toBeOnTheScreen, this);
  }

  const pass =
    element === null ? false : getScreenRoot() === getRootElement(element);

  const errorFound = () => {
    return `expected element tree not to contain element but found:\n${printElement(
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

function getScreenRoot() {
  try {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const { screen } = require('@testing-library/react-native');
    if (!screen) {
      throw new Error('screen is undefined');
    }

    return screen.UNSAFE_root ?? screen.container;
  } catch (error) {
    throw new Error(
      'Could not import `screen` object from @testing-library/react-native.\n\n' +
        'Using toBeOnTheScreen() matcher requires @testing-library/react-native v10.1.0 or later to be added to your devDependencies.'
    );
  }
}
