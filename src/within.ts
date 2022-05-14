import type { ReactTestInstance } from 'react-test-renderer';
import { a11yAPI } from './queries/a11yAPI';
import { bindByTextQueries } from './queries/text';
import { bindByTestIdQueries } from './queries/testId';
import { bindByDisplayValueQueries } from './queries/displayValue';
import { bindByPlaceholderTextQueries } from './queries/placeholderText';
import { bindUnsafeByTypeQueries } from './queries/unsafeType';
import { bindUnsafeByPropsQueries } from './queries/unsafeProps';
import { bindByLabelTextQueries } from './queries/labelText';
import { bindByA11yHintQueries } from './queries/a11yHint';
import { bindByRoleQueries } from './queries/role';
import { bindByA11yStateQueries } from './queries/a11yState';
import { bindByA11yValueQueries } from './queries/a11yValue';

export function within(instance: ReactTestInstance) {
  return {
    ...bindByTextQueries(instance),
    ...bindByTestIdQueries(instance),
    ...bindByDisplayValueQueries(instance),
    ...bindByPlaceholderTextQueries(instance),
    ...bindUnsafeByTypeQueries(instance),
    ...bindUnsafeByPropsQueries(instance),
    ...bindByLabelTextQueries(instance),
    ...bindByRoleQueries(instance),
    ...bindByA11yHintQueries(instance),
    ...bindByA11yStateQueries(instance),
    ...bindByA11yValueQueries(instance),
    ...a11yAPI(instance),
  };
}

export const getQueriesForElement = within;
