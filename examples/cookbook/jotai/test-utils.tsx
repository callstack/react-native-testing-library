import * as React from 'react';
import { render } from '@testing-library/react-native';
import { useHydrateAtoms } from "jotai/utils";
import { HydrateAtomsWrapperProps, RenderWithAtomsOptions } from "./types";

/**
 * A wrapper component that hydrates Jotai atoms with initial values.
 *
 * @template T - The type of the initial values for the atoms.
 * @param initialValues - The initial values for the Jotai atoms.
 * @param children - The child components to render.
 * @returns The rendered children.

 */
function HydrateAtomsWrapper<T>({
                                  initialValues,
                                  children,
                                }: HydrateAtomsWrapperProps<T>) {
  useHydrateAtoms(initialValues);
  return children;
}

/**
 * Renders a React component with Jotai atoms for testing purposes.
 *
 * @template T - The type of the initial values for the atoms.
 * @param component - The React component to render.
 * @param options - The render options including the initial atom values.
 * @returns The render result from `@testing-library/react-native`.
 */
export const renderWithAtoms = <T, >(
  component: React.ReactElement,
  options: RenderWithAtomsOptions<T>,
) => {
  const {initialValues, ...rest} = options;

  const ui = <HydrateAtomsWrapper initialValues={initialValues}>
    {component}
  </HydrateAtomsWrapper>;

  return render(ui, {...rest});
};
