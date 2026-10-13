import type { TestInstance } from 'test-renderer';

import { isHostText } from './host-component-names';

/**
 * Whether the element is a host `Text` that React Native's `Text` disables. As in React Native,
 * `disabled={false}` wins over `aria-disabled`. The Jest preset mocks `Text`, so its host element
 * gets these props unchanged.
 */
export function isDisabledHostText(instance: TestInstance): boolean {
  if (!isHostText(instance)) {
    return false;
  }

  const { props } = instance;
  return (props.disabled ?? props['aria-disabled'] ?? props.accessibilityState?.disabled) === true;
}
