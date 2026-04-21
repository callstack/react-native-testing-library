import { matcherHint, RECEIVED_COLOR } from 'jest-matcher-utils';
import redent from 'redent';
import type { TestInstance } from 'test-renderer';

import { formatElement } from '../helpers/format-element';
import { checkHostElement } from './utils';

export function toContainElement(
  this: jest.MatcherContext,
  container: TestInstance,
  element: TestInstance | null,
) {
  checkHostElement(container, toContainElement, this);

  if (element !== null) {
    checkHostElement(element, toContainElement, this);
  }

  let matches: TestInstance[] = [];
  if (element) {
    matches = container.queryAll((node) => node === element);
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
