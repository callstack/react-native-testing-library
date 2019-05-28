/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { ReactTestInstance } from 'react-test-renderer';
import {
  render,
  fireEvent,
  flushMicrotasksQueue,
  debug,
  waitForElement,
  act,
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
const getByTextString: ReactTestInstance = tree.getByText('<View />');
const getByTextRegExp: ReactTestInstance = tree.getByText(/View/g);
const getByPlaceholderString: ReactTestInstance = tree.getByPlaceholder(
  'my placeholder'
);
const getByPlaceholderRegExp: ReactTestInstance = tree.getByPlaceholder(
  /placeholder/g
);
const getByTestId: ReactTestInstance = tree.getByTestId('test-id');
const getAllByTextString: Array<ReactTestInstance> = tree.getAllByText(
  '<View />'
);
const getAllByTextRegExp: Array<ReactTestInstance> = tree.getAllByText(/Text/g);

// queuryByAPI tests
const queryByTextString: ReactTestInstance | null = tree.queryByText(
  '<View />'
);
const queryByTextRegExp: ReactTestInstance | null = tree.queryByText(/View/g);
const queryByPlaceholderString: ReactTestInstance | null = tree.queryByText(
  'my placeholder'
);
const queryByPlaceholderRegExp: ReactTestInstance | null = tree.queryByText(
  /placeholder/g
);
const queryByTestId: ReactTestInstance | null = tree.queryByTestId('test-id');
const queryAllByTextString: Array<ReactTestInstance> = tree.queryAllByText(
  'View'
);
const queryAllByTextRegExp: Array<ReactTestInstance> = tree.queryAllByText(
  /View/g
);

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
const getByA11yRole: ReactTestInstance = tree.getByA11yRole('label');
const getAllByA11yRole: Array<ReactTestInstance> = tree.getAllByA11yRole(
  'label'
);
const queryByA11yRole: ReactTestInstance = tree.queryByA11yRole('label');
const queryAllByA11yRole: Array<ReactTestInstance> = tree.queryAllByA11yRole(
  'label'
);
const getByA11yStates: ReactTestInstance = tree.getByA11yStates('label');
const getByA11yStatesArray: ReactTestInstance = tree.getByA11yStates(['label']);
const getAllByA11yStates: Array<ReactTestInstance> = tree.getAllByA11yStates(
  'label'
);
const getAllByA11yStatesArray: Array<
  ReactTestInstance
> = tree.getAllByA11yStates(['label']);
const queryByA11yStates: ReactTestInstance = tree.queryByA11yStates('label');
const queryByA11yStatesArray: ReactTestInstance = tree.queryByA11yStates([
  'label',
]);
const queryAllByA11yStates: Array<
  ReactTestInstance
> = tree.queryAllByA11yStates('label');
const queryAllByA11yStatesArray: Array<
  ReactTestInstance
> = tree.queryAllByA11yStates(['label']);

const debugFn = tree.debug();
const debugFnWithMessage = tree.debug('my message');

tree.update(<View />);
tree.rerender(<View />);
tree.unmount();

// fireEvent API tests
fireEvent(getByTextString, 'press');
fireEvent(getByTextString, 'press', 'data');
fireEvent.press(getByTextString);
fireEvent.changeText(getByTextString, 'string');
fireEvent.scroll(getByTextString, 'eventData');

const waitForFlush: Promise<any> = flushMicrotasksQueue();

// debug API
debug(<TestComponent />);
debug(<TestComponent />, 'message');
debug(getByTextString);
debug(getByTextString, 'message');
debug.shallow(<TestComponent />);
debug.shallow(<TestComponent />, 'message');
debug.deep(<TestComponent />);
debug.deep(<TestComponent />, 'message');
debug.deep(tree.toJSON());

const waitBy: Promise<ReactTestInstance> = waitForElement<ReactTestInstance>(
  () => tree.getByText('View')
);
const waitByAll: Promise<Array<ReactTestInstance>> = waitForElement<
  Array<ReactTestInstance>
>(() => tree.getAllByText('View'), 1000, 50);

act(() => {
  render(<TestComponent />);
});
