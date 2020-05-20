/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { ReactTestInstance } from 'react-test-renderer';
import {
  render,
  fireEvent,
  shallow,
  flushMicrotasksQueue,
  waitFor,
  act,
  within,
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

// getByAPI tests
const getByType: ReactTestInstance = tree.UNSAFE_getByType(View);
const getByTypeWithRequiredProps: ReactTestInstance = tree.UNSAFE_getByType(
  ElementWithRequiredProps
);
const getByTextString: ReactTestInstance = tree.getByText('<View />');
const getByTextRegExp: ReactTestInstance = tree.getByText(/View/g);
const getByPlaceholderString: ReactTestInstance = tree.getByPlaceholder(
  'my placeholder'
);
const getByPlaceholderRegExp: ReactTestInstance = tree.getByPlaceholder(
  /placeholder/g
);
const getByDisplayValueString: ReactTestInstance = tree.getByDisplayValue(
  'my value'
);
const getByDisplayValueRegExp: ReactTestInstance = tree.getByDisplayValue(
  /value/g
);
const getByProps: ReactTestInstance = tree.UNSAFE_getByProps({ value: 2 });
const getByTestId: ReactTestInstance = tree.getByTestId('test-id');
const getAllByTestId: ReactTestInstance[] = tree.getAllByTestId('test-id');
const getAllByType: Array<ReactTestInstance> = tree.UNSAFE_getAllByType(View);
const getAllByTypeWithRequiredProps: Array<ReactTestInstance> = tree.UNSAFE_getAllByType(
  ElementWithRequiredProps
);
const getAllByTextString: Array<ReactTestInstance> = tree.getAllByText(
  '<View />'
);
const getAllByTextRegExp: Array<ReactTestInstance> = tree.getAllByText(/Text/g);
const getAllByProps: Array<ReactTestInstance> = tree.UNSAFE_getAllByProps({
  value: 2,
});

// queuryByAPI tests
const queryByType: ReactTestInstance | null = tree.UNSAFE_queryByType(View);
const queryByTypeWithRequiredProps: ReactTestInstance | null = tree.UNSAFE_queryByType(
  ElementWithRequiredProps
);
const queryByTextString: ReactTestInstance | null = tree.queryByText('View');
const queryByTextRegExp: ReactTestInstance | null = tree.queryByText(/View/g);
const queryByPlaceholderString: ReactTestInstance | null = tree.queryByPlaceholder(
  'my placeholder'
);
const queryByPlaceholderRegExp: ReactTestInstance | null = tree.queryByPlaceholder(
  /placeholder/g
);
const queryByDisplayValueString: ReactTestInstance | null = tree.queryByDisplayValue(
  'my value'
);
const queryByDisplayValueRegExp: ReactTestInstance | null = tree.queryByDisplayValue(
  /value/g
);
const queryByProps: ReactTestInstance | null = tree.UNSAFE_queryByProps({
  value: 2,
});
const queryByTestId: ReactTestInstance | null = tree.queryByTestId('test-id');
const queryAllByTestId: ReactTestInstance[] | null = tree.queryAllByTestId(
  'test-id'
);
const queryAllByType: Array<ReactTestInstance> = tree.UNSAFE_queryAllByType(
  View
);
const queryAllByTypeWithRequiredProps: Array<ReactTestInstance> = tree.UNSAFE_queryAllByType(
  ElementWithRequiredProps
);
const queryAllByTextString: Array<ReactTestInstance> = tree.queryAllByText(
  'View'
);
const queryAllByTextRegExp: Array<ReactTestInstance> = tree.queryAllByText(
  /View/g
);
const queryAllByDisplayValueString: Array<ReactTestInstance> = tree.queryAllByDisplayValue(
  'View'
);
const queryAllByDisplayValueRegExp: Array<ReactTestInstance> = tree.queryAllByDisplayValue(
  /View/g
);

// findBy API tests
const findBy: Promise<ReactTestInstance>[] = [
  tree.findByText('View'),
  tree.findByText('View', { timeout: 10, interval: 10 }),
  tree.findByText(/View/g),
  tree.findByText(/View/g, { timeout: 10, interval: 5 }),
  tree.findByPlaceholder('my placeholder'),
  tree.findByPlaceholder('my placeholder', { timeout: 10, interval: 5 }),
  tree.findByPlaceholder(/placeholder/g),
  tree.findByPlaceholder(/placeholder/g, { timeout: 10, interval: 5 }),
  tree.findByDisplayValue('my value'),
  tree.findByDisplayValue('my value', { timeout: 10, interval: 10 }),
  tree.findByDisplayValue(/value/g),
  tree.findByDisplayValue(/value/g, { timeout: 10, interval: 10 }),
  tree.findByTestId('test-id'),
  tree.findByTestId('test-id', { timeout: 10, interval: 10 }),
  tree.findByA11yLabel('label'),
  tree.findByA11yLabel('label', { timeout: 10, interval: 10 }),
  tree.findByA11yHint('label'),
  tree.findByA11yHint('label', { timeout: 10, interval: 10 }),
  tree.findByA11yRole('button'),
  tree.findByA11yRole('button', { timeout: 10, interval: 10 }),
  tree.findByA11yState({ busy: true }),
  tree.findByA11yState({ busy: true }, { timeout: 10, interval: 10 }),
  tree.findByA11yValue({ min: 10 }),
  tree.findByA11yValue({ min: 10 }, { timeout: 10, interval: 10 }),
];

const findAllBy: Promise<ReactTestInstance[]>[] = [
  tree.findAllByText('View'),
  tree.findAllByText('View', { timeout: 10, interval: 10 }),
  tree.findAllByText(/View/g),
  tree.findAllByText(/View/g, { timeout: 10, interval: 5 }),
  tree.findAllByPlaceholder('my placeholder'),
  tree.findAllByPlaceholder('my placeholder', { timeout: 10, interval: 10 }),
  tree.findAllByPlaceholder(/placeholder/g),
  tree.findAllByPlaceholder(/placeholder/g, { timeout: 10, interval: 10 }),
  tree.findAllByDisplayValue('View'),
  tree.findAllByDisplayValue('View', { timeout: 10, interval: 10 }),
  tree.findAllByDisplayValue(/View/g),
  tree.findAllByDisplayValue(/View/g, { timeout: 10, interval: 10 }),
  tree.findAllByTestId('test-id'),
  tree.findAllByTestId('test-id', { timeout: 10, interval: 10 }),
  tree.findAllByA11yHint('label'),
  tree.findAllByA11yHint('label', { timeout: 10, interval: 10 }),
  tree.findAllByA11yState({ busy: true }),
  tree.findAllByA11yState({ busy: true }, { timeout: 10, interval: 10 }),
  tree.findAllByA11yValue({ min: 10 }),
  tree.findAllByA11yValue({ min: 10 }, { timeout: 10, interval: 10 }),
];

// Accessibility queries
const getByA11yLabel: ReactTestInstance = tree.getByA11yLabel('label');
const getAllByA11yLabel: Array<ReactTestInstance> = tree.getAllByA11yLabel(
  'label'
);
const queryByA11yLabel: ReactTestInstance = tree.queryByA11yLabel('label');
const queryAllByA11yLabel: Array<ReactTestInstance> = tree.queryAllByA11yLabel(
  'label'
);

const getByA11yHint: ReactTestInstance = tree.getByA11yHint('label');
const getAllByA11yHint: Array<ReactTestInstance> = tree.getAllByA11yHint(
  'label'
);
const queryByA11yHint: ReactTestInstance = tree.queryByA11yHint('label');
const queryAllByA11yHint: Array<ReactTestInstance> = tree.queryAllByA11yHint(
  'label'
);

const getByA11yRole: ReactTestInstance = tree.getByA11yRole('button');
const getAllByA11yRole: Array<ReactTestInstance> = tree.getAllByA11yRole(
  'button'
);
const queryByA11yRole: ReactTestInstance = tree.queryByA11yRole('button');
const queryAllByA11yRole: Array<ReactTestInstance> = tree.queryAllByA11yRole(
  'button'
);

const getByA11yStates: ReactTestInstance = tree.getByA11yStates('selected');
const getByA11yStatesArray: ReactTestInstance = tree.getByA11yStates([
  'selected',
]);
const getAllByA11yStates: Array<ReactTestInstance> = tree.getAllByA11yStates(
  'selected'
);
const getAllByA11yStatesArray: Array<ReactTestInstance> = tree.getAllByA11yStates(
  ['selected']
);
const queryByA11yStates: ReactTestInstance = tree.queryByA11yStates('selected');
const queryByA11yStatesArray: ReactTestInstance = tree.queryByA11yStates([
  'selected',
]);
const queryAllByA11yStates: Array<ReactTestInstance> = tree.queryAllByA11yStates(
  'selected'
);
const queryAllByA11yStatesArray: Array<ReactTestInstance> = tree.queryAllByA11yStates(
  ['selected']
);

const getByA11yState: ReactTestInstance = tree.getByA11yState({ busy: true });
const getAllByA11yState: Array<ReactTestInstance> = tree.getAllByA11yState({
  busy: true,
});
const queryByA11yState: ReactTestInstance = tree.queryByA11yState({
  busy: true,
});
const queryAllByA11yState: Array<ReactTestInstance> = tree.queryAllByA11yState({
  busy: true,
});

const getByA11yValue: ReactTestInstance = tree.getByA11yValue({ min: 10 });
const getAllByA11yValue: Array<ReactTestInstance> = tree.getAllByA11yValue({
  min: 10,
});
const queryByA11yValue: ReactTestInstance = tree.queryByA11yValue({ min: 10 });
const queryAllByA11yValue: Array<ReactTestInstance> = tree.queryAllByA11yValue({
  min: 10,
});

const debugFn = tree.debug();
const debugFnWithMessage = tree.debug('my message');

tree.update(<View />);
tree.rerender(<View />);
tree.unmount();

// fireEvent API tests
fireEvent(getByA11yLabel, 'press');
fireEvent(getByA11yLabel, 'press', 'data');
fireEvent(getByA11yLabel, 'press', 'param1', 'param2');
fireEvent.press(getByA11yLabel);
fireEvent.changeText(getByA11yLabel, 'string');
fireEvent.scroll(getByA11yLabel, 'eventData');

// shallow API
const shallowTree: { output: React.ReactElement<any> } = shallow(
  <TestComponent />
);

const waitForFlush: Promise<any> = flushMicrotasksQueue();

const waitBy: Promise<ReactTestInstance> = waitFor<ReactTestInstance>(() =>
  tree.getByA11yLabel('label')
);
const waitByAll: Promise<ReactTestInstance[]> = waitFor<ReactTestInstance[]>(
  () => tree.getAllByA11yLabel('label'),
  { timeout: 1000, interval: 50 }
);

act(() => {
  render(<TestComponent />);
});

// within API
const instance: ReactTestInstance = tree.getByText('<View />');

const withinGet: Array<ReactTestInstance> = [
  within(instance).getByText('Test'),
  within(instance).getByDisplayValue('Test'),
  within(instance).getByPlaceholder('Test'),
  within(instance).getByTestId('Test'),
  within(instance).getByA11yLabel('Test'),
  within(instance).getByA11yHint('Test'),
  within(instance).getByA11yRole('button'),
  within(instance).getByA11yState({ busy: true }),
  within(instance).getByA11yValue({ min: 10 }),
];

const withinGetAll: Array<ReactTestInstance[]> = [
  within(instance).getAllByText('Test'),
  within(instance).getAllByDisplayValue('Test'),
  within(instance).getAllByPlaceholder('Test'),
  within(instance).getAllByTestId('Test'),
  within(instance).getAllByA11yLabel('Test'),
  within(instance).getAllByA11yHint('Test'),
  within(instance).getAllByA11yRole('button'),
  within(instance).getAllByA11yState({ busy: true }),
  within(instance).getAllByA11yValue({ min: 10 }),
];

const withinQuery: Array<ReactTestInstance | null> = [
  within(instance).queryByText('Test'),
  within(instance).queryByDisplayValue('Test'),
  within(instance).queryByPlaceholder('Test'),
  within(instance).queryByTestId('Test'),
  within(instance).queryByA11yLabel('Test'),
  within(instance).queryByA11yHint('Test'),
  within(instance).queryByA11yRole('button'),
  within(instance).queryByA11yState({ busy: true }),
  within(instance).queryByA11yValue({ min: 10 }),
];

const withinQueryAll: Array<ReactTestInstance[]> = [
  within(instance).queryAllByText('Test'),
  within(instance).queryAllByDisplayValue('Test'),
  within(instance).queryAllByPlaceholder('Test'),
  within(instance).queryAllByTestId('Test'),
  within(instance).queryAllByA11yLabel('Test'),
  within(instance).queryAllByA11yHint('Test'),
  within(instance).queryAllByA11yRole('button'),
  within(instance).queryAllByA11yState({ busy: true }),
  within(instance).queryAllByA11yValue({ min: 10 }),
];

const withinFind: Promise<ReactTestInstance>[] = [
  within(instance).findByText('Test'),
  within(instance).findByDisplayValue('Test'),
  within(instance).findByPlaceholder('Test'),
  within(instance).findByTestId('Test'),
  within(instance).findByA11yLabel('Test'),
  within(instance).findByA11yHint('Test'),
  within(instance).findByA11yRole('button'),
  within(instance).findByA11yState({ busy: true }),
  within(instance).findByA11yValue({ min: 10 }),
];

const withinFindAll: Promise<ReactTestInstance[]>[] = [
  within(instance).findAllByText('Test'),
  within(instance).findAllByDisplayValue('Test'),
  within(instance).findAllByPlaceholder('Test'),
  within(instance).findAllByTestId('Test'),
  within(instance).findAllByA11yLabel('Test'),
  within(instance).findAllByA11yHint('Test'),
  within(instance).findAllByA11yRole('button'),
  within(instance).findAllByA11yState({ busy: true }),
  within(instance).findAllByA11yValue({ min: 10 }),
];
