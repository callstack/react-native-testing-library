import { matcherHint } from 'jest-matcher-utils';
import redent from 'redent';
import type { TestInstance } from 'test-renderer';

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

export function toBeChecked(this: jest.MatcherContext, instance: TestInstance) {
  checkHostElement(instance, toBeChecked, this);

  if (!isHostSwitch(instance) && !isSupportedAccessibilityElement(instance)) {
    throw new ErrorWithStack(
      `toBeChecked() works only on host "Switch" instances or accessible instance with "checkbox", "radio" or "switch" role.`,
      toBeChecked,
    );
  }

  return {
    pass: computeAriaChecked(instance) === true,
    message: () => {
      const is = this.isNot ? 'is' : 'is not';
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeChecked`, 'instance', ''),
        '',
        `Received instance ${is} checked:`,
        redent(formatElement(instance), 2),
      ].join('\n');
    },
  };
}

function isSupportedAccessibilityElement(instance: TestInstance) {
  if (!isAccessibilityElement(instance)) {
    return false;
  }

  const role = getRole(instance);
  return rolesSupportingCheckedState[role];
}
