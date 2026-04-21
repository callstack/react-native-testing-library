import { matcherHint, RECEIVED_COLOR } from 'jest-matcher-utils';
import redent from 'redent';
import type { TestInstance } from 'test-renderer';

import { formatElement } from '../helpers/format-element';
import { checkHostElement } from './utils';

export function toContainElement(
  this: jest.MatcherContext,
  container: TestInstance,
  instance: TestInstance | null,
) {
  checkHostElement(container, toContainElement, this);

  if (instance !== null) {
    checkHostElement(instance, toContainElement, this);
  }

  let matches: TestInstance[] = [];
  if (instance) {
    matches = container.queryAll((node) => node === instance);
  }

  return {
    pass: matches.length > 0,
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toContainElement`, 'container', 'instance'),
        '',
        RECEIVED_COLOR(`${redent(formatElement(container), 2)} ${
          this.isNot ? '\n\ncontains:\n\n' : '\n\ndoes not contain:\n\n'
        } ${redent(formatElement(instance), 2)}
        `),
      ].join('\n');
    },
  };
}
