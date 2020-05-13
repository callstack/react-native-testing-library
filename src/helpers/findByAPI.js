// @flow
import {
  getByTestId,
  getAllByTestId,
  getByText,
  getAllByText,
  getByPlaceholder,
  getAllByPlaceholder,
  getByDisplayValue,
  getAllByDisplayValue,
} from './getByAPI';
import waitForElement from '../waitForElement';

type WaitForOptions = {
  timeout?: number,
  interval?: number,
};

const makeFindQuery = <Text, Result>(
  instance: ReactTestInstance,
  getQuery: (instance: ReactTestInstance) => (text: Text) => Result,
  text: Text,
  waitForOptions: WaitForOptions
): Promise<Result> =>
  waitForElement(
    () => getQuery(instance)(text),
    waitForOptions.timeout,
    waitForOptions.interval
  );

export const findByTestId = (instance: ReactTestInstance) => (
  testId: string,
  waitForOptions: WaitForOptions = {}
) => makeFindQuery(instance, getByTestId, testId, waitForOptions);

export const findByTestId2 = (instance: ReactTestInstance) => (
  testID: string,
  waitForOptions: WaitForOptions = {}
) =>
  waitForElement(
    () => getByTestId(instance)(testID),
    waitForOptions.timeout,
    waitForOptions.interval
  );

export const findAllByTestId = (instance: ReactTestInstance) => (
  testID: string,
  waitForOptions: WaitForOptions = {}
) =>
  waitForElement(
    () => getAllByTestId(instance)(testID),
    waitForOptions.timeout,
    waitForOptions.interval
  );

export const findByText = (instance: ReactTestInstance) => (
  text: string | RegExp,
  waitForOptions: WaitForOptions = {}
) => makeFindQuery(instance, getByText, text, waitForOptions);

export const findAllByText = (instance: ReactTestInstance) => (
  text: string | RegExp,
  waitForOptions: WaitForOptions = {}
) => makeFindQuery(instance, getAllByText, text, waitForOptions);

export const findByPlaceholder = (instance: ReactTestInstance) => (
  placeholder: string | RegExp,
  waitForOptions: WaitForOptions = {}
) => makeFindQuery(instance, getByPlaceholder, placeholder, waitForOptions);

export const findAllByPlaceholder = (instance: ReactTestInstance) => (
  placeholder: string | RegExp,
  waitForOptions: WaitForOptions = {}
) => makeFindQuery(instance, getAllByPlaceholder, placeholder, waitForOptions);

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
  findByPlaceholder: findByPlaceholder(instance),
  findByDisplayValue: findByDisplayValue(instance),
  findAllByTestId: findAllByTestId(instance),
  findAllByText: findAllByText(instance),
  findAllByPlaceholder: findAllByPlaceholder(instance),
  findAllByDisplayValue: findAllByDisplayValue(instance),
});
