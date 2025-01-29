import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import redent from 'redent';

import {
  computeAriaChecked,
  getRole,
  isAccessibilityElement,
  rolesSupportingCheckedState,
} from '../helpers/accessibility';
import { ErrorWithStack } from '../helpers/errors';
import { formatElement } from '../helpers/format-element';
import { isHostSwitch } from '../helpers/host-component-names';
import { checkHostElement } from './utils';

export function toBeChecked(this: jest.MatcherContext, element: ReactTestInstance) {
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
        redent(formatElement(element), 2),
      ].join('\n');
    },
  };
}

function isSupportedAccessibilityElement(element: ReactTestInstance) {
  if (!isAccessibilityElement(element)) {
    return false;
  }

  const role = getRole(element);
  return rolesSupportingCheckedState[role];
}
