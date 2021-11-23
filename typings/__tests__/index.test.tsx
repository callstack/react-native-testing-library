/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { ReactTestInstance } from 'react-test-renderer';
import {
  render,
  fireEvent,
  flushMicrotasksQueue,
  waitFor,
  waitForElementToBeRemoved,
  act,
  within,
  getQueriesForElement,
  getDefaultNormalizer,
} from '../..';

interface HasRequiredProp {
  requiredProp: string;
}

const View = (props) => props.children;
const Text = (props) => props.children;
const TextInput = (props) => props.children;
const ElementWithRequiredProps = (props: HasRequiredProp) => (
  <Text>{props.requiredProp}</Text>
);

const TestComponent = () => (
  <View>
    <Text>Test component</Text>
    <TextInput placeholder="my placeholder" />
  </View>
);

const tree = render(<TestComponent />);

// getBy API
const getBy: ReactTestInstance[] = [
  tree.getByText('<View />'),
  tree.getByText(/View/g),
  tree.getByPlaceholderText('my placeholder'),
  tree.getByPlaceholderText(/placeholder/g),
  tree.getByDisplayValue('my value'),
  tree.getByDisplayValue(/value/g),
  tree.getByTestId('test-id'),
  tree.getByTestId(/test-id/),
  tree.getByA11yLabel('label'),
  tree.getByLabelText('label'),
  tree.getByA11yHint('label'),
  tree.getByHintText('label'),
  tree.getByA11yRole('button'),
  tree.getByRole('button'),
  tree.getByA11yStates('selected'),
  tree.getByA11yStates(['selected']),
  tree.getByA11yState({ busy: true }),
  tree.getByA11yValue({ min: 10 }),
  tree.UNSAFE_getByType(View),
  tree.UNSAFE_getByType(ElementWithRequiredProps),
  tree.UNSAFE_getByProps({ value: 2 }),
];

const getAllBy: ReactTestInstance[][] = [
  tree.getAllByText('<View />'),
  tree.getAllByText(/Text/g),
  tree.getAllByPlaceholderText('my placeholder'),
  tree.getAllByPlaceholderText(/placeholder/g),
  tree.getAllByDisplayValue('my value'),
  tree.getAllByDisplayValue(/value/g),
  tree.getAllByTestId('test-id'),
  tree.getAllByTestId(/value/g),
  tree.getAllByA11yLabel('label'),
  tree.getAllByLabelText('label'),
  tree.getAllByA11yHint('label'),
  tree.getAllByHintText('label'),
  tree.getAllByA11yRole('button'),
  tree.getAllByRole('button'),
  tree.getAllByA11yStates('selected'),
  tree.getAllByA11yStates(['selected']),
  tree.getAllByA11yState({ busy: true }),
  tree.getAllByA11yValue({ min: 10 }),
  tree.UNSAFE_getAllByType(View),
  tree.UNSAFE_getAllByType(ElementWithRequiredProps),
  tree.UNSAFE_getAllByProps({ value: 2 }),
];

// queryBy API
const queryBy: Array<ReactTestInstance | null> = [
  tree.queryByText('View'),
  tree.queryByText(/View/g),
  tree.queryByPlaceholderText('my placeholder'),
  tree.queryByPlaceholderText(/placeholder/g),
  tree.queryByDisplayValue('my value'),
  tree.queryByDisplayValue(/value/g),
  tree.queryByTestId('test-id'),
  tree.queryByTestId(/test-id/),
  tree.queryByA11yHint('label'),
  tree.queryByHintText('label'),
  tree.queryByA11yLabel('label'),
  tree.queryByLabelText('label'),
  tree.queryByA11yRole('button'),
  tree.queryByRole('button'),
  tree.queryByA11yStates('selected'),
  tree.queryByA11yStates(['selected']),
  tree.queryByA11yState({ busy: true }),
  tree.queryByA11yValue({ min: 10 }),
  tree.UNSAFE_queryByType(View),
  tree.UNSAFE_queryByType(ElementWithRequiredProps),
  tree.UNSAFE_queryByProps({ value: 2 }),
];

const queryAllBy: ReactTestInstance[][] = [
  tree.queryAllByText('View'),
  tree.queryAllByText(/View/g),
  tree.queryAllByPlaceholderText('my placeholder'),
  tree.queryAllByPlaceholderText(/placeholder/g),
  tree.queryAllByDisplayValue('my value'),
  tree.queryAllByDisplayValue(/value/g),
  tree.queryAllByTestId('test-id'),
  tree.queryAllByTestId(/test-id/),
  tree.queryAllByA11yLabel('label'),
  tree.queryAllByLabelText('label'),
  tree.queryAllByA11yHint('label'),
  tree.queryAllByHintText('label'),
  tree.queryAllByA11yRole('button'),
  tree.queryAllByRole('button'),
  tree.queryAllByA11yStates('selected'),
  tree.queryAllByA11yStates(['selected']),
  tree.queryAllByA11yState({ busy: true }),
  tree.queryAllByA11yValue({ min: 10 }),
  tree.UNSAFE_queryAllByType(View),
  tree.UNSAFE_queryAllByType(ElementWithRequiredProps),
  tree.UNSAFE_queryAllByProps({ value: 2 }),
];

// findBy API
const findBy: Promise<ReactTestInstance>[] = [
  tree.findByText('View'),
  tree.findByText('View', {}, { timeout: 10, interval: 10 }),
  tree.findByText(/View/g),
  tree.findByText(/View/g, {}, { timeout: 10, interval: 5 }),
  tree.findByPlaceholderText('my placeholder'),
  tree.findByPlaceholderText(
    'my placeholder',
    {},
    { timeout: 10, interval: 5 }
  ),
  tree.findByPlaceholderText(/placeholder/g),
  tree.findByPlaceholderText(/placeholder/g, {}, { timeout: 10, interval: 5 }),
  tree.findByDisplayValue('my value'),
  tree.findByDisplayValue('my value', {}, { timeout: 10, interval: 10 }),
  tree.findByDisplayValue(/value/g),
  tree.findByDisplayValue(/value/g, {}, { timeout: 10, interval: 10 }),
  tree.findByTestId('test-id'),
  tree.findByTestId(/test-id/, {}, { timeout: 10, interval: 10 }),
  tree.findByA11yLabel('label'),
  tree.findByA11yLabel('label', { timeout: 10, interval: 10 }),
  tree.findByLabelText('label'),
  tree.findByLabelText('label', { timeout: 10, interval: 10 }),
  tree.findByA11yHint('label'),
  tree.findByA11yHint('label', { timeout: 10, interval: 10 }),
  tree.findByHintText('label'),
  tree.findByHintText('label', { timeout: 10, interval: 10 }),
  tree.findByA11yRole('button'),
  tree.findByA11yRole('button', { timeout: 10, interval: 10 }),
  tree.findByRole('button'),
  tree.findByRole('button', { timeout: 10, interval: 10 }),
  tree.findByA11yState({ busy: true }),
  tree.findByA11yState({ busy: true }, { timeout: 10, interval: 10 }),
  tree.findByA11yValue({ min: 10 }),
  tree.findByA11yValue({ min: 10 }, { timeout: 10, interval: 10 }),
];

const findAllBy: Promise<ReactTestInstance[]>[] = [
  tree.findAllByText('View'),
  tree.findAllByText('View', {}, { timeout: 10, interval: 10 }),
  tree.findAllByText(/View/g),
  tree.findAllByText(/View/g, { exact: false }, { timeout: 10, interval: 5 }),
  tree.findAllByPlaceholderText('my placeholder'),
  tree.findAllByPlaceholderText(
    'my placeholder',
    { exact: false },
    {
      timeout: 10,
      interval: 10,
    }
  ),
  tree.findAllByPlaceholderText(/placeholder/g),
  tree.findAllByPlaceholderText(
    /placeholder/g,
    {},
    { timeout: 10, interval: 10 }
  ),
  tree.findAllByDisplayValue('View'),
  tree.findAllByDisplayValue('View', {}, { timeout: 10, interval: 10 }),
  tree.findAllByDisplayValue(/View/g),
  tree.findAllByDisplayValue(/View/g, {}, { timeout: 10, interval: 10 }),
  tree.findAllByTestId('test-id'),
  tree.findAllByTestId(/test-id/, {}, { timeout: 10, interval: 10 }),
  tree.findAllByA11yLabel('label'),
  tree.findAllByA11yLabel('label', { timeout: 10, interval: 10 }),
  tree.findAllByLabelText('label'),
  tree.findAllByLabelText('label', { timeout: 10, interval: 10 }),
  tree.findAllByA11yHint('label'),
  tree.findAllByA11yHint('label', { timeout: 10, interval: 10 }),
  tree.findAllByHintText('label'),
  tree.findAllByHintText('label', { timeout: 10, interval: 10 }),
  tree.findAllByA11yState({ busy: true }),
  tree.findAllByA11yState({ busy: true }, { timeout: 10, interval: 10 }),
  tree.findAllByA11yValue({ min: 10 }),
  tree.findAllByA11yValue({ min: 10 }, { timeout: 10, interval: 10 }),
];

// debug API
const debugFn = tree.debug();
const debugFnWithMessage = tree.debug('my message');
const shallowDebug = tree.debug.shallow();
const shallowDebugWithMessage = tree.debug.shallow('my message');

// update API
tree.update(<View />);
tree.rerender(<View />);
tree.unmount();

// fireEvent API
const element: ReactTestInstance = tree.getByText('text');
fireEvent(element, 'press');
fireEvent(element, 'press', 'data');
fireEvent(element, 'press', 'param1', 'param2');
fireEvent.press(element);
fireEvent.changeText(element, 'string');
fireEvent.scroll(element, 'eventData');

// waitFor API
const timeout = { timeout: 10 };
const timeoutInterval = { timeout: 100, interval: 10 };

const waitGetBy: Promise<ReactTestInstance>[] = [
  waitFor<ReactTestInstance>(() => tree.getByA11yLabel('label')),
  waitFor<ReactTestInstance>(() => tree.getByA11yLabel('label'), timeout),
  waitFor<ReactTestInstance>(
    () => tree.getByA11yLabel('label'),
    timeoutInterval
  ),
];

const waitGetAllBy: Promise<ReactTestInstance[]>[] = [
  waitFor<ReactTestInstance[]>(() => tree.getAllByA11yLabel('label')),
  waitFor<ReactTestInstance[]>(() => tree.getAllByA11yLabel('label'), timeout),
  waitFor<ReactTestInstance[]>(
    () => tree.getAllByA11yLabel('label'),
    timeoutInterval
  ),
];

// waitForElementToBeRemoved API
const waitForElementToBeRemovedGetBy: Promise<ReactTestInstance>[] = [
  waitForElementToBeRemoved<ReactTestInstance>(() => tree.getByText('text')),
  waitForElementToBeRemoved<ReactTestInstance>(
    () => tree.getByText('text'),
    timeout
  ),
  waitForElementToBeRemoved<ReactTestInstance>(
    () => tree.getByText('text'),
    timeoutInterval
  ),
];
const waitForElementToBeRemovedGetAllBy: Promise<ReactTestInstance[]>[] = [
  waitForElementToBeRemoved<ReactTestInstance[]>(() =>
    tree.getAllByText('text')
  ),
  waitForElementToBeRemoved<ReactTestInstance[]>(
    () => tree.getAllByText('text'),
    timeout
  ),
  waitForElementToBeRemoved<ReactTestInstance[]>(
    () => tree.getAllByText('text'),
    timeoutInterval
  ),
];
const waitForElementToBeRemovedQueryBy: Promise<ReactTestInstance | null>[] = [
  waitForElementToBeRemoved<ReactTestInstance | null>(() =>
    tree.queryByText('text')
  ),
  waitForElementToBeRemoved<ReactTestInstance | null>(
    () => tree.queryByText('text'),
    timeout
  ),
  waitForElementToBeRemoved<ReactTestInstance | null>(
    () => tree.queryByText('text'),
    timeoutInterval
  ),
];
const waitForElementToBeRemovedQueryAllBy: Promise<ReactTestInstance[]>[] = [
  waitForElementToBeRemoved<ReactTestInstance[]>(() =>
    tree.queryAllByText('text')
  ),
  waitForElementToBeRemoved<ReactTestInstance[]>(
    () => tree.queryAllByText('text'),
    timeout
  ),
  waitForElementToBeRemoved<ReactTestInstance[]>(
    () => tree.queryAllByText('text'),
    timeoutInterval
  ),
];

const waitForFlush: Promise<any> = flushMicrotasksQueue();

// act API
act(() => {
  render(<TestComponent />);
});

// within API
const instance: ReactTestInstance = tree.getByText('<View />');

const withinGet: Array<ReactTestInstance> = [
  within(instance).getByText('Test'),
  within(instance).getByDisplayValue('Test'),
  within(instance).getByPlaceholderText('Test'),
  within(instance).getByTestId('Test'),
  within(instance).getByA11yLabel('Test'),
  within(instance).getByLabelText('Test'),
  within(instance).getByA11yHint('Test'),
  within(instance).getByHintText('Test'),
  within(instance).getByA11yRole('button'),
  within(instance).getByRole('button'),
  within(instance).getByA11yState({ busy: true }),
  within(instance).getByA11yValue({ min: 10 }),
  getQueriesForElement(instance).getByText('Test'),
  getQueriesForElement(instance).getByDisplayValue('Test'),
  getQueriesForElement(instance).getByPlaceholderText('Test'),
  getQueriesForElement(instance).getByTestId('Test'),
  getQueriesForElement(instance).getByA11yLabel('Test'),
  getQueriesForElement(instance).getByLabelText('Test'),
  getQueriesForElement(instance).getByA11yHint('Test'),
  getQueriesForElement(instance).getByHintText('Test'),
  getQueriesForElement(instance).getByA11yRole('button'),
  getQueriesForElement(instance).getByRole('button'),
  getQueriesForElement(instance).getByA11yState({ busy: true }),
  getQueriesForElement(instance).getByA11yValue({ min: 10 }),
];

const withinGetAll: Array<ReactTestInstance[]> = [
  within(instance).getAllByText('Test'),
  within(instance).getAllByDisplayValue('Test'),
  within(instance).getAllByPlaceholderText('Test'),
  within(instance).getAllByTestId('Test'),
  within(instance).getAllByA11yLabel('Test'),
  within(instance).getAllByLabelText('button'),
  within(instance).getAllByA11yHint('Test'),
  within(instance).getAllByHintText('button'),
  within(instance).getAllByA11yRole('button'),
  within(instance).getAllByRole('button'),
  within(instance).getAllByA11yState({ busy: true }),
  within(instance).getAllByA11yValue({ min: 10 }),
  getQueriesForElement(instance).getAllByText('Test'),
  getQueriesForElement(instance).getAllByDisplayValue('Test'),
  getQueriesForElement(instance).getAllByPlaceholderText('Test'),
  getQueriesForElement(instance).getAllByTestId('Test'),
  getQueriesForElement(instance).getAllByA11yLabel('Test'),
  getQueriesForElement(instance).getAllByLabelText('button'),
  getQueriesForElement(instance).getAllByA11yHint('Test'),
  getQueriesForElement(instance).getAllByHintText('button'),
  getQueriesForElement(instance).getAllByA11yRole('button'),
  getQueriesForElement(instance).getAllByRole('button'),
  getQueriesForElement(instance).getAllByA11yState({ busy: true }),
  getQueriesForElement(instance).getAllByA11yValue({ min: 10 }),
];

const withinQuery: Array<ReactTestInstance | null> = [
  within(instance).queryByText('Test'),
  within(instance).queryByDisplayValue('Test'),
  within(instance).queryByPlaceholderText('Test'),
  within(instance).queryByTestId('Test'),
  within(instance).queryByA11yLabel('Test'),
  within(instance).queryByLabelText('button'),
  within(instance).queryByA11yHint('Test'),
  within(instance).queryByHintText('button'),
  within(instance).queryByA11yRole('button'),
  within(instance).queryByRole('button'),
  within(instance).queryByA11yState({ busy: true }),
  within(instance).queryByA11yValue({ min: 10 }),
  getQueriesForElement(instance).queryByText('Test'),
  getQueriesForElement(instance).queryByDisplayValue('Test'),
  getQueriesForElement(instance).queryByPlaceholderText('Test'),
  getQueriesForElement(instance).queryByTestId('Test'),
  getQueriesForElement(instance).queryByA11yLabel('Test'),
  getQueriesForElement(instance).queryByLabelText('button'),
  getQueriesForElement(instance).queryByA11yHint('Test'),
  getQueriesForElement(instance).queryByHintText('button'),
  getQueriesForElement(instance).queryByA11yRole('button'),
  getQueriesForElement(instance).queryByRole('button'),
  getQueriesForElement(instance).queryByA11yState({ busy: true }),
  getQueriesForElement(instance).queryByA11yValue({ min: 10 }),
];

const withinQueryAll: Array<ReactTestInstance[]> = [
  within(instance).queryAllByText('Test'),
  within(instance).queryAllByDisplayValue('Test'),
  within(instance).queryAllByPlaceholderText('Test'),
  within(instance).queryAllByTestId('Test'),
  within(instance).queryAllByA11yLabel('Test'),
  within(instance).queryAllByLabelText('Test'),
  within(instance).queryAllByA11yHint('Test'),
  within(instance).queryAllByHintText('Test'),
  within(instance).queryAllByA11yRole('button'),
  within(instance).queryAllByRole('button'),
  within(instance).queryAllByA11yState({ busy: true }),
  within(instance).queryAllByA11yValue({ min: 10 }),
  getQueriesForElement(instance).queryAllByText('Test'),
  getQueriesForElement(instance).queryAllByDisplayValue('Test'),
  getQueriesForElement(instance).queryAllByPlaceholderText('Test'),
  getQueriesForElement(instance).queryAllByTestId('Test'),
  getQueriesForElement(instance).queryAllByA11yLabel('Test'),
  getQueriesForElement(instance).queryAllByLabelText('Test'),
  getQueriesForElement(instance).queryAllByA11yHint('Test'),
  getQueriesForElement(instance).queryAllByHintText('Test'),
  getQueriesForElement(instance).queryAllByA11yRole('button'),
  getQueriesForElement(instance).queryAllByRole('button'),
  getQueriesForElement(instance).queryAllByA11yState({ busy: true }),
  getQueriesForElement(instance).queryAllByA11yValue({ min: 10 }),
];

const withinFind: Promise<ReactTestInstance>[] = [
  within(instance).findByText('Test'),
  within(instance).findByDisplayValue('Test'),
  within(instance).findByPlaceholderText('Test'),
  within(instance).findByTestId('Test'),
  within(instance).findByA11yLabel('Test'),
  within(instance).findByLabelText('Test'),
  within(instance).findByA11yHint('Test'),
  within(instance).findByHintText('Test'),
  within(instance).findByA11yRole('button'),
  within(instance).findByRole('button'),
  within(instance).findByA11yState({ busy: true }),
  within(instance).findByA11yValue({ min: 10 }),
  getQueriesForElement(instance).findByText('Test'),
  getQueriesForElement(instance).findByDisplayValue('Test'),
  getQueriesForElement(instance).findByPlaceholderText('Test'),
  getQueriesForElement(instance).findByTestId('Test'),
  getQueriesForElement(instance).findByA11yLabel('Test'),
  getQueriesForElement(instance).findByLabelText('Test'),
  getQueriesForElement(instance).findByA11yHint('Test'),
  getQueriesForElement(instance).findByHintText('Test'),
  getQueriesForElement(instance).findByA11yRole('button'),
  getQueriesForElement(instance).findByRole('button'),
  getQueriesForElement(instance).findByA11yState({ busy: true }),
  getQueriesForElement(instance).findByA11yValue({ min: 10 }),
];

const withinFindAll: Promise<ReactTestInstance[]>[] = [
  within(instance).findAllByText('Test'),
  within(instance).findAllByDisplayValue('Test'),
  within(instance).findAllByPlaceholderText('Test'),
  within(instance).findAllByTestId('Test'),
  within(instance).findAllByA11yLabel('Test'),
  within(instance).findAllByLabelText('Test'),
  within(instance).findAllByA11yHint('Test'),
  within(instance).findAllByHintText('Test'),
  within(instance).findAllByA11yRole('button'),
  within(instance).findAllByRole('button'),
  within(instance).findAllByA11yState({ busy: true }),
  within(instance).findAllByA11yValue({ min: 10 }),
  getQueriesForElement(instance).findAllByText('Test'),
  getQueriesForElement(instance).findAllByDisplayValue('Test'),
  getQueriesForElement(instance).findAllByPlaceholderText('Test'),
  getQueriesForElement(instance).findAllByTestId('Test'),
  getQueriesForElement(instance).findAllByA11yLabel('Test'),
  getQueriesForElement(instance).findAllByLabelText('Test'),
  getQueriesForElement(instance).findAllByA11yHint('Test'),
  getQueriesForElement(instance).findAllByHintText('Test'),
  getQueriesForElement(instance).findAllByA11yRole('button'),
  getQueriesForElement(instance).findAllByRole('button'),
  getQueriesForElement(instance).findAllByA11yState({ busy: true }),
  getQueriesForElement(instance).findAllByA11yValue({ min: 10 }),
];

// TextMatch
const normalizer = getDefaultNormalizer({
  trim: false,
  collapseWhitespace: true,
});
tree.getByText('text', { exact: false, normalizer });
tree.getByPlaceholderText('text', { exact: false, normalizer });
tree.getByDisplayValue('text', { exact: true, normalizer });
tree.getByTestId('text', { exact: false, normalizer });
