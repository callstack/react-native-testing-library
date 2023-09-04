import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import { isHostTextInput } from '../helpers/host-component-names';
import { isTextInputEditable } from '../helpers/text-input';
import { getHostParent } from '../helpers/component-tree';
import { checkHostElement, formatElement } from './utils';

export function toBeDisabled(
  this: jest.MatcherContext,
  element: ReactTestInstance
) {
  checkHostElement(element, toBeDisabled, this);

  const isDisabled = isElementDisabled(element) || isAncestorDisabled(element);

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

export function toBeEnabled(
  this: jest.MatcherContext,
  element: ReactTestInstance
) {
  checkHostElement(element, toBeEnabled, this);

  const isEnabled = !isElementDisabled(element) && !isAncestorDisabled(element);

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

function isElementDisabled(element: ReactTestInstance) {
  if (isHostTextInput(element) && !isTextInputEditable(element)) {
    return true;
  }

  const { accessibilityState, 'aria-disabled': ariaDisabled } = element.props;
  return ariaDisabled ?? accessibilityState?.disabled ?? false;
}

function isAncestorDisabled(element: ReactTestInstance): boolean {
  const parent = getHostParent(element);
  if (parent == null) {
    return false;
  }

  return isElementDisabled(parent) || isAncestorDisabled(parent);
}
