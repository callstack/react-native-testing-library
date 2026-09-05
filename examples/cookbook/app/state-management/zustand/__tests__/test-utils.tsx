import { render } from '@testing-library/react-native';
import * as React from 'react';

import { useTaskStore } from '../state';
import { Task } from '../types';

export type TaskStoreInitialState = {
  tasks?: Task[];
  newTaskTitle?: string;
};

export interface RenderWithStoreOptions {
  initialState?: TaskStoreInitialState;
}

/**
 * Renders a React component with a Zustand store hydrated for testing.
 *
 * Resets the store before each render so tests stay isolated, then optionally
 * applies `initialState` via `setState`.
 */
export async function renderWithStore(
  component: React.ReactElement,
  options: RenderWithStoreOptions = {},
) {
  useTaskStore.getState().reset();

  if (options.initialState) {
    useTaskStore.setState(options.initialState);
  }

  return await render(component);
}
