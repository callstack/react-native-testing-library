import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import { StyleSheet } from 'react-native';
import { isHiddenFromAccessibility } from '../helpers/accessiblity';
import { getHostParent } from '../helpers/component-tree';
import { isHostModal } from '../helpers/host-component-names';
import { checkHostElement, formatElement } from './utils';

export function toBeVisible(this: jest.MatcherContext, element: ReactTestInstance) {
  if (element !== null || !this.isNot) {
    checkHostElement(element, toBeVisible, this);
  }

  return {
    pass: isElementVisible(element),
    message: () => {
      const is = this.isNot ? 'is' : 'is not';
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeVisible`, 'element', ''),
        '',
        `Received element ${is} visible:`,
        formatElement(element),
      ].join('\n');
    },
  };
}

function isElementVisible(
  element: ReactTestInstance,
  accessibilityCache?: WeakMap<ReactTestInstance, boolean>
): boolean {
  // Use cache to speed up repeated searches by `isHiddenFromAccessibility`.
  const cache = accessibilityCache ?? new WeakMap<ReactTestInstance, boolean>();
  if (isHiddenFromAccessibility(element, { cache })) {
    return false;
  }

  if (isHiddenForStyles(element)) {
    return false;
  }

  // Note: this seems to be a bug in React Native.
  // PR with fix: https://github.com/facebook/react-native/pull/39157
  if (isHostModal(element) && element.props.visible === false) {
    return false;
  }

  const hostParent = getHostParent(element);
  if (hostParent === null) {
    return true;
  }

  return isElementVisible(hostParent, cache);
}

function isHiddenForStyles(element: ReactTestInstance) {
  const style = element.props.style ?? {};
  const { display, opacity } = StyleSheet.flatten(style);
  return display === 'none' || opacity === 0;
}
