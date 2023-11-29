import type { StyleProp } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { AccessibilityValueMatcher } from '../helpers/matchers/match-accessibility-value';
import { TextMatch, TextMatchOptions } from '../matches';
import { Style } from './to-have-style';

export interface JestNativeMatchers<R> {
  /**
   * Assert whether an element is present in the element tree or not.
   */
  toBeOnTheScreen(): R;

  toBeChecked(): R;
  toBeCollapsed(): R;
  toBeDisabled(): R;
  toBeBusy(): R;
  toBeEmptyElement(): R;
  toBeEnabled(): R;
  toBeExpanded(): R;
  toBePartiallyChecked(): R;
  toBeSelected(): R;
  toBeVisible(): R;
  toContainElement(element: ReactTestInstance | null): R;
  toHaveAccessibilityValue(expectedValue: AccessibilityValueMatcher): R;
  toHaveAccessibleName(expectedName?: TextMatch, options?: TextMatchOptions): R;
  toHaveDisplayValue(expectedValue: TextMatch, options?: TextMatchOptions): R;
  toHaveProp(name: string, expectedValue?: unknown): R;
  toHaveStyle(style: StyleProp<Style>): R;
  toHaveTextContent(expectedText: TextMatch, options?: TextMatchOptions): R;
}

// Implicit Jest global `expect`.
declare global {
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R, T = {}> extends JestNativeMatchers<R> {}
  }
}

// Explicit `@jest/globals` `expect` matchers.
// @ts-ignore
declare module '@jest/expect' {
  interface Matchers<R extends void | Promise<void>>
    extends JestNativeMatchers<R> {}
}
