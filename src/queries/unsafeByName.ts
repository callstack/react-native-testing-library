import type { ReactTestInstance } from 'react-test-renderer';
import { throwRemovedFunctionError } from '../helpers/errors';

// TODO: remove in the next release
export type UnsafeByNameQueries = {
  // Removed queries
  queryByName: () => void;
  queryAllByName: () => void;
};

// TODO: remove in the next release
export const bindUnsafeByNameQueries = (
  _instance: ReactTestInstance
): UnsafeByNameQueries => ({
  // Removed
  queryByName: () =>
    throwRemovedFunctionError('queryByName', 'migration-v2#removed-functions'),
  queryAllByName: () =>
    throwRemovedFunctionError(
      'queryAllByName',
      'migration-v2#removed-functions'
    ),
});
