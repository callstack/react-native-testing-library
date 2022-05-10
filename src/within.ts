import type { ReactTestInstance } from 'react-test-renderer';
import { a11yAPI } from './queries/a11yAPI';
import { bindByTextQueries } from './queries/text';
import { bindByTestIdQueries } from './queries/testId';
import { bindByDisplayValueQueries } from './queries/displayValue';
import { bindByPlaceholderTextQueries } from './queries/placeholderText';
import { bindUnsafeByTypeQueries } from './queries/unsafeType';
import { bindUnsafeByPropsQueries } from './queries/unsafeProps';
import { bindByLabelTextQueries } from './queries/labelText';

export function within(instance: ReactTestInstance) {
  return {
    ...bindByTextQueries(instance),
    ...bindByTestIdQueries(instance),
    ...bindByDisplayValueQueries(instance),
    ...bindByPlaceholderTextQueries(instance),
    ...bindUnsafeByTypeQueries(instance),
    ...bindUnsafeByPropsQueries(instance),
    ...bindByLabelTextQueries(instance),
    ...a11yAPI(instance),
  };
}

export const getQueriesForElement = within;
