import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint, RECEIVED_COLOR } from 'jest-matcher-utils';
import redent from 'redent';
import { formatElement } from '../helpers/format-element';
import { checkHostElement } from './utils';

export function toContainElement(
  this: jest.MatcherContext,
  container: ReactTestInstance,
  element: ReactTestInstance | null,
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
    pass: matches.length > 0,
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toContainElement`, 'container', 'element'),
        '',
        RECEIVED_COLOR(`${redent(formatElement(container), 2)} ${
          this.isNot ? '\n\ncontains:\n\n' : '\n\ndoes not contain:\n\n'
        } ${redent(formatElement(element), 2)}
        `),
      ].join('\n');
    },
  };
}
