import type { ReactTestInstance, ReactTestRenderer } from 'react-test-renderer';
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

export const findByAPI = (renderer: ReactTestRenderer): FindByAPI => ({
  findByTestId: findByTestId(renderer),
  findByText: findByText(renderer),
  findByPlaceholderText: findByPlaceholderText(renderer),
  findByDisplayValue: findByDisplayValue(renderer),
  findAllByTestId: findAllByTestId(renderer),
  findAllByText: findAllByText(renderer),
  findAllByPlaceholderText: findAllByPlaceholderText(renderer),
  findAllByDisplayValue: findAllByDisplayValue(renderer),

  // Renamed
  findByPlaceholder: () =>
    throwRenamedFunctionError('findByPlaceholder', 'findByPlaceholderText'),
  findAllByPlaceholder: () =>
    throwRenamedFunctionError(
      'findAllByPlaceholder',
      'findAllByPlaceholderText'
    ),
});
