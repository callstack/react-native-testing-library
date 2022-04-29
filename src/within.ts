import type { ReactTestInstance } from 'react-test-renderer';
import { getByAPI } from './queries/getByAPI';
import { queryByAPI } from './queries/queryByAPI';
import { findByAPI } from './queries/findByAPI';
import { a11yAPI } from './queries/a11yAPI';
import { bindByTextQueries } from './queries/byText';
import { bindByTestIdQueries } from './queries/byTestId';
import { bindByDisplayValueQueries } from './queries/byDisplayValue';

export function within(instance: ReactTestInstance) {
  return {
    ...getByAPI(instance),
    ...queryByAPI(instance),
    ...findByAPI(instance),
    ...a11yAPI(instance),
    ...bindByTextQueries(instance),
    ...bindByTestIdQueries(instance),
    ...bindByDisplayValueQueries(instance),
  };
}

export const getQueriesForElement = within;
