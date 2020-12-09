// @flow
import { getByAPI, type GetByAPI } from './helpers/getByAPI';
import { queryByAPI, type QueryByAPI } from './helpers/queryByAPI';
import { findByAPI, type FindByAPI } from './helpers/findByAPI';
import { a11yAPI, type A11yAPI } from './helpers/a11yAPI';

export function within(
  instance: ReactTestInstance
): { ...FindByAPI, ...QueryByAPI, ...GetByAPI, ...A11yAPI } {
  return {
    ...getByAPI(instance),
    ...queryByAPI(instance),
    ...findByAPI(instance),
    ...a11yAPI(instance),
  };
}

export const getQueriesForElement = within;
