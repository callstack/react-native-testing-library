// @flow
import makeQuery from './makeQuery';

type TextQueryFn = (string | RegExp) => ReactTestInstance;
type ArrayQueryFn = (string | Array<string>) => ReactTestInstance;

type A11yAPI = {
  getByA11yLabel: TextQueryFn,
  getAllByA11yLabel: TextQueryFn,
  queryByA11yLabel: TextQueryFn,
  queryAllByA11yLabel: TextQueryFn,
  getByA11yHint: TextQueryFn,
  getAllByA11yHint: TextQueryFn,
  queryByA11yHint: TextQueryFn,
  queryAllByA11yHint: TextQueryFn,
  getByA11yRole: TextQueryFn,
  getAllByA11yRole: TextQueryFn,
  queryByA11yRole: TextQueryFn,
  queryAllByA11yRole: TextQueryFn,
  getByA11yStates: ArrayQueryFn,
  getAllByA11yStates: ArrayQueryFn,
  queryByA11yStates: ArrayQueryFn,
  queryAllByA11yStates: ArrayQueryFn,
};

export function matchStringValue(prop?: string, matcher: string | RegExp) {
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
) {
  if (!prop || matcher.length === 0) {
    return false;
  }

  if (typeof matcher === 'string') {
    return prop.includes(matcher);
  }

  // $FlowFixMe
  return !matcher.some(e => !prop.includes(e));
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
  }: any);

export default a11yAPI;
