import { matcherHint } from 'jest-matcher-utils';
import { HostElement } from 'universal-test-renderer';
import { computeAriaDisabled } from '../helpers/accessibility';
import { checkHostElement } from './utils';
import redent from 'redent';
import { formatElement } from '../helpers/format-element';

export function toBeDisabled(this: jest.MatcherContext, element: HostElement) {
  checkHostElement(element, toBeDisabled, this);

  const isDisabled = computeAriaDisabled(element) || isAncestorDisabled(element);

  return {
    pass: isDisabled,
    message: () => {
      const is = this.isNot ? 'is' : 'is not';
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeDisabled`, 'element', ''),
        '',
        `Received element ${is} disabled:`,
        redent(formatElement(element), 2),
      ].join('\n');
    },
  };
}

export function toBeEnabled(this: jest.MatcherContext, element: HostElement) {
  checkHostElement(element, toBeEnabled, this);

  const isEnabled = !computeAriaDisabled(element) && !isAncestorDisabled(element);

  return {
    pass: isEnabled,
    message: () => {
      const is = this.isNot ? 'is' : 'is not';
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeEnabled`, 'element', ''),
        '',
        `Received element ${is} enabled:`,
        redent(formatElement(element), 2),
      ].join('\n');
    },
  };
}

function isAncestorDisabled(element: HostElement): boolean {
  const parent = element.parent;
  if (parent == null) {
    return false;
  }

  return computeAriaDisabled(parent) || isAncestorDisabled(parent);
}
