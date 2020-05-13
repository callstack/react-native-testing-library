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

export const findByTestId = (instance: ReactTestInstance) => (
  testID: string,
  waitForOptions: any = {}
) =>
  waitForElement(
    () => getByTestId(instance)(testID),
    waitForOptions.timeout,
    waitForOptions.interval
  );

export const findAllByTestId = (instance: ReactTestInstance) => (
  testID: string,
  waitForOptions: any = {}
) =>
  waitForElement(
    () => getAllByTestId(instance)(testID),
    waitForOptions.timeout,
    waitForOptions.interval
  );

export const findByText = (instance: ReactTestInstance) => (
  text: string | RegExp,
  waitForOptions: any = {}
) =>
  waitForElement(
    () => getByText(instance)(text),
    waitForOptions.timeout,
    waitForOptions.interval
  );

export const findAllByText = (instance: ReactTestInstance) => (
  text: string | RegExp,
  waitForOptions: any = {}
) =>
  waitForElement(
    () => getAllByText(instance)(text),
    waitForOptions.timeout,
    waitForOptions.interval
  );

export const findByPlaceholder = (instance: ReactTestInstance) => (
  placeholder: string | RegExp,
  waitForOptions: any = {}
) =>
  waitForElement(
    () => getByPlaceholder(instance)(placeholder),
    waitForOptions.timeout,
    waitForOptions.interval
  );

export const findAllByPlaceholder = (instance: ReactTestInstance) => (
  placeholder: string | RegExp,
  waitForOptions: any = {}
) =>
  waitForElement(
    () => getAllByPlaceholder(instance)(placeholder),
    waitForOptions.timeout,
    waitForOptions.interval
  );

export const findByDisplayValue = (instance: ReactTestInstance) => (
  value: string | RegExp,
  waitForOptions: any = {}
) =>
  waitForElement(
    () => getByDisplayValue(instance)(value),
    waitForOptions.timeout,
    waitForOptions.interval
  );

export const findAllByDisplayValue = (instance: ReactTestInstance) => (
  value: string | RegExp,
  waitForOptions: any = {}
) =>
  waitForElement(
    () => getAllByDisplayValue(instance)(value),
    waitForOptions.timeout,
    waitForOptions.interval
  );

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
