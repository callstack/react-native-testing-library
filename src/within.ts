import type { HostElement } from 'universal-test-renderer';

import { bindByDisplayValueQueries } from './queries/display-value';
import { bindByHintTextQueries } from './queries/hint-text';
import { bindByLabelTextQueries } from './queries/label-text';
import { bindByPlaceholderTextQueries } from './queries/placeholder-text';
import { bindByRoleQueries } from './queries/role';
import { bindByTestIdQueries } from './queries/test-id';
import { bindByTextQueries } from './queries/text';

export function within(element: HostElement) {
  return {
    ...bindByTextQueries(element),
    ...bindByTestIdQueries(element),
    ...bindByDisplayValueQueries(element),
    ...bindByPlaceholderTextQueries(element),
    ...bindByLabelTextQueries(element),
    ...bindByHintTextQueries(element),
    ...bindByRoleQueries(element),
  };
}

export const getQueriesForElement = within;
