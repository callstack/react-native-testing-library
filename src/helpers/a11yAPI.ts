import type { ReactTestInstance } from 'react-test-renderer';
import type { AccessibilityRole, AccessibilityState } from 'react-native';
import type { WaitForOptions } from '../waitFor';
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
  getByA11yLabel: (label: string | RegExp) => GetReturn;
  getByLabelText: (label: string | RegExp) => GetReturn;
  getAllByA11yLabel: (label: string | RegExp) => GetAllReturn;
  getAllByLabelText: (label: string | RegExp) => GetAllReturn;
  queryByA11yLabel: (label: string | RegExp) => QueryReturn;
  queryByLabelText: (label: string | RegExp) => QueryReturn;
  queryAllByA11yLabel: (label: string | RegExp) => QueryAllReturn;
  queryAllByLabelText: (label: string | RegExp) => QueryAllReturn;
  findByA11yLabel: (
    label: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findByLabelText: (
    label: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByA11yLabel: (
    label: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
  findAllByLabelText: (
    label: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;

  // Hint
  getByA11yHint: (a11yHint: string | RegExp) => GetReturn;
  getByHintText: (a11yHint: string | RegExp) => GetReturn;
  getAllByA11yHint: (a11yHint: string | RegExp) => GetAllReturn;
  getAllByHintText: (a11yHint: string | RegExp) => GetAllReturn;
  queryByA11yHint: (a11yHint: string | RegExp) => QueryReturn;
  queryByHintText: (a11yHint: string | RegExp) => QueryReturn;
  queryAllByA11yHint: (a11yHint: string | RegExp) => QueryAllReturn;
  queryAllByHintText: (a11yHint: string | RegExp) => QueryAllReturn;
  findByA11yHint: (
    a11yHint: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findByHintText: (
    a11yHint: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByA11yHint: (
    a11yHint: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
  findAllByHintText: (
    a11yHint: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;

  // Role
  getByA11yRole: (role: AccessibilityRole | RegExp) => GetReturn;
  getByRole: (role: AccessibilityRole | RegExp) => GetReturn;
  getAllByA11yRole: (role: AccessibilityRole | RegExp) => GetAllReturn;
  getAllByRole: (role: AccessibilityRole | RegExp) => GetAllReturn;
  queryByA11yRole: (role: AccessibilityRole | RegExp) => QueryReturn;
  queryByRole: (role: AccessibilityRole | RegExp) => QueryReturn;
  queryAllByA11yRole: (role: AccessibilityRole | RegExp) => QueryAllReturn;
  queryAllByRole: (role: AccessibilityRole | RegExp) => QueryAllReturn;
  findByA11yRole: (
    role: AccessibilityRole,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findByRole: (
    role: AccessibilityRole,
    waitForOptions?: WaitForOptions
  ) => FindReturn;
  findAllByA11yRole: (
    role: AccessibilityRole,
    waitForOptions?: WaitForOptions
  ) => FindAllReturn;
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
  matcher: string | RegExp
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
        getBy: ['getByA11yLabel', 'getByAccessibilityLabel', 'getByLabelText'],
        getAllBy: [
          'getAllByA11yLabel',
          'getAllByAccessibilityLabel',
          'getAllByLabelText',
        ],
        queryBy: [
          'queryByA11yLabel',
          'queryByAccessibilityLabel',
          'queryByLabelText',
        ],
        queryAllBy: [
          'queryAllByA11yLabel',
          'queryAllByAccessibilityLabel',
          'queryAllByLabelText',
        ],
        findBy: [
          'findByA11yLabel',
          'findByAccessibilityLabel',
          'findByLabelText',
        ],
        findAllBy: [
          'findAllByA11yLabel',
          'findAllByAccessibilityLabel',
          'findAllByLabelText',
        ],
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
        getBy: ['getByA11yRole', 'getByAccessibilityRole', 'getByRole'],
        getAllBy: [
          'getAllByA11yRole',
          'getAllByAccessibilityRole',
          'getAllByRole',
        ],
        queryBy: ['queryByA11yRole', 'queryByAccessibilityRole', 'queryByRole'],
        queryAllBy: [
          'queryAllByA11yRole',
          'queryAllByAccessibilityRole',
          'queryAllByRole',
        ],
        findBy: ['findByA11yRole', 'findByAccessibilityRole', 'findByRole'],
        findAllBy: [
          'findAllByA11yRole',
          'findAllByAccessibilityRole',
          'findAllByRole',
        ],
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
