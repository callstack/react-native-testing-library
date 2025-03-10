import type { HostElement } from 'universal-test-renderer';

import type { RenderResult } from './render';

const SCREEN_ERROR = '`render` method has not been called';

const notImplemented = () => {
  throw new Error(SCREEN_ERROR);
};

const notImplementedDebug = () => {
  throw new Error(SCREEN_ERROR);
};

interface Screen extends RenderResult {
  isDetached?: boolean;
}

const defaultScreen: Screen = {
  isDetached: true,
  get root(): HostElement | null {
    throw new Error(SCREEN_ERROR);
  },
  get container(): HostElement {
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

export let screen: Screen = defaultScreen;

export function setRenderResult(renderResult: RenderResult) {
  screen = renderResult;
}

export function clearRenderResult() {
  screen = defaultScreen;
}
