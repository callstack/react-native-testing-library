import * as React from 'react';
import { render } from '@testing-library/react-native';
import { TasksState } from './state';

export interface RenderWithState {
  initialState: Partial<TasksState>;
}

/**
 * Renders a React component with Jotai atoms for testing purposes.
 *
 * @param component - The React component to render.
 * @param options - The render options including the initial atom values.
 * @returns The render result from `@testing-library/react-native`.
 */
export const renderWithState = <T,>(component: React.ReactElement, options: RenderWithState) => {
  return render(
    <HydrateAtomsWrapper initialValues={options.initialValues}>{component}</HydrateAtomsWrapper>,
  );
};
