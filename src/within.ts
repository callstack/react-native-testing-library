import type { ReactTestInstance } from 'react-test-renderer';
import { getByAPI } from './queries/getByAPI';
import { queryByAPI } from './queries/queryByAPI';
import { a11yAPI } from './queries/a11yAPI';
import { bindByTextQueries } from './queries/byText';
import { bindByTestIdQueries } from './queries/byTestId';
import { bindByDisplayValueQueries } from './queries/byDisplayValue';
import { bindByPlaceholderTextQueries } from './queries/byPlaceholderText';

export function within(instance: ReactTestInstance) {
  return {
    ...getByAPI(instance),
    ...queryByAPI(instance),
    ...a11yAPI(instance),
    ...bindByTextQueries(instance),
    ...bindByTestIdQueries(instance),
    ...bindByDisplayValueQueries(instance),
    ...bindByPlaceholderTextQueries(instance),
  };
}

export const getQueriesForElement = within;
