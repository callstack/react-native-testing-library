import * as React from 'react';
import { render } from '@testing-library/react-native';
import { useHydrateAtoms } from 'jotai/utils';
import { PrimitiveAtom } from 'jotai/vanilla/atom';

// Jotai types are not well exported, so we will make our life easier by using `any`.
export type AtomInitialValueTuple<T> = [PrimitiveAtom<T>, T];

export interface RenderWithAtomsOptions {
  initialValues: AtomInitialValueTuple<any>[];
}

/**
 * Renders a React component with Jotai atoms for testing purposes.
 *
 * @param component - The React component to render.
 * @param options - The render options including the initial atom values.
 * @returns The render result from `@testing-library/react-native`.
 */
export const renderWithAtoms = <T,>(
  component: React.ReactElement,
  options: RenderWithAtomsOptions,
) => {
  return render(
    <HydrateAtomsWrapper initialValues={options.initialValues}>{component}</HydrateAtomsWrapper>,
  );
};

export type HydrateAtomsWrapperProps = React.PropsWithChildren<{
  initialValues: AtomInitialValueTuple<unknown>[];
}>;

/**
 * A wrapper component that hydrates Jotai atoms with initial values.
 *
 * @param initialValues - The initial values for the Jotai atoms.
 * @param children - The child components to render.
 * @returns The rendered children.

 */
function HydrateAtomsWrapper({ initialValues, children }: HydrateAtomsWrapperProps) {
  useHydrateAtoms(initialValues);
  return children;
}
