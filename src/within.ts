import type { TestInstance } from 'test-renderer';

import { bindByDisplayValueQueries } from './queries/display-value';
import { bindByHintTextQueries } from './queries/hint-text';
import { bindByLabelTextQueries } from './queries/label-text';
import { bindByPlaceholderTextQueries } from './queries/placeholder-text';
import { bindByRoleQueries } from './queries/role';
import { bindByTestIdQueries } from './queries/test-id';
import { bindByTextQueries } from './queries/text';

export function within(instance: TestInstance) {
  return {
    ...bindByTextQueries(instance),
    ...bindByTestIdQueries(instance),
    ...bindByDisplayValueQueries(instance),
    ...bindByPlaceholderTextQueries(instance),
    ...bindByLabelTextQueries(instance),
    ...bindByHintTextQueries(instance),
    ...bindByRoleQueries(instance),
  };
}

export const getQueriesForInstance = within;
