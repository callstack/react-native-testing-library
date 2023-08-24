import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import { isHostTextInput } from '../helpers/host-component-names';
import { checkHostElement, formatMessage } from './utils';

function isElementDisabled(element: ReactTestInstance) {
  if (isHostTextInput(element) && element?.props?.editable === false) {
    return true;
  }

  return (
    !!element?.props?.['aria-disabled'] ||
    !!element?.props?.accessibilityState?.disabled
  );
}

function isAncestorDisabled(element: ReactTestInstance): boolean {
  const parent = element.parent;
  return (
    parent != null && (isElementDisabled(element) || isAncestorDisabled(parent))
  );
}

export function toBeDisabled(
  this: jest.MatcherContext,
  element: ReactTestInstance
) {
  checkHostElement(element, toBeDisabled, this);

  const isDisabled = isElementDisabled(element) || isAncestorDisabled(element);

  return {
    pass: isDisabled,
    message: () => {
      const is = isDisabled ? 'is' : 'is not';
      return [
        formatMessage(
          matcherHint(
            `${this.isNot ? '.not' : ''}.toBeDisabled`,
            'element',
            ''
          ),
          '',
          '',
          `Received element ${is} disabled:`,
          null
        ),
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
      const is = isEnabled ? 'is' : 'is not';
      return [
        formatMessage(
          matcherHint(`${this.isNot ? '.not' : ''}.toBeEnabled`, 'element', ''),
          '',
          '',
          `Received element ${is} enabled:`,
          null
        ),
      ].join('\n');
    },
  };
}
