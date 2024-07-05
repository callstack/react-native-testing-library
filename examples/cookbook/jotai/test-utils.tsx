import * as React from 'react';
import {render} from '@testing-library/react-native';
import {useHydrateAtoms} from "jotai/utils";
import {IHydrateAtomsProps, InitialValues, IRenderWithAtomsOptions} from "./types";

function HydrateAtomsWrapper<T>({
                                initialValues,
                                children,
                              }: IHydrateAtomsProps<T>) {
  useHydrateAtoms(initialValues as unknown as InitialValues);
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
  options: IRenderWithAtomsOptions<T>,
) => {
  const {initialValues} = options;
  return render(component, {
    wrapper: ({children}: { children: React.JSX.Element }) => (
      <HydrateAtomsWrapper initialValues={initialValues}>
        {children}
      </HydrateAtomsWrapper>
    ),
    ...options,
  });
};
