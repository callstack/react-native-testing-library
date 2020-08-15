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

const makeFindQuery = <Text, Result>(
  instance: ReactTestInstance,
  getQuery: (instance: ReactTestInstance) => (text: Text) => Result,
  text: Text,
  waitForOptions: WaitForOptions
): Promise<Result> => waitFor(() => getQuery(instance)(text), waitForOptions);

export const findByTestId = (instance: ReactTestInstance) => (
  testId: string,
  waitForOptions: WaitForOptions = {}
) => makeFindQuery(instance, getByTestId, testId, waitForOptions);

export const findAllByTestId = (instance: ReactTestInstance) => (
  testId: string,
  waitForOptions: WaitForOptions = {}
) => makeFindQuery(instance, getAllByTestId, testId, waitForOptions);

export const findByText = (instance: ReactTestInstance) => (
  text: string | RegExp,
  waitForOptions: WaitForOptions = {}
) => makeFindQuery(instance, getByText, text, waitForOptions);

export const findAllByText = (instance: ReactTestInstance) => (
  text: string | RegExp,
  waitForOptions: WaitForOptions = {}
) => makeFindQuery(instance, getAllByText, text, waitForOptions);

export const findByPlaceholderText = (instance: ReactTestInstance) => (
  placeholder: string | RegExp,
  waitForOptions: WaitForOptions = {}
) => makeFindQuery(instance, getByPlaceholderText, placeholder, waitForOptions);

export const findAllByPlaceholderText = (instance: ReactTestInstance) => (
  placeholder: string | RegExp,
  waitForOptions: WaitForOptions = {}
) =>
  makeFindQuery(instance, getAllByPlaceholderText, placeholder, waitForOptions);

export const findByDisplayValue = (instance: ReactTestInstance) => (
  value: string | RegExp,
  waitForOptions: WaitForOptions = {}
) => makeFindQuery(instance, getByDisplayValue, value, waitForOptions);

export const findAllByDisplayValue = (instance: ReactTestInstance) => (
  value: string | RegExp,
  waitForOptions: WaitForOptions = {}
) => makeFindQuery(instance, getAllByDisplayValue, value, waitForOptions);

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
