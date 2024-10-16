import { matcherHint, RECEIVED_COLOR } from 'jest-matcher-utils';
import { HostElement } from '../renderer/host-element';
import { checkHostElement, formatElement } from './utils';

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
    matches = container.findAll((node) => node === element);
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
