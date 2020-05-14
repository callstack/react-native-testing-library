/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { ReactTestInstance } from 'react-test-renderer';
import {
  render,
  fireEvent,
  shallow,
  flushMicrotasksQueue,
  debug,
  waitForElement,
  act,
  within,
} from '../..';

interface HasRequiredProp {
  requiredProp: string;
}

const View = props => props.children;
const Text = props => props.children;
const TextInput = props => props.children;
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
const getByNameString: ReactTestInstance = tree.getByName('View');
const getByNameContructor: ReactTestInstance = tree.getByName(View);
const getByType: ReactTestInstance = tree.getByType(View);
const getByTypeWithRequiredProps: ReactTestInstance = tree.getByType(
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
const getByProps: ReactTestInstance = tree.getByProps({ value: 2 });
const getByTestId: ReactTestInstance = tree.getByTestId('test-id');
const getAllByTestId: ReactTestInstance[] = tree.getAllByTestId('test-id');
const getAllByNameString: Array<ReactTestInstance> = tree.getAllByName('View');
const getAllByNameConstructor: Array<ReactTestInstance> = tree.getAllByName(
  View
);
const getAllByType: Array<ReactTestInstance> = tree.getAllByType(View);
const getAllByTypeWithRequiredProps: Array<
  ReactTestInstance
> = tree.getAllByType(ElementWithRequiredProps);
const getAllByTextString: Array<ReactTestInstance> = tree.getAllByText(
  '<View />'
);
const getAllByTextRegExp: Array<ReactTestInstance> = tree.getAllByText(/Text/g);
const getAllByProps: Array<ReactTestInstance> = tree.getAllByProps({
  value: 2,
});

// queuryByAPI tests
const queryByNameString: ReactTestInstance | null = tree.queryByName('View');
const queryByNameConstructor: ReactTestInstance | null = tree.queryByName(View);
const queryByType: ReactTestInstance | null = tree.queryByType(View);
const queryByTypeWithRequiredProps: ReactTestInstance | null = tree.queryByType(
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
const queryByProps: ReactTestInstance | null = tree.queryByProps({ value: 2 });
const queryByTestId: ReactTestInstance | null = tree.queryByTestId('test-id');
const queryAllByTestId: ReactTestInstance[] | null = tree.queryAllByTestId(
  'test-id'
);
const queryAllByNameString: Array<ReactTestInstance> = tree.queryAllByName(
  'View'
);
const queryAllByNameConstructor: Array<ReactTestInstance> = tree.queryAllByName(
  View
);
const queryAllByType: Array<ReactTestInstance> = tree.queryAllByType(View);
const queryAllByTypeWithRequiredProps: Array<
  ReactTestInstance
> = tree.queryAllByType(ElementWithRequiredProps);
const queryAllByTextString: Array<ReactTestInstance> = tree.queryAllByText(
  'View'
);
const queryAllByTextRegExp: Array<ReactTestInstance> = tree.queryAllByText(
  /View/g
);
const queryAllByDisplayValueString: Array<
  ReactTestInstance
> = tree.queryAllByDisplayValue('View');
const queryAllByDisplayValueRegExp: Array<
  ReactTestInstance
> = tree.queryAllByDisplayValue(/View/g);

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
const getByA11yStatesArray: ReactTestInstance = tree.getByA11yStates(['selected']);
const getAllByA11yStates: Array<ReactTestInstance> = tree.getAllByA11yStates(
  'selected'
);
const getAllByA11yStatesArray: Array<
  ReactTestInstance
> = tree.getAllByA11yStates(['selected']);
const queryByA11yStates: ReactTestInstance = tree.queryByA11yStates('selected');
const queryByA11yStatesArray: ReactTestInstance = tree.queryByA11yStates([
  'selected',
]);
const queryAllByA11yStates: Array<
  ReactTestInstance
> = tree.queryAllByA11yStates('selected');
const queryAllByA11yStatesArray: Array<
  ReactTestInstance
> = tree.queryAllByA11yStates(['selected']);

const getByA11yState: ReactTestInstance = tree.getByA11yState({ busy: true });
const getAllByA11yState: Array<ReactTestInstance> = tree.getAllByA11yState({ busy: true });
const queryByA11yState: ReactTestInstance = tree.queryByA11yState({ busy: true });
const queryAllByA11yState: Array<ReactTestInstance> = tree.queryAllByA11yState({ busy: true });

const getByA11yValue: ReactTestInstance = tree.getByA11yValue({ min: 10 });
const getAllByA11yValue: Array<ReactTestInstance> = tree.getAllByA11yValue({ min: 10 });
const queryByA11yValue: ReactTestInstance = tree.queryByA11yValue({ min: 10 });
const queryAllByA11yValue: Array<ReactTestInstance> = tree.queryAllByA11yValue({ min: 10 });

const debugFn = tree.debug();
const debugFnWithMessage = tree.debug('my message');

tree.update(<View />);
tree.rerender(<View />);
tree.unmount();

// fireEvent API tests
fireEvent(getByNameString, 'press');
fireEvent(getByNameString, 'press', 'data');
fireEvent(getByNameString, 'press', 'param1', 'param2');
fireEvent.press(getByNameString);
fireEvent.changeText(getByNameString, 'string');
fireEvent.scroll(getByNameString, 'eventData');

// shallow API
const shallowTree: { output: React.ReactElement<any> } = shallow(
  <TestComponent />
);

const waitForFlush: Promise<any> = flushMicrotasksQueue();

// debug API
debug(<TestComponent />);
debug(<TestComponent />, 'message');
debug(getByNameString);
debug(getByNameString, 'message');
debug.shallow(<TestComponent />);
debug.shallow(<TestComponent />, 'message');
debug.deep(<TestComponent />);
debug.deep(<TestComponent />, 'message');
debug.deep(tree.toJSON());

const waitBy: Promise<ReactTestInstance> = waitForElement<ReactTestInstance>(
  () => tree.getByName('View')
);
const waitByAll: Promise<Array<ReactTestInstance>> = waitForElement<
  Array<ReactTestInstance>
>(() => tree.getAllByName('View'), 1000, 50);

act(() => {
  render(<TestComponent />);
});

// within API
const instance: ReactTestInstance = tree.getByText('<View />');
const withinGetByText: ReactTestInstance = within(instance).getByText('Test');
const withinGetAllByText: ReactTestInstance[] = within(instance).getAllByText(
  'Test'
);
const withinGetByDisplayValue: ReactTestInstance = within(
  instance
).getByDisplayValue('Test');
const withinGetAllByDisplayValue: ReactTestInstance[] = within(
  instance
).getAllByDisplayValue('Test');
const withinGetByPlaceholder: ReactTestInstance = within(
  instance
).getByPlaceholder('Test');
const withinGetAllByPlaceholder: ReactTestInstance[] = within(
  instance
).getAllByPlaceholder('Test');
const withinGetByTestId: ReactTestInstance = within(instance).getByTestId(
  'Test'
);
const withinGetAllByTestId: ReactTestInstance[] = within(
  instance
).getAllByTestId('Test');

const withinQueryByText: ReactTestInstance | null = within(
  instance
).queryByText('Test');
const withinQueryAllByText: ReactTestInstance[] = within(
  instance
).queryAllByText('Test');
const withinQueryByDisplayValue: ReactTestInstance | null = within(
  instance
).queryByDisplayValue('Test');
const withinQueryAllByDisplayValue: ReactTestInstance[] = within(
  instance
).queryAllByDisplayValue('Test');
const withinQueryByPlaceholder: ReactTestInstance | null = within(
  instance
).queryByPlaceholder('Test');
const withinQueryAllByPlaceholder: ReactTestInstance[] = within(
  instance
).queryAllByPlaceholder('Test');
const withinQueryByTestId: ReactTestInstance | null = within(
  instance
).queryByTestId('Test');
const withinQueryAllByTestId: ReactTestInstance[] = within(
  instance
).queryAllByTestId('Test');

const withinGetByA11yLabel: ReactTestInstance = within(instance).getByA11yLabel(
  'Test'
);
const withinGetAllByA11yLabel: ReactTestInstance[] = within(
  instance
).getAllByA11yLabel('Test');
const withinGetByA11yHint: ReactTestInstance = within(instance).getByA11yHint(
  'Test'
);
const withinGetAllByA11yHint: ReactTestInstance[] = within(
  instance
).getAllByA11yHint('Test');
const withinGetByA11yRole: ReactTestInstance = within(instance).getByA11yRole(
  'button'
);
const withinGetAllByA11yRole: ReactTestInstance[] = within(
  instance
).getAllByA11yRole('button');
const withinGetByA11yState: ReactTestInstance = within(
  instance
).getByA11yState({ busy: true });
const withinGetAllByA11yState: ReactTestInstance[] = within(
  instance
).getAllByA11yState({ busy: true });
const withinGetByA11yValue: ReactTestInstance = within(
  instance
).getByA11yValue({ min: 10 });
const withinGetAllByA11yValue: ReactTestInstance[] = within(
  instance
).getAllByA11yValue({ min: 10 });

const withinQueryByA11yLabel: ReactTestInstance | null = within(
  instance
).queryByA11yLabel('Test');
const withinQueryAllByA11yLabel: ReactTestInstance[] = within(
  instance
).queryAllByA11yLabel('Test');
const withinQueryByA11yHint: ReactTestInstance | null = within(
  instance
).queryByA11yHint('Test');
const withinQueryAllByA11yHint: ReactTestInstance[] = within(
  instance
).queryAllByA11yHint('Test');
const withinQueryByA11yRole: ReactTestInstance | null = within(
  instance
).queryByA11yRole('button');
const withinQueryAllByA11yRole: ReactTestInstance[] = within(
  instance
).queryAllByA11yRole('button');
const withinQueryByA11yState: ReactTestInstance | null = within(
  instance
).queryByA11yState({ busy: true });
const withinQueryAllByA11yState: ReactTestInstance[] = within(
  instance
).queryAllByA11yState({ busy: true });
const withinQueryByA11yValue: ReactTestInstance | null = within(
  instance
).queryByA11yValue({ min: 10 });
const withinQueryAllByA11yValue: ReactTestInstance[] = within(
  instance
).queryAllByA11yValue({ min: 10 });
