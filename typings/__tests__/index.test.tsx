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
const getByPlaceholderString: ReactTestInstance = tree.getByPlaceholder('my placeholder');
const getByPlaceholderRegExp: ReactTestInstance = tree.getByPlaceholder(/placeholder/g);
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
const queryByPlaceholderRegExp: ReactTestInstance | null = tree.queryByText(/placeholder/g);
const queryByTestId: ReactTestInstance | null = tree.queryByTestId('test-id');
const queryAllByTextString: Array<ReactTestInstance> = tree.queryAllByText(
  'View'
);
const queryAllByTextRegExp: Array<ReactTestInstance> = tree.queryAllByText(
  /View/g
);
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
