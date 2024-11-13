import type { StyleProp } from 'react-native';
import { HostElement } from 'universal-test-renderer';
import { AccessibilityValueMatcher } from '../helpers/matchers/match-accessibility-value';
import { TextMatch, TextMatchOptions } from '../matches';
import { Style } from './to-have-style';

export interface JestNativeMatchers<R> {
  /**
   * Assert whether a host element is present in the element tree (screen) or not.
   *
   * @see
   * [Jest Matchers docs](https://callstack.github.io/react-native-testing-library/docs/jest-matchers#tobeonthescreen)
   *
   * @example
   * <Text>Hello</Text>
   *
   * expect(getByText('Hello')).toBeOnTheScreen()
   * expect(queryByText('Other')).not.toBeOnTheScreen()
   */
  toBeOnTheScreen(): R;

  /**
   * Assert whether a host element is checked based on accessibility props.
   *
   * @see
   * [Jest Matchers docs](https://callstack.github.io/react-native-testing-library/docs/jest-matchers#tobechecked)
   *
   * @see {@link toBePartiallyChecked} for a related matcher.
   *
   * @example
   * <View accessible role="checkbox" aria-checked aria-label="Enable" />
   *
   * expect(getByRole('checkbox', { name: "Enable" })).toBeChecked()
   */
  toBeChecked(): R;

  /**
   * Assert whether a host element is collapsed based on accessibility props.
   *
   * @see
   * [Jest Matchers docs](https://callstack.github.io/react-native-testing-library/docs/jest-matchers#tobeexpanded)
   *
   * @see {@link toBeExpanded} for an inverse matcher.
   *
   * @example
   * <View testID="details" aria-expanded={false} />
   *
   * expect(getByTestId('details').toBeCollapsed()
   */
  toBeCollapsed(): R;

  /**
   * Assert whether a host element is disabled based on accessibility props.
   *
   * This matcher will check ancestor elements for their disabled state as well.
   *
   * @see
   * [Jest Matchers docs](https://callstack.github.io/react-native-testing-library/docs/jest-matchers#tobeenabled)
   *
   * @see {@link toBeEnabled} for an inverse matcher.
   *
   * @example
   * <View role="button" aria-disabled />
   *
   * expect(getByRole('button').toBeDisabled()
   *
   */
  toBeDisabled(): R;

  /**
   * Assert whether a host element is busy based on accessibility props.
   *
   * This matcher will check ancestor elements for their disabled state as well.
   *
   * @see
   * [Jest Matchers docs](https://callstack.github.io/react-native-testing-library/docs/jest-matchers#tobebusy)
   *
   * @example
   * <View testID="loader" aria-busy />
   *
   * expect(getByTestId('loader')).toBeBusy()
   */
  toBeBusy(): R;

  /**
   * Assert whether a host element has no host children or text content.
   *
   * @see
   * [Jest Matchers docs](https://callstack.github.io/react-native-testing-library/docs/jest-matchers#tobeemptyelement)
   *
   * @example
   * <View testID="not-empty">
   *   <View testID="empty" />
   * </View>
   *
   * expect(getByTestId('empty')).toBeEmptyElement()
   * expect(getByTestId('not-mepty')).not.toBeEmptyElement()
   */
  toBeEmptyElement(): R;

  /**
   * Assert whether a host element is enabled based on accessibility props.
   *
   * This matcher will check ancestor elements for their disabled state as well.
   *
   * @see
   * [Jest Matchers docs](https://callstack.github.io/react-native-testing-library/docs/jest-matchers#tobeenabled)
   *
   * @see {@link toBeDisabled} for inverse matcher.
   *
   * @example
   * <View role="button" aria-disabled={false} />
   *
   * expect(getByRole('button').toBeEnabled()
   */
  toBeEnabled(): R;

  /**
   * Assert whether a host element is expanded based on accessibility props.
   *
   * @see
   * [Jest Matchers docs](https://callstack.github.io/react-native-testing-library/docs/jest-matchers#tobeexpanded)
   *
   * @see {@link toBeCollapsed} for inverse matcher.
   *
   * @example
   * <View testID="details" aria-expanded />
   *
   * expect(getByTestId('details').toBeExpanded()
   */
  toBeExpanded(): R;

  /**
   * Assert whether a host element is partially checked based on accessibility props.
   *
   * @see
   * [Jest Matchers docs](https://callstack.github.io/react-native-testing-library/docs/jest-matchers#tobechecked)
   *
   * @see {@link toBeChecked} for related matcher.
   *
   * @example
   * <View accessible role="checkbox" aria-checked="mixed" aria-label="Enable" />
   *
   * expect(getByRole('checkbox', { name: "Enable" })).toBePartiallyChecked()
   */
  toBePartiallyChecked(): R;

  /**
   * Assert whether a host element is selected based on accessibility props.
   *
   * @see
   * [Jest Matchers docs](https://callstack.github.io/react-native-testing-library/docs/jest-matchers#tobeselected)
   *
   * @example
   * <View testID="view" aria-selected />
   *
   * expect(getByTestId('view')).toBeSelected()
   */
  toBeSelected(): R;

  /**
   * Assert whether a host element is visible based on style and accessibility props.
   *
   * This matcher will check ancestor elements for their visibility as well.
   *
   * @see
   * [Jest Matchers docs](https://callstack.github.io/react-native-testing-library/docs/jest-matchers#tobevisible)
   *
   * @example
   * <View testID="visible" />
   * <View testID="not-visible" style={{ display: 'none' }} />
   *
   * expect(getByTestId('visible')).toBeVisible()
   * expect(getByTestId('not-visible')).not.toBeVisible()
   */
  toBeVisible(): R;

  /**
   * Assert whether a host element contains another host element.
   *
   * @see
   * [Jest Matchers docs](https://callstack.github.io/react-native-testing-library/docs/jest-matchers#tocontainelement)
   *
   * @example
   * <View testID="outer">
   *   <View testID="inner" />
   * </View>
   *
   * expect(getByTestId('outer')).toContainElement(getByTestId('inner'));
   */
  toContainElement(element: HostElement | null): R;

  /**
   * Assert whether a host element has a given accessbility value.
   *
   * @see
   * [Jest Matchers docs](https://callstack.github.io/react-native-testing-library/docs/jest-matchers#tohaveaccessibilityvalue)
   *
   *
   * @example
   * <View testID="view" aria-valuetext="33%" />
   *
   * expect(getByTestId('view')).toHaveAccessibilityValue({ text: '33%' });
   */
  toHaveAccessibilityValue(expectedValue: AccessibilityValueMatcher): R;

  /**
   * Assert whether a host element has a given accessibile name based on the accessibility label or text content.
   *
   * @see
   * [Jest Matchers docs](https://callstack.github.io/react-native-testing-library/docs/jest-matchers#tohaveaccessiblename)
   *
   * @example
   * <View testID="view" aria-label="Hello" />
   *
   * expect(getByTestId('view')).toHaveAccessibleName('Hello');
   */
  toHaveAccessibleName(expectedName?: TextMatch, options?: TextMatchOptions): R;

  /**
   * Assert whether a host `TextInput` element has a given display value based on `value` prop, unmanaged native state, and `defaultValue` prop.
   *
   * @see
   * [Jest Matchers docs](https://callstack.github.io/react-native-testing-library/docs/jest-matchers#tohavedisplayvalue)
   *
   * @example
   * <TextInput testID="input" value="Hello" />
   *
   * expect(getByTestId('input')).toHaveDisplayValue('Hello');
   */
  toHaveDisplayValue(expectedValue: TextMatch, options?: TextMatchOptions): R;

  /**
   * Assert whether a host element has a given prop.
   *
   * @see
   * [Jest Matchers docs](https://callstack.github.io/react-native-testing-library/docs/jest-matchers#tohaveprop)
   *
   * @example
   * <Text testID="text" numberOfLines={1]} />
   *
   * expect(getByTestId('text')).toHaveProp('numberOfLines');
   * expect(getByTestId('text')).toHaveProp('numberOfLines', 1);
   */
  toHaveProp(name: string, expectedValue?: unknown): R;

  /**
   * Assert whether a host element has a given style.
   *
   * @see
   * [Jest Matchers docs](https://callstack.github.io/react-native-testing-library/docs/jest-matchers#tohavestyle)
   *
   * @example
   * <View testID="view" style={{ width: '100%' }} />
   *
   * expect(getByTestId('view')).toHaveStyle({ width: '100%' });
   * expect(getByTestId('view')).not.toHaveStyle({ width: '50%' });
   */
  toHaveStyle(style: StyleProp<Style>): R;

  /**
   * Assert whether a host element has a given text content.
   *
   * @see
   * [Jest Matchers docs](https://callstack.github.io/react-native-testing-library/docs/jest-matchers#tohavetextcontent)
   *
   * @example
   * <View testID="view">
   *   <Text>Hello World</Text>
   * </View>
   *
   * expect(getByTestId('view')).toHaveTextContent('Hello World');
   * expect(getByTestId('view')).toHaveTextContent('Hello', { exact: false }});
   * expect(getByTestId('view')).toHaveTextContent(/hello/i);
   * expect(getByTestId('view')).not.toHaveTextContent('Hello');
   */
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
  interface Matchers<R extends void | Promise<void>> extends JestNativeMatchers<R> {}
}
