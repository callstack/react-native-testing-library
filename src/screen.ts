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
  get root(): ReactTestInstance {
    throw new Error(SCREEN_ERROR);
  },
  get UNSAFE_root(): ReactTestInstance {
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
  getByHintText: notImplemented,
  getAllByHintText: notImplemented,
  queryByHintText: notImplemented,
  queryAllByHintText: notImplemented,
  findByHintText: notImplemented,
  findAllByHintText: notImplemented,
  getByA11yHint: notImplemented,
  getAllByA11yHint: notImplemented,
  queryByA11yHint: notImplemented,
  queryAllByA11yHint: notImplemented,
  findByA11yHint: notImplemented,
  findAllByA11yHint: notImplemented,
  getByAccessibilityHint: notImplemented,
  getAllByAccessibilityHint: notImplemented,
  queryByAccessibilityHint: notImplemented,
  queryAllByAccessibilityHint: notImplemented,
  findByAccessibilityHint: notImplemented,
  findAllByAccessibilityHint: notImplemented,
  getByRole: notImplemented,
  getAllByRole: notImplemented,
  queryByRole: notImplemented,
  queryAllByRole: notImplemented,
  findByRole: notImplemented,
  findAllByRole: notImplemented,
  getByA11yState: notImplemented,
  getAllByA11yState: notImplemented,
  queryByA11yState: notImplemented,
  queryAllByA11yState: notImplemented,
  findByA11yState: notImplemented,
  findAllByA11yState: notImplemented,
  getByAccessibilityState: notImplemented,
  getAllByAccessibilityState: notImplemented,
  queryByAccessibilityState: notImplemented,
  queryAllByAccessibilityState: notImplemented,
  findByAccessibilityState: notImplemented,
  findAllByAccessibilityState: notImplemented,
  getByA11yValue: notImplemented,
  getAllByA11yValue: notImplemented,
  queryByA11yValue: notImplemented,
  queryAllByA11yValue: notImplemented,
  findByA11yValue: notImplemented,
  findAllByA11yValue: notImplemented,
  getByAccessibilityValue: notImplemented,
  getAllByAccessibilityValue: notImplemented,
  queryByAccessibilityValue: notImplemented,
  queryAllByAccessibilityValue: notImplemented,
  findByAccessibilityValue: notImplemented,
  findAllByAccessibilityValue: notImplemented,
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
