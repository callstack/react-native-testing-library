import { ReactTestInstance } from 'react-test-renderer';
import { RenderResult } from './render';

const SCREEN_ERROR = '`render` method has not been called';

const notImplemented = () => {
  throw new Error(SCREEN_ERROR);
};

const notImplementedDebug = () => {
  throw new Error(SCREEN_ERROR);
};
notImplementedDebug.shallow = notImplemented;

const defaultScreen: RenderResult = {
  get container(): ReactTestInstance {
    throw new Error(SCREEN_ERROR);
  },
  debug: notImplementedDebug,
  update: notImplemented,
  unmount: notImplemented,
  rerender: notImplemented,
  toJSON: notImplemented,
  getByLabelText: notImplemented,
  getAllByLabelText: notImplemented,
  queryByLabelText: notImplemented,
  queryAllByLabelText: notImplemented,
  findByLabelText: notImplemented,
  findAllByLabelText: notImplemented,
  getByA11yHint: notImplemented,
  getByHintText: notImplemented,
  getAllByA11yHint: notImplemented,
  getAllByHintText: notImplemented,
  queryByA11yHint: notImplemented,
  queryByHintText: notImplemented,
  queryAllByA11yHint: notImplemented,
  queryAllByHintText: notImplemented,
  findByA11yHint: notImplemented,
  findByHintText: notImplemented,
  findAllByA11yHint: notImplemented,
  findAllByHintText: notImplemented,
  getByRole: notImplemented,
  getAllByRole: notImplemented,
  queryByRole: notImplemented,
  queryAllByRole: notImplemented,
  findByRole: notImplemented,
  findAllByRole: notImplemented,
  getByA11yStates: notImplemented,
  getAllByA11yStates: notImplemented,
  queryByA11yStates: notImplemented,
  queryAllByA11yStates: notImplemented,
  findByA11yStates: notImplemented,
  findAllByA11yStates: notImplemented,
  getByA11yState: notImplemented,
  getAllByA11yState: notImplemented,
  queryByA11yState: notImplemented,
  queryAllByA11yState: notImplemented,
  findByA11yState: notImplemented,
  findAllByA11yState: notImplemented,
  getByA11yValue: notImplemented,
  getAllByA11yValue: notImplemented,
  queryByA11yValue: notImplemented,
  queryAllByA11yValue: notImplemented,
  findByA11yValue: notImplemented,
  findAllByA11yValue: notImplemented,
  UNSAFE_getByProps: notImplemented,
  UNSAFE_getAllByProps: notImplemented,
  UNSAFE_queryByProps: notImplemented,
  UNSAFE_queryAllByProps: notImplemented,
  UNSAFE_getByType: notImplemented,
  UNSAFE_getAllByType: notImplemented,
  UNSAFE_queryByType: notImplemented,
  UNSAFE_queryAllByType: notImplemented,
  getByPlaceholderText: notImplemented,
  getAllByPlaceholderText: notImplemented,
  queryByPlaceholderText: notImplemented,
  queryAllByPlaceholderText: notImplemented,
  findByPlaceholderText: notImplemented,
  findAllByPlaceholderText: notImplemented,
  getByDisplayValue: notImplemented,
  getAllByDisplayValue: notImplemented,
  queryByDisplayValue: notImplemented,
  queryAllByDisplayValue: notImplemented,
  findByDisplayValue: notImplemented,
  findAllByDisplayValue: notImplemented,
  getByTestId: notImplemented,
  getAllByTestId: notImplemented,
  queryByTestId: notImplemented,
  queryAllByTestId: notImplemented,
  findByTestId: notImplemented,
  findAllByTestId: notImplemented,
  getByText: notImplemented,
  getAllByText: notImplemented,
  queryByText: notImplemented,
  queryAllByText: notImplemented,
  findByText: notImplemented,
  findAllByText: notImplemented,
};

export let screen: RenderResult = defaultScreen;

export function setRenderResult(output: RenderResult) {
  screen = output;
}

export function clearRenderResult() {
  screen = defaultScreen;
}
