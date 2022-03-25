import type { ReactTestInstance } from 'react-test-renderer';
import type { AccessibilityRole, AccessibilityState } from 'react-native';
import type { WaitForOptions } from '../waitFor';
import type { TextMatch } from '../matches';
import makeA11yQuery from './makeA11yQuery';

type AccessibilityStateKey = keyof AccessibilityState;
type A11yValue = {
  min?: number;
  max?: number;
  now?: number;
  text?: string;
};

type GetReturn = ReactTestInstance;
type GetAllReturn = Array<ReactTestInstance>;
type QueryReturn = ReactTestInstance | null;
type QueryAllReturn = Array<ReactTestInstance>;
type FindReturn = Promise<GetReturn>;
type FindAllReturn = Promise<GetAllReturn>;

export type A11yAPI = {
  // Label
  getByLabelText: (label: TextMatch) => GetReturn;
  getAllByLabelText: (label: TextMatch) => GetAllReturn;
  queryByLabelText: (label: TextMatch) => QueryReturn;
  queryAllByLabelText: (label: TextMatch) => QueryAllReturn;
  findByLabelText: (
    label: TextMatch,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByLabelText: (
    label: TextMatch,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;

  // Hint
  getByA11yHint: (a11yHint: TextMatch) => GetReturn;
  getByHintText: (a11yHint: TextMatch) => GetReturn;
  getAllByA11yHint: (a11yHint: TextMatch) => GetAllReturn;
  getAllByHintText: (a11yHint: TextMatch) => GetAllReturn;
  queryByA11yHint: (a11yHint: TextMatch) => QueryReturn;
  queryByHintText: (a11yHint: TextMatch) => QueryReturn;
  queryAllByA11yHint: (a11yHint: TextMatch) => QueryAllReturn;
  queryAllByHintText: (a11yHint: TextMatch) => QueryAllReturn;
  findByA11yHint: (
    a11yHint: TextMatch,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findByHintText: (
    a11yHint: TextMatch,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByA11yHint: (
    a11yHint: TextMatch,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
  findAllByHintText: (
    a11yHint: TextMatch,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;

  // Role
  getByRole: (role: AccessibilityRole | RegExp) => GetReturn;
  getAllByRole: (role: AccessibilityRole | RegExp) => GetAllReturn;
  queryByRole: (role: AccessibilityRole | RegExp) => QueryReturn;
  queryAllByRole: (role: AccessibilityRole | RegExp) => QueryAllReturn;
  findByRole: (
    role: AccessibilityRole,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByRole: (
    role: AccessibilityRole,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;

  // States
  getByA11yStates: (
    accessibilityStateKey: AccessibilityStateKey | Array<AccessibilityStateKey>
  ) => GetReturn;
  getAllByA11yStates: (
    accessibilityStateKey: AccessibilityStateKey | Array<AccessibilityStateKey>
  ) => GetAllReturn;
  queryByA11yStates: (
    accessibilityStateKey: AccessibilityStateKey | Array<AccessibilityStateKey>
  ) => QueryReturn;
  queryAllByA11yStates: (
    accessibilityStateKey: AccessibilityStateKey | Array<AccessibilityStateKey>
  ) => QueryAllReturn;
  findByA11yStates: (
    accessibilityStateKey: AccessibilityStateKey,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByA11yStates: (
    accessibilityStateKey: AccessibilityStateKey,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;

  // State
  getByA11yState: (accessibilityState: AccessibilityState) => GetReturn;
  getAllByA11yState: (accessibilityState: AccessibilityState) => GetAllReturn;
  queryByA11yState: (accessibilityState: AccessibilityState) => QueryReturn;
  queryAllByA11yState: (
    accessibilityState: AccessibilityState
  ) => QueryAllReturn;
  findByA11yState: (
    accessibilityState: AccessibilityState,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByA11yState: (
    accessibilityState: AccessibilityState,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;

  // Value
  getByA11yValue: (a11yValue: A11yValue) => GetReturn;
  getAllByA11yValue: (a11yValue: A11yValue) => GetAllReturn;
  queryByA11yValue: (a11yValue: A11yValue) => QueryReturn;
  queryAllByA11yValue: (a11yValue: A11yValue) => QueryAllReturn;
  findByA11yValue: (
    a11yValue: A11yValue,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByA11yValue: (
    a11yValue: A11yValue,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
};

export function matchStringValue(
  prop: string | undefined,
  matcher: TextMatch
): boolean {
  if (!prop) {
    return false;
  }

  if (typeof matcher === 'string') {
    return prop === matcher;
  }

  return Boolean(prop.match(matcher));
}

export function matchArrayValue(
  prop: Array<string> | undefined,
  matcher: string | Array<string>
): boolean {
  if (!prop || matcher.length === 0) {
    return false;
  }

  if (typeof matcher === 'string') {
    return prop.includes(matcher);
  }

  return !matcher.some((e) => !prop.includes(e));
}

export function matchObject<T extends Record<string, unknown>>(
  prop: T | undefined,
  matcher: T
): boolean {
  return prop
    ? Object.keys(matcher).length !== 0 &&
        Object.keys(prop).length !== 0 &&
        !Object.keys(matcher).some((key) => prop[key] !== matcher[key])
    : false;
}

export const a11yAPI = (instance: ReactTestInstance): A11yAPI =>
  ({
    ...makeA11yQuery(
      'accessibilityLabel',
      {
        getBy: ['getByLabelText'],
        getAllBy: ['getAllByLabelText'],
        queryBy: ['queryByLabelText'],
        queryAllBy: ['queryAllByLabelText'],
        findBy: ['findByLabelText'],
        findAllBy: ['findAllByLabelText'],
      },
      matchStringValue
    )(instance),
    ...makeA11yQuery(
      'accessibilityHint',
      {
        getBy: ['getByA11yHint', 'getByAccessibilityHint', 'getByHintText'],
        getAllBy: [
          'getAllByA11yHint',
          'getAllByAccessibilityHint',
          'getAllByHintText',
        ],
        queryBy: [
          'queryByA11yHint',
          'queryByAccessibilityHint',
          'queryByHintText',
        ],
        queryAllBy: [
          'queryAllByA11yHint',
          'queryAllByAccessibilityHint',
          'queryAllByHintText',
        ],
        findBy: ['findByA11yHint', 'findByAccessibilityHint', 'findByHintText'],
        findAllBy: [
          'findAllByA11yHint',
          'findAllByAccessibilityHint',
          'findAllByHintText',
        ],
      },
      matchStringValue
    )(instance),
    ...makeA11yQuery(
      'accessibilityRole',
      {
        getBy: ['getByRole'],
        getAllBy: ['getAllByRole'],
        queryBy: ['queryByRole'],
        queryAllBy: ['queryAllByRole'],
        findBy: ['findByRole'],
        findAllBy: ['findAllByRole'],
      },
      matchStringValue
    )(instance),
    ...makeA11yQuery(
      'accessibilityStates',
      {
        getBy: ['getByA11yStates', 'getByAccessibilityStates'],
        getAllBy: ['getAllByA11yStates', 'getAllByAccessibilityStates'],
        queryBy: ['queryByA11yStates', 'queryByAccessibilityStates'],
        queryAllBy: ['queryAllByA11yStates', 'queryAllByAccessibilityStates'],
        findBy: ['findByA11yStates', 'findByAccessibilityStates'],
        findAllBy: ['findAllByA11yStates', 'findAllByAccessibilityStates'],
      },
      matchArrayValue
    )(instance),
    ...makeA11yQuery(
      'accessibilityState',
      {
        getBy: ['getByA11yState', 'getByAccessibilityState'],
        getAllBy: ['getAllByA11yState', 'getAllByAccessibilityState'],
        queryBy: ['queryByA11yState', 'queryByAccessibilityState'],
        queryAllBy: ['queryAllByA11yState', 'queryAllByAccessibilityState'],
        findBy: ['findByA11yState', 'findByAccessibilityState'],
        findAllBy: ['findAllByA11yState', 'findAllByAccessibilityState'],
      },
      matchObject
    )(instance),
    ...makeA11yQuery(
      'accessibilityValue',
      {
        getBy: ['getByA11yValue', 'getByAccessibilityValue'],
        getAllBy: ['getAllByA11yValue', 'getAllByAccessibilityValue'],
        queryBy: ['queryByA11yValue', 'queryByAccessibilityValue'],
        queryAllBy: ['queryAllByA11yValue', 'queryAllByAccessibilityValue'],
        findBy: ['findByA11yValue', 'findByAccessibilityValue'],
        findAllBy: ['findAllByA11yValue', 'findAllByAccessibilityValue'],
      },
      matchObject
    )(instance),
  } as any);
