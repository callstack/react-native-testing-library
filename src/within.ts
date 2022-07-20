import type { ReactTestInstance } from 'react-test-renderer';
import { bindByTextQueries } from './queries/text';
import { bindByTestIdQueries } from './queries/testId';
import { bindByDisplayValueQueries } from './queries/displayValue';
import { bindByPlaceholderTextQueries } from './queries/placeholderText';
import { bindByLabelTextQueries } from './queries/labelText';
import { bindByHintTextQueries } from './queries/hintText';
import { bindByRoleQueries } from './queries/role';
import { bindByA11yStateQueries } from './queries/a11yState';
import { bindByA11yValueQueries } from './queries/a11yValue';
import { bindUnsafeByTypeQueries } from './queries/unsafeType';
import { bindUnsafeByPropsQueries } from './queries/unsafeProps';

export function within(instance: ReactTestInstance) {
  return {
    ...bindByTextQueries(instance),
    ...bindByTestIdQueries(instance),
    ...bindByDisplayValueQueries(instance),
    ...bindByPlaceholderTextQueries(instance),
    ...bindByLabelTextQueries(instance),
    ...bindByHintTextQueries(instance),
    ...bindByRoleQueries(instance),
    ...bindByA11yStateQueries(instance),
    ...bindByA11yValueQueries(instance),
    ...bindUnsafeByTypeQueries(instance),
    ...bindUnsafeByPropsQueries(instance),
  };
}

export const getQueriesForElement = within;
