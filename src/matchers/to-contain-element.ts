import { matcherHint, RECEIVED_COLOR } from 'jest-matcher-utils';
import { HostElement } from 'universal-test-renderer';
import { findAll } from '../helpers/find-all';
import { checkHostElement } from './utils';
import redent from 'redent';
import { formatElement } from '../helpers/format-element';

export function toContainElement(
  this: jest.MatcherContext,
  container: HostElement,
  element: HostElement | null,
) {
  checkHostElement(container, toContainElement, this);

  if (element !== null) {
    checkHostElement(element, toContainElement, this);
  }

  let matches: HostElement[] = [];
  if (element) {
    matches = findAll(container, (node) => node === element);
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
