import type { ReactTestInstance } from 'react-test-renderer';
import type { WaitForOptions } from '../waitFor';
import type { TextMatch } from '../matches';
import type { TextMatchOptions } from './byText';
import { findAllByTestId, findByTestId } from './byTestId';
import { findAllByText, findByText } from './byText';
import {
  findAllByPlaceholderText,
  findByPlaceholderText,
} from './byPlaceholderText';
import { findAllByDisplayValue, findByDisplayValue } from './byDisplayValue';
import { throwRenamedFunctionError } from './errors';

export type FindByAPI = {
  findAllByDisplayValue: (
    value: TextMatch,
    queryOptions?: TextMatchOptions & WaitForOptions,
    waitForOptions?: WaitForOptions
  ) => Promise<Array<ReactTestInstance>>;
  findAllByPlaceholder: () => void;
  findAllByPlaceholderText: (
    placeholder: TextMatch,
    queryOptions?: TextMatchOptions & WaitForOptions,
    waitForOptions?: WaitForOptions
  ) => Promise<Array<ReactTestInstance>>;
  findAllByTestId: (
    testId: TextMatch,
    queryOptions?: TextMatchOptions & WaitForOptions,
    waitForOptions?: WaitForOptions
  ) => Promise<Array<ReactTestInstance>>;
  findAllByText: (
    text: TextMatch,
    queryOptions?: TextMatchOptions & WaitForOptions,
    waitForOptions?: WaitForOptions
  ) => Promise<Array<ReactTestInstance>>;
  findByDisplayValue: (
    value: TextMatch,
    queryOptions?: TextMatchOptions & WaitForOptions,
    waitForOptions?: WaitForOptions
  ) => Promise<ReactTestInstance>;
  findByPlaceholder: () => void;
  findByPlaceholderText: (
    placeholder: TextMatch,
    queryOptions?: TextMatchOptions & WaitForOptions,
    waitForOptions?: WaitForOptions
  ) => Promise<ReactTestInstance>;
  findByTestId: (
    testId: TextMatch,
    queryOptions?: TextMatchOptions & WaitForOptions,
    waitForOptions?: WaitForOptions
  ) => Promise<ReactTestInstance>;
  findByText: (
    text: TextMatch,
    queryOptions?: TextMatchOptions & WaitForOptions,
    waitForOptions?: WaitForOptions
  ) => Promise<ReactTestInstance>;
};

export const findByAPI = (instance: ReactTestInstance): FindByAPI => ({
  findByTestId: findByTestId(instance),
  findByText: findByText(instance),
  findByPlaceholderText: findByPlaceholderText(instance),
  findByDisplayValue: findByDisplayValue(instance),
  findAllByTestId: findAllByTestId(instance),
  findAllByText: findAllByText(instance),
  findAllByPlaceholderText: findAllByPlaceholderText(instance),
  findAllByDisplayValue: findAllByDisplayValue(instance),

  // Renamed
  findByPlaceholder: () =>
    throwRenamedFunctionError('findByPlaceholder', 'findByPlaceholderText'),
  findAllByPlaceholder: () =>
    throwRenamedFunctionError(
      'findAllByPlaceholder',
      'findAllByPlaceholderText'
    ),
});
