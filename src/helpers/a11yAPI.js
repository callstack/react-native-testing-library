// @flow
import makeQuery from './makeQuery';

type QueryFn = (string | RegExp) => ReactTestInstance | null;
type QueryAllFn = (string | RegExp) => Array<ReactTestInstance> | [];
type GetFn = (string | RegExp) => ReactTestInstance;
type GetAllFn = (string | RegExp) => Array<ReactTestInstance>;
type ArrayQueryFn = (string | Array<string>) => ReactTestInstance | null;
type ArrayQueryAllFn = (
  string | Array<string>
) => Array<ReactTestInstance> | [];
type ArrayGetFn = (string | Array<string>) => ReactTestInstance;
type ArrayGetAllFn = (string | Array<string>) => Array<ReactTestInstance>;

type A11yAPI = {
  getByA11yLabel: GetFn,
  getAllByA11yLabel: GetAllFn,
  queryByA11yLabel: QueryFn,
  queryAllByA11yLabel: QueryAllFn,
  getByA11yHint: GetFn,
  getAllByA11yHint: GetAllFn,
  queryByA11yHint: QueryFn,
  queryAllByA11yHint: QueryAllFn,
  getByA11yRole: GetFn,
  getAllByA11yRole: GetAllFn,
  queryByA11yRole: QueryFn,
  queryAllByA11yRole: QueryAllFn,
  getByA11yStates: ArrayGetFn,
  getAllByA11yStates: ArrayGetAllFn,
  queryByA11yStates: ArrayQueryFn,
  queryAllByA11yStates: ArrayQueryAllFn,
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

  // $FlowFixMe - callback is sync hence prop exists
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
