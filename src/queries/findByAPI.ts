import type { ReactTestInstance } from 'react-test-renderer';
import type { WaitForOptions } from '../waitFor';
import type { TextMatch } from '../matches';
import { throwRenamedFunctionError } from '../helpers/errors';
import type { TextMatchOptions } from './byText';
import {
  findAllByPlaceholderText,
  findByPlaceholderText,
} from './byPlaceholderText';

export type FindByAPI = {
  findAllByPlaceholder: () => void;
  findAllByPlaceholderText: (
    placeholder: TextMatch,
    queryOptions?: TextMatchOptions & WaitForOptions,
    waitForOptions?: WaitForOptions
  ) => Promise<Array<ReactTestInstance>>;
  findByPlaceholder: () => void;
  findByPlaceholderText: (
    placeholder: TextMatch,
    queryOptions?: TextMatchOptions & WaitForOptions,
    waitForOptions?: WaitForOptions
  ) => Promise<ReactTestInstance>;
};

export const findByAPI = (instance: ReactTestInstance): FindByAPI => ({
  findByPlaceholderText: findByPlaceholderText(instance),
  findAllByPlaceholderText: findAllByPlaceholderText(instance),

  // Renamed
  findByPlaceholder: () =>
    throwRenamedFunctionError('findByPlaceholder', 'findByPlaceholderText'),
  findAllByPlaceholder: () =>
    throwRenamedFunctionError(
      'findAllByPlaceholder',
      'findAllByPlaceholderText'
    ),
});
