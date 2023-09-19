import { ReactTestInstance } from 'react-test-renderer';
import {
  matcherHint,
  RECEIVED_COLOR as receivedColor,
} from 'jest-matcher-utils';
import { checkHostElement, formatElement } from './utils';

export function toContainElement(
  this: jest.MatcherContext,
  container: ReactTestInstance,
  element: ReactTestInstance | null
) {
  checkHostElement(container, toContainElement, this);

  if (element !== null) {
    checkHostElement(element, toContainElement, this);
  }

  let matches: ReactTestInstance[] = [];

  if (element) {
    matches = container.findAll((node) => node === element);
  }

  return {
    pass: Boolean(matches.length),
    message: () => {
      return [
        matcherHint(
          `${this.isNot ? '.not' : ''}.toContainElement`,
          'element',
          'element'
        ),
        '',
        receivedColor(`${formatElement(container)} ${
          this.isNot ? '\n\ncontains:\n\n' : '\n\ndoes not contain:\n\n'
        } ${formatElement(element)}
        `),
      ].join('\n');
    },
  };
}
