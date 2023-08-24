import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import { StyleSheet } from 'react-native';
import { getHostParent } from '../helpers/component-tree';
import { isHostModal } from '../helpers/host-component-names';
import { checkHostElement, formatElement } from './utils';

function isVisibleForStyles(element: ReactTestInstance) {
  const style = element.props.style ?? {};
  const { display, opacity } = StyleSheet.flatten(style);
  return display !== 'none' && opacity !== 0;
}

function isVisibleForAccessibility(element: ReactTestInstance) {
  return (
    !element.props.accessibilityElementsHidden &&
    element.props.importantForAccessibility !== 'no-hide-descendants' &&
    !element.props['aria-hidden']
  );
}

function isModalVisible(element: ReactTestInstance) {
  return !isHostModal(element) || element.props.visible !== false;
}

function isElementVisible(element: ReactTestInstance): boolean {
  let current: ReactTestInstance | null = element;
  while (current) {
    if (
      !isVisibleForStyles(current) ||
      !isVisibleForAccessibility(current) ||
      !isModalVisible(current)
    ) {
      return false;
    }

    current = getHostParent(current);
  }

  return true;
}

export function toBeVisible(
  this: jest.MatcherContext,
  element: ReactTestInstance
) {
  if (element !== null || !this.isNot) {
    checkHostElement(element, toBeVisible, this);
  }

  const isVisible = isElementVisible(element);

  return {
    pass: isVisible,
    message: () => {
      const is = isVisible ? 'is' : 'is not';
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeVisible`, 'element', ''),
        '',
        `Received element ${is} visible:`,
        formatElement(element),
      ].join('\n');
    },
  };
}
