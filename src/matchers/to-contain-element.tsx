import { matcherHint, RECEIVED_COLOR } from 'jest-matcher-utils';
import { HostComponent } from 'universal-test-renderer';
import { findAll } from '../helpers/find-all';
import { checkHostElement, formatElement } from './utils';

export function toContainElement(
  this: jest.MatcherContext,
  container: HostComponent,
  element: HostComponent | null,
) {
  checkHostElement(container, toContainElement, this);

  if (element !== null) {
    checkHostElement(element, toContainElement, this);
  }

  let matches: HostComponent[] = [];
  if (element) {
    matches = findAll(container, (node) => node === element);
  }

  return {
    pass: matches.length > 0,
    message: () => {
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toContainElement`, 'container', 'element'),
        '',
        RECEIVED_COLOR(`${formatElement(container)} ${
          this.isNot ? '\n\ncontains:\n\n' : '\n\ndoes not contain:\n\n'
        } ${formatElement(element)}
        `),
      ].join('\n');
    },
  };
}
