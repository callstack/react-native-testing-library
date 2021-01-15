// @flow
import type { WaitForOptions } from '../waitFor';
import { findAllByTestId, findByTestId } from './byTestId';
import { findAllByText, findByText } from './byText';
import {
  findAllByPlaceholderText,
  findByPlaceholderText,
} from './byPlaceholderText';
import { findAllByDisplayValue, findByDisplayValue } from './byDisplayValue';
import { throwRenamedFunctionError } from './errors';

export type FindByAPI = {|
  findAllByDisplayValue: (
    value: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => Promise<Array<ReactTestInstance>>,
  findAllByPlaceholder: () => void,
  findAllByPlaceholderText: (
    placeholder: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => Promise<Array<ReactTestInstance>>,
  findAllByTestId: (
    testId: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => Promise<Array<ReactTestInstance>>,
  findAllByText: (
    text: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => Promise<Array<ReactTestInstance>>,
  findByDisplayValue: (
    value: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => Promise<ReactTestInstance>,
  findByPlaceholder: () => void,
  findByPlaceholderText: (
    placeholder: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => Promise<ReactTestInstance>,
  findByTestId: (
    testId: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => Promise<ReactTestInstance>,
  findByText: (
    text: string | RegExp,
    waitForOptions?: WaitForOptions
  ) => Promise<ReactTestInstance>,
|};

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
