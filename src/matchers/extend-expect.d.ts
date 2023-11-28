import type { StyleProp } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';

export interface JestNativeMatchers<R> {
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
declare module '@jest/expect' {
  interface Matchers<R extends void | Promise<void>>
    extends JestNativeMatchers<R> {}
}

// Used types

export type Style = ViewStyle | TextStyle | ImageStyle;

export interface AccessibilityValueMatcher {
  min?: number;
  max?: number;
  now?: number;
  text?: TextMatch;
}

export type TextMatch = string | RegExp;
export type TextMatchOptions = {
  exact?: boolean;
  normalizer?: NormalizerFn;
};

export type NormalizerFn = (textToNormalize: string) => string;
