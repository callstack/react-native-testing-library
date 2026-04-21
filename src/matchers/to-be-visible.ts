import { StyleSheet } from 'react-native';
import { matcherHint } from 'jest-matcher-utils';
import redent from 'redent';
import type { TestInstance } from 'test-renderer';

import { isHiddenFromAccessibility } from '../helpers/accessibility';
import { formatElement } from '../helpers/format-element';
import { isHostModal } from '../helpers/host-component-names';
import { checkHostElement } from './utils';

export function toBeVisible(this: jest.MatcherContext, instance: TestInstance) {
  if (instance !== null || !this.isNot) {
    checkHostElement(instance, toBeVisible, this);
  }

  return {
    pass: isElementVisible(instance),
    message: () => {
      const is = this.isNot ? 'is' : 'is not';
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeVisible`, 'instance', ''),
        '',
        `Received instance ${is} visible:`,
        redent(formatElement(instance), 2),
      ].join('\n');
    },
  };
}

function isElementVisible(
  instance: TestInstance,
  accessibilityCache?: WeakMap<TestInstance, boolean>,
): boolean {
  // Use cache to speed up repeated searches by `isHiddenFromAccessibility`.
  const cache = accessibilityCache ?? new WeakMap<TestInstance, boolean>();
  if (isHiddenFromAccessibility(instance, { cache })) {
    return false;
  }

  if (isHiddenForStyles(instance)) {
    return false;
  }

  // Note: this seems to be a bug in React Native.
  // PR with fix: https://github.com/facebook/react-native/pull/39157
  if (isHostModal(instance) && instance.props.visible === false) {
    return false;
  }

  const parent = instance.parent;
  if (parent === null) {
    return true;
  }

  return isElementVisible(parent, cache);
}

function isHiddenForStyles(instance: TestInstance) {
  const flatStyle = StyleSheet.flatten(instance.props.style);
  return flatStyle?.display === 'none' || flatStyle?.opacity === 0;
}
