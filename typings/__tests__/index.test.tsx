import * as React from 'react';
import { ReactTestInstance } from 'react-test-renderer';
import { render, fireEvent, shallow, flushMicrotasksQueue, debug } from '../..';

const View = props => props.children;
const Text = props => props.children;

const TestComponent = () => (
  <View>
    <Text>Test component</Text>
  </View>
);

const tree = render(<TestComponent />);

// getByAPI tests
const getByNameString: ReactTestInstance = tree.getByName('View');
const getByNameContructor: ReactTestInstance = tree.getByName(View);
const getByTextString: ReactTestInstance = tree.getByText('<View />');
const getByTextRegExp: ReactTestInstance = tree.getByText(/View/g);
const getByProps: ReactTestInstance = tree.getByProps({ value: 2 });
const getByTestId: ReactTestInstance = tree.getByTestId('test-id');
const getAllByNameString: Array<ReactTestInstance> = tree.getAllByName('View');
const getAllByNameConstructor: Array<ReactTestInstance> = tree.getAllByName(
  View
);
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
const queryByTextString: ReactTestInstance | null = tree.queryByText(
  '<View />'
);
const queryByTextRegExp: ReactTestInstance | null = tree.queryByText(/View/g);
const queryByProps: ReactTestInstance | null = tree.queryByProps({ value: 2 });
const queryByTestId: ReactTestInstance | null = tree.queryByTestId('test-id');
const queryAllByNameString: Array<ReactTestInstance> = tree.getAllByName(
  'View'
);
const queryAllByNameConstructor: Array<ReactTestInstance> = tree.getAllByName(
  View
);
const queryAllByTextString: Array<ReactTestInstance> = tree.queryAllByText(
  'View'
);
const queryAllByTextRegExp: Array<ReactTestInstance> = tree.queryAllByText(
  /View/g
);
const queryAllByProps: Array<ReactTestInstance> = tree.getAllByProps({
  value: 2,
});

tree.update(<View />);
tree.unmount();

// fireEvent API tests
fireEvent(getByNameString, 'press');
fireEvent(getByNameString, 'press', 'data');
fireEvent.press(getByNameString);
fireEvent.doublePress(getByNameString);
fireEvent.changeText(getByNameString, 'string');
fireEvent.scroll(getByNameString, 'eventData');

// shallow API
const shallowTree: { output: React.ReactElement<any> } = shallow(
  <TestComponent />
);

const waitForFlush: Promise<any> = flushMicrotasksQueue();

debug(<TestComponent />);
debug(getByNameString);
