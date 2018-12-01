import * as React from 'react';
import { ReactTestInstance } from 'react-test-renderer';
import {
  render,
  fireEvent,
  shallow,
  flushMicrotasksQueue,
  debug,
  waitForElement,
} from '../..';

interface HasRequiredProp {
  requiredProp: string;
}

const View = props => props.children;
const Text = props => props.children;
const ElementWithRequiredProps = (props: HasRequiredProp) => (
  <Text>{props.requiredProp}</Text>
);

const TestComponent = () => (
  <View>
    <Text>Test component</Text>
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
const getByProps: ReactTestInstance = tree.getByProps({ value: 2 });
const getByTestId: ReactTestInstance = tree.getByTestId('test-id');
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
const queryAllByType: Array<ReactTestInstance> = tree.getAllByType(View);
const queryAllByTypeWithRequiredProps: Array<
  ReactTestInstance
> = tree.getAllByType(ElementWithRequiredProps);
const queryAllByTextString: Array<ReactTestInstance> = tree.queryAllByText(
  'View'
);
const queryAllByTextRegExp: Array<ReactTestInstance> = tree.queryAllByText(
  /View/g
);
const queryAllByProps: Array<ReactTestInstance> = tree.getAllByProps({
  value: 2,
});
const debugFn = tree.debug();
const debugFnWithMessage = tree.debug('my message');

tree.update(<View />);
tree.unmount();

// fireEvent API tests
fireEvent(getByNameString, 'press');
fireEvent(getByNameString, 'press', 'data');
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
