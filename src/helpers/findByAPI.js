// @flow
import waitFor from '../waitFor';
import type { WaitForOptions } from '../waitFor';
import {
  getByTestId,
  getAllByTestId,
  getByText,
  getAllByText,
  getByPlaceholderText,
  getAllByPlaceholderText,
  getByDisplayValue,
  getAllByDisplayValue,
} from './getByAPI';
import { throwRenamedFunctionError } from './errors';
import type { TextMatchOptions } from './getByAPI';

const makeFindQuery = <Text, Result>(
  instance: ReactTestInstance,
  getQuery: (
    instance: ReactTestInstance
  ) => (text: Text, options?: TextMatchOptions) => Result,
  text: Text,
  waitForOptions: WaitForOptions,
  textMatchOptions?: TextMatchOptions
): Promise<Result> =>
  waitFor(() => getQuery(instance)(text, textMatchOptions), waitForOptions);

export const findByTestId = (instance: ReactTestInstance) => (
  testId: string | RegExp,
  waitForOptions: WaitForOptions = {}
) => makeFindQuery(instance, getByTestId, testId, waitForOptions);

export const findAllByTestId = (instance: ReactTestInstance) => (
  testId: string | RegExp,
  waitForOptions: WaitForOptions = {}
) => makeFindQuery(instance, getAllByTestId, testId, waitForOptions);

export const findByText = (instance: ReactTestInstance) => (
  text: string | RegExp,
  waitForOptions: WaitForOptions = {},
  textMatchOptions?: TextMatchOptions
) => makeFindQuery(instance, getByText, text, waitForOptions, textMatchOptions);

export const findAllByText = (instance: ReactTestInstance) => (
  text: string | RegExp,
  waitForOptions: WaitForOptions = {},
  textMatchOptions?: TextMatchOptions
) =>
  makeFindQuery(instance, getAllByText, text, waitForOptions, textMatchOptions);

export const findByPlaceholderText = (instance: ReactTestInstance) => (
  placeholder: string | RegExp,
  waitForOptions: WaitForOptions = {},
  textMatchOptions?: TextMatchOptions
) =>
  makeFindQuery(
    instance,
    getByPlaceholderText,
    placeholder,
    waitForOptions,
    textMatchOptions
  );

export const findAllByPlaceholderText = (instance: ReactTestInstance) => (
  placeholder: string | RegExp,
  waitForOptions: WaitForOptions = {},
  textMatchOptions?: TextMatchOptions
) =>
  makeFindQuery(
    instance,
    getAllByPlaceholderText,
    placeholder,
    waitForOptions,
    textMatchOptions
  );

export const findByDisplayValue = (instance: ReactTestInstance) => (
  value: string | RegExp,
  waitForOptions: WaitForOptions = {},
  textMatchOptions?: TextMatchOptions
) =>
  makeFindQuery(
    instance,
    getByDisplayValue,
    value,
    waitForOptions,
    textMatchOptions
  );

export const findAllByDisplayValue = (instance: ReactTestInstance) => (
  value: string | RegExp,
  waitForOptions: WaitForOptions = {},
  textMatchOptions?: TextMatchOptions
) =>
  makeFindQuery(
    instance,
    getAllByDisplayValue,
    value,
    waitForOptions,
    textMatchOptions
  );

export const findByAPI = (instance: ReactTestInstance) => ({
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
