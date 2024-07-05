import * as React from 'react';
import {Suspense} from 'react';
import {render} from '@testing-library/react-native';
import {ActivityIndicator} from "react-native";
import {useHydrateAtoms} from "jotai/utils";
import {IHydrateAtomsProps, InitialValue, InitialValues, IRenderWithAtomsOptions} from "./types";
import {Provider} from "jotai";

const HydrateAtoms = <T, >({initialValues, children}: IHydrateAtomsProps<T>) => {
  useHydrateAtoms(initialValues as unknown as InitialValues);
  return children;
};

export default function JotaiTestProvider<T>({
                                               initialValues,
                                               children,
                                             }: IHydrateAtomsProps<T>) {
  return (
    <Provider>
      <Suspense fallback={<ActivityIndicator/>}>
        <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
      </Suspense>
    </Provider>
  );
}

const getWrapper =
  <T, >(initialValues: Array<InitialValue<T>>) =>
    ({children}: { children: React.JSX.Element }) => (
      <JotaiTestProvider initialValues={initialValues}>
        {children}
      </JotaiTestProvider>
    );

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
    wrapper: getWrapper(initialValues),
    ...options,
  });
};
