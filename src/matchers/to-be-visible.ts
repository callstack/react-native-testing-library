import { StyleSheet } from 'react-native';
import type { HostElement } from 'universal-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import redent from 'redent';

import { isHiddenFromAccessibility } from '../helpers/accessibility';
import { getHostParent } from '../helpers/component-tree';
import { formatElement } from '../helpers/format-element';
import { isHostModal } from '../helpers/host-component-names';
import { checkHostElement } from './utils';

export function toBeVisible(this: jest.MatcherContext, element: HostElement) {
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
        redent(formatElement(element), 2),
      ].join('\n');
    },
  };
}

function isElementVisible(
  element: HostElement,
  accessibilityCache?: WeakMap<HostElement, boolean>,
): boolean {
  // Use cache to speed up repeated searches by `isHiddenFromAccessibility`.
  const cache = accessibilityCache ?? new WeakMap<HostElement, boolean>();
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

function isHiddenForStyles(element: HostElement) {
  const flatStyle = StyleSheet.flatten(element.props.style);
  return flatStyle?.display === 'none' || flatStyle?.opacity === 0;
}
