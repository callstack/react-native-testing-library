import type { ReactTestInstance } from 'react-test-renderer';
import { a11yAPI } from './queries/a11yAPI';
import { bindByTextQueries } from './queries/byText';
import { bindByTestIdQueries } from './queries/byTestId';
import { bindByDisplayValueQueries } from './queries/byDisplayValue';
import { bindByPlaceholderTextQueries } from './queries/byPlaceholderText';
import { bindUnsafeByTypeQueries } from './queries/unsafeByType';
import { bindUnsafeByPropsQueries } from './queries/unsafeByProps';
import { bindUnsafeByNameQueries } from './queries/unsafeByName';

export function within(instance: ReactTestInstance) {
  return {
    ...bindByTextQueries(instance),
    ...bindByTestIdQueries(instance),
    ...bindByDisplayValueQueries(instance),
    ...bindByPlaceholderTextQueries(instance),
    ...bindUnsafeByTypeQueries(instance),
    ...bindUnsafeByPropsQueries(instance),
    ...bindUnsafeByNameQueries(instance),
    ...a11yAPI(instance),
  };
}

export const getQueriesForElement = within;
