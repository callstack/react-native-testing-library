// @flow
import type { A11yRole, A11yStates, A11yState, A11yValue } from '../types.flow';
import type { WaitForOptions } from '../waitFor';
import makeA11yQuery from './makeA11yQuery';

type GetReturn = ReactTestInstance;
type GetAllReturn = Array<ReactTestInstance>;
type QueryReturn = ReactTestInstance | null;
type QueryAllReturn = Array<ReactTestInstance>;
type FindReturn = Promise<GetReturn>;
type FindAllReturn = Promise<GetAllReturn>;

export type A11yAPI = {|
  // Label
  getByA11yLabel: (string | RegExp) => GetReturn,
  getByLabelText: (string | RegExp) => GetReturn,
  getAllByA11yLabel: (string | RegExp) => GetAllReturn,
  getAllByLabelText: (string | RegExp) => GetAllReturn,
  queryByA11yLabel: (string | RegExp) => QueryReturn,
  queryByLabelText: (string | RegExp) => QueryReturn,
  queryAllByA11yLabel: (string | RegExp) => QueryAllReturn,
  queryAllByLabelText: (string | RegExp) => QueryAllReturn,
  findByA11yLabel: (string | RegExp, ?WaitForOptions) => FindReturn,
  findByLabelText: (string | RegExp, ?WaitForOptions) => FindReturn,
  findAllByA11yLabel: (string | RegExp, ?WaitForOptions) => FindAllReturn,
  findAllByLabelText: (string | RegExp, ?WaitForOptions) => FindAllReturn,

  // Hint
  getByA11yHint: (string | RegExp) => GetReturn,
  getByHintText: (string | RegExp) => GetReturn,
  getAllByA11yHint: (string | RegExp) => GetAllReturn,
  getAllByHintText: (string | RegExp) => GetAllReturn,
  queryByA11yHint: (string | RegExp) => QueryReturn,
  queryByHintText: (string | RegExp) => QueryReturn,
  queryAllByA11yHint: (string | RegExp) => QueryAllReturn,
  queryAllByHintText: (string | RegExp) => QueryAllReturn,
  findByA11yHint: (string | RegExp, ?WaitForOptions) => FindReturn,
  findByHintText: (string | RegExp, ?WaitForOptions) => FindReturn,
  findAllByA11yHint: (string | RegExp, ?WaitForOptions) => FindAllReturn,
  findAllByHintText: (string | RegExp, ?WaitForOptions) => FindAllReturn,

  // Role
  getByA11yRole: (A11yRole | RegExp) => GetReturn,
  getByRole: (A11yRole | RegExp) => GetReturn,
  getAllByA11yRole: (A11yRole | RegExp) => GetAllReturn,
  getAllByRole: (A11yRole | RegExp) => GetAllReturn,
  queryByA11yRole: (A11yRole | RegExp) => QueryReturn,
  queryByRole: (A11yRole | RegExp) => QueryReturn,
  queryAllByA11yRole: (A11yRole | RegExp) => QueryAllReturn,
  queryAllByRole: (A11yRole | RegExp) => QueryAllReturn,
  findByA11yRole: (A11yRole, ?WaitForOptions) => FindReturn,
  findByRole: (A11yRole, ?WaitForOptions) => FindReturn,
  findAllByA11yRole: (A11yRole, ?WaitForOptions) => FindAllReturn,
  findAllByRole: (A11yRole, ?WaitForOptions) => FindAllReturn,

  // States
  getByA11yStates: (A11yStates | Array<A11yStates>) => GetReturn,
  getAllByA11yStates: (A11yStates | Array<A11yStates>) => GetAllReturn,
  queryByA11yStates: (A11yStates | Array<A11yStates>) => QueryReturn,
  queryAllByA11yStates: (A11yStates | Array<A11yStates>) => QueryAllReturn,
  findByA11yStates: (A11yStates, ?WaitForOptions) => FindReturn,
  findAllByA11yStates: (A11yStates, ?WaitForOptions) => FindAllReturn,

  // State
  getByA11yState: (A11yState) => GetReturn,
  getAllByA11yState: (A11yState) => GetAllReturn,
  queryByA11yState: (A11yState) => QueryReturn,
  queryAllByA11yState: (A11yState) => QueryAllReturn,
  findByA11yState: (A11yState, ?WaitForOptions) => FindReturn,
  findAllByA11yState: (A11yState, ?WaitForOptions) => FindAllReturn,

  // Value
  getByA11yValue: (A11yValue) => GetReturn,
  getAllByA11yValue: (A11yValue) => GetAllReturn,
  queryByA11yValue: (A11yValue) => QueryReturn,
  queryAllByA11yValue: (A11yValue) => QueryAllReturn,
  findByA11yValue: (A11yValue, ?WaitForOptions) => FindReturn,
  findAllByA11yValue: (A11yValue, ?WaitForOptions) => FindAllReturn,
|};

export function matchStringValue(
  prop?: string,
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
  prop?: Array<string>,
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

export function matchObject<T: {}>(prop?: T, matcher: T): boolean {
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
  }: any);
