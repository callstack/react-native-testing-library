import * as React from 'react';
import { render } from '@testing-library/react-native';
import { createStore } from 'zustand';
import { TasksState, tasksStoreCreator, TasksStoreProvider } from './state';

export interface RenderWithState {
  initialState?: Partial<TasksState>;
}

/**
 * Renders a React component with Zustand state for testing purposes.
 *
 * @param component - The React component to render.
 * @param options - The render options including the initial state.
 * @returns The render result from `@testing-library/react-native`.
 */
export const renderWithState = (component: React.ReactElement, options?: RenderWithState) => {
  const store = createStore(tasksStoreCreator);
  if (options?.initialState) {
    store.setState(options.initialState);
  }

  return render(<TasksStoreProvider store={store}>{component}</TasksStoreProvider>);
};
