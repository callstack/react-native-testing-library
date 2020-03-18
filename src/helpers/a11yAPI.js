// @flow
import makeQuery from './makeQuery';
import type { A11yRole, A11yStates, A11yState, A11yValue } from '../types.flow';

type GetReturn = ReactTestInstance;
type GetAllReturn = Array<ReactTestInstance>;
type QueryReturn = ReactTestInstance | null;
type QueryAllReturn = Array<ReactTestInstance> | [];

type A11yAPI = {|
  // Label
  getByA11yLabel: (string | RegExp) => GetReturn,
  getAllByA11yLabel: (string | RegExp) => GetAllReturn,
  queryByA11yLabel: (string | RegExp) => QueryReturn,
  queryAllByA11yLabel: (string | RegExp) => QueryAllReturn,

  // Hint
  getByA11yHint: (string | RegExp) => GetReturn,
  getAllByA11yHint: (string | RegExp) => GetAllReturn,
  queryByA11yHint: (string | RegExp) => QueryReturn,
  queryAllByA11yHint: (string | RegExp) => QueryAllReturn,

  // Role
  getByA11yRole: (A11yRole | RegExp) => GetReturn,
  getAllByA11yRole: (A11yRole | RegExp) => GetAllReturn,
  queryByA11yRole: (A11yRole | RegExp) => QueryReturn,
  queryAllByA11yRole: (A11yRole | RegExp) => QueryAllReturn,

  // States
  getByA11yStates: (A11yStates | Array<A11yStates>) => GetReturn,
  getAllByA11yStates: (A11yStates | Array<A11yStates>) => GetAllReturn,
  queryByA11yStates: (A11yStates | Array<A11yStates>) => QueryReturn,
  queryAllByA11yStates: (A11yStates | Array<A11yStates>) => QueryAllReturn,

  // State
  getByA11yState: A11yState => GetReturn,
  getAllByA11yState: A11yState => GetAllReturn,
  queryByA11yState: A11yState => QueryReturn,
  queryAllByA11yState: A11yState => QueryAllReturn,

  // Value
  getByA11yValue: A11yValue => GetReturn,
  getAllByA11yValue: A11yValue => GetAllReturn,
  queryByA11yValue: A11yValue => QueryReturn,
  queryAllByA11yValue: A11yValue => QueryAllReturn,
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

  return !matcher.some(e => !prop.includes(e));
}

export function matchObject<T: {}>(prop?: T, matcher: T): boolean {
  return prop
    ? Object.keys(matcher).length !== 0 &&
        Object.keys(prop).length !== 0 &&
        !Object.keys(matcher).some(key => prop[key] !== matcher[key])
    : false;
}

const a11yAPI = (instance: ReactTestInstance): A11yAPI =>
  ({
    ...makeQuery(
      'accessibilityLabel',
      {
        getBy: ['getByA11yLabel', 'getByAccessibilityLabel'],
        getAllBy: ['getAllByA11yLabel', 'getAllByAccessibilityLabel'],
        queryBy: ['queryByA11yLabel', 'queryByAccessibilityLabel'],
        queryAllBy: ['queryAllByA11yLabel', 'queryAllByAccessibilityLabel'],
      },
      matchStringValue
    )(instance),
    ...makeQuery(
      'accessibilityHint',
      {
        getBy: ['getByA11yHint', 'getByAccessibilityHint'],
        getAllBy: ['getAllByA11yHint', 'getAllByAccessibilityHint'],
        queryBy: ['queryByA11yHint', 'queryByAccessibilityHint'],
        queryAllBy: ['queryAllByA11yHint', 'queryAllByAccessibilityHint'],
      },
      matchStringValue
    )(instance),
    ...makeQuery(
      'accessibilityRole',
      {
        getBy: ['getByA11yRole', 'getByAccessibilityRole'],
        getAllBy: ['getAllByA11yRole', 'getAllByAccessibilityRole'],
        queryBy: ['queryByA11yRole', 'queryByAccessibilityRole'],
        queryAllBy: ['queryAllByA11yRole', 'queryAllByAccessibilityRole'],
      },
      matchStringValue
    )(instance),
    ...makeQuery(
      'accessibilityStates',
      {
        getBy: ['getByA11yStates', 'getByAccessibilityStates'],
        getAllBy: ['getAllByA11yStates', 'getAllByAccessibilityStates'],
        queryBy: ['queryByA11yStates', 'queryByAccessibilityStates'],
        queryAllBy: ['queryAllByA11yStates', 'queryAllByAccessibilityStates'],
      },
      matchArrayValue
    )(instance),
    ...makeQuery(
      'accessibilityState',
      {
        getBy: ['getByA11yState', 'getByAccessibilityState'],
        getAllBy: ['getAllByA11yState', 'getAllByAccessibilityState'],
        queryBy: ['queryByA11yState', 'queryByAccessibilityState'],
        queryAllBy: ['queryAllByA11yState', 'queryAllByAccessibilityState'],
      },
      matchObject
    )(instance),
    ...makeQuery(
      'accessibilityValue',
      {
        getBy: ['getByA11yValue', 'getByAccessibilityValue'],
        getAllBy: ['getAllByA11yValue', 'getAllByAccessibilityValue'],
        queryBy: ['queryByA11yValue', 'queryByAccessibilityValue'],
        queryAllBy: ['queryAllByA11yValue', 'queryAllByAccessibilityValue'],
      },
      matchObject
    )(instance),
  }: any);

export default a11yAPI;
