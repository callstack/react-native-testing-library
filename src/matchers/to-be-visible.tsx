import { matcherHint } from 'jest-matcher-utils';
import { StyleSheet } from 'react-native';
import { HostElement } from 'universal-test-renderer';
import { isHiddenFromAccessibility } from '../helpers/accessibility';
import { isHostModal } from '../helpers/host-component-names';
import { checkHostElement, formatElement } from './utils';

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
        formatElement(element),
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

  const hostParent = element.parent;
  if (hostParent === null) {
    return true;
  }

  return isElementVisible(hostParent, cache);
}

function isHiddenForStyles(element: HostElement) {
  const flatStyle = StyleSheet.flatten(element.props.style);
  return flatStyle?.display === 'none' || flatStyle?.opacity === 0;
}
