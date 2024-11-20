import { matcherHint } from 'jest-matcher-utils';
import { HostElement } from 'universal-test-renderer';
import {
  computeAriaChecked,
  getRole,
  isAccessibilityElement,
  rolesSupportingCheckedState,
} from '../helpers/accessibility';
import { ErrorWithStack } from '../helpers/errors';
import { isHostSwitch } from '../helpers/host-component-names';
import { checkHostElement, formatElement } from './utils';

export function toBeChecked(this: jest.MatcherContext, element: HostElement) {
  checkHostElement(element, toBeChecked, this);

  if (!isHostSwitch(element) && !isSupportedAccessibilityElement(element)) {
    throw new ErrorWithStack(
      `toBeChecked() works only on host "Switch" elements or accessibility elements with "checkbox", "radio" or "switch" role.`,
      toBeChecked,
    );
  }

  return {
    pass: computeAriaChecked(element) === true,
    message: () => {
      const is = this.isNot ? 'is' : 'is not';
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeChecked`, 'element', ''),
        '',
        `Received element ${is} checked:`,
        formatElement(element),
      ].join('\n');
    },
  };
}

function isSupportedAccessibilityElement(element: HostElement) {
  if (!isAccessibilityElement(element)) {
    return false;
  }

  const role = getRole(element);
  return rolesSupportingCheckedState[role];
}
