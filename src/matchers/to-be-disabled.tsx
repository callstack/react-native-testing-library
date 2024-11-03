import { matcherHint } from 'jest-matcher-utils';
import { HostComponent } from 'universal-test-renderer';
import { computeAriaDisabled } from '../helpers/accessibility';
import { checkHostElement, formatElement } from './utils';

export function toBeDisabled(this: jest.MatcherContext, element: HostComponent) {
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
        formatElement(element),
      ].join('\n');
    },
  };
}

export function toBeEnabled(this: jest.MatcherContext, element: HostComponent) {
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
        formatElement(element),
      ].join('\n');
    },
  };
}

function isAncestorDisabled(element: HostComponent): boolean {
  const parent = element.parent;
  if (parent == null) {
    return false;
  }

  return computeAriaDisabled(parent) || isAncestorDisabled(parent);
}
