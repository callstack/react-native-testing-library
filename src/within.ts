import type { HostElement } from 'universal-test-renderer';

import { bindByDisplayValueQueries } from './queries/display-value';
import { bindByHintTextQueries } from './queries/hint-text';
import { bindByLabelTextQueries } from './queries/label-text';
import { bindByPlaceholderTextQueries } from './queries/placeholder-text';
import { bindByRoleQueries } from './queries/role';
import { bindByTestIdQueries } from './queries/test-id';
import { bindByTextQueries } from './queries/text';

export function within(instance: HostElement) {
  return {
    ...bindByDisplayValueQueries(instance),
    ...bindByPlaceholderTextQueries(instance),
    ...bindByHintTextQueries(instance),
    ...bindByLabelTextQueries(instance),
    ...bindByRoleQueries(instance),
    ...bindByTestIdQueries(instance),
    ...bindByTextQueries(instance),
  };
}

export const getQueriesForElement = within;
