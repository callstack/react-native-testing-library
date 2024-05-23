import type { ReactTestInstance } from 'react-test-renderer';
import { bindByTextQueries } from './queries/text';
import { bindByTestIdQueries } from './queries/test-id';
import { bindByDisplayValueQueries } from './queries/display-value';
import { bindByPlaceholderTextQueries } from './queries/placeholder-text';
import { bindByLabelTextQueries } from './queries/label-text';
import { bindByHintTextQueries } from './queries/hint-text';
import { bindByRoleQueries } from './queries/role';
import { bindUnsafeByTypeQueries } from './queries/unsafe-type';
import { bindUnsafeByPropsQueries } from './queries/unsafe-props';

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
