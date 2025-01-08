import type { ReactTestInstance } from 'react-test-renderer';
import { bindByDisplayValueQueries } from './queries/display-value';
import { bindByHintTextQueries } from './queries/hint-text';
import { bindByLabelTextQueries } from './queries/label-text';
import { bindByPlaceholderTextQueries } from './queries/placeholder-text';
import { bindByRoleQueries } from './queries/role';
import { bindByTestIdQueries } from './queries/test-id';
import { bindByTextQueries } from './queries/text';
import { bindUnsafeByPropsQueries } from './queries/unsafe-props';
import { bindUnsafeByTypeQueries } from './queries/unsafe-type';

export function within(instance: ReactTestInstance) {
  return {
    ...bindByTextQueries(instance),
    ...bindByTestIdQueries(instance),
    ...bindByDisplayValueQueries(instance),
    ...bindByPlaceholderTextQueries(instance),
    ...bindByLabelTextQueries(instance),
    ...bindByHintTextQueries(instance),
    ...bindByRoleQueries(instance),
    ...bindUnsafeByTypeQueries(instance),
    ...bindUnsafeByPropsQueries(instance),
  };
}

export const getQueriesForElement = within;
