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
        getBy: ['getByA11yLabel', ''],
        getAllBy: ['getAllByA11yLabel', ''],
        queryBy: ['queryByA11yLabel', ''],
        queryAllBy: ['queryAllByA11yLabel', ''],
      },
      matchStringValue
    )(instance),
    ...makeQuery(
      'accessibilityHint',
      {
        getBy: ['getByA11yHint', ''],
        getAllBy: ['getAllByA11yHint', ''],
        queryBy: ['queryByA11yHint', ''],
        queryAllBy: ['queryAllByA11yHint', ''],
      },
      matchStringValue
    )(instance),
    ...makeQuery(
      'accessibilityRole',
      {
        getBy: ['getByA11yRole', ''],
        getAllBy: ['getAllByA11yRole', ''],
        queryBy: ['queryByA11yRole', ''],
        queryAllBy: ['queryAllByA11yRole', ''],
      },
      matchStringValue
    )(instance),
    ...makeQuery(
      'accessibilityStates',
      {
        getBy: ['getByA11yStates', ''],
        getAllBy: ['getAllByA11yStates', ''],
        queryBy: ['queryByA11yStates', ''],
        queryAllBy: ['queryAllByA11yStates', ''],
      },
      matchArrayValue
    )(instance),
  }: any);

export default a11yAPI;
