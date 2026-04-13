import * as React from 'react';
import { render } from '@testing-library/react-native';
import { useHydrateAtoms } from 'jotai/utils';
import type { WritableAtom } from 'jotai/vanilla';
import { PrimitiveAtom } from 'jotai/vanilla/atom';

// Jotai models hydrated atom values as variadic writable-atom tuples.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWritableAtom = WritableAtom<any, any[], any>;
type InitialValues = readonly (readonly [AnyWritableAtom, ...unknown[]])[];

export type AtomInitialValueTuple<T> = [PrimitiveAtom<T>, T];

export interface RenderWithAtomsOptions<TInitialValues extends InitialValues> {
  initialValues: TInitialValues;
}

/**
 * Renders a React component with Jotai atoms for testing purposes.
 *
 * @param component - The React component to render.
 * @param options - The render options including the initial atom values.
 * @returns The render result from `@testing-library/react-native`.
 */
export const renderWithAtoms = async <TInitialValues extends InitialValues>(
  component: React.ReactElement,
  options: RenderWithAtomsOptions<TInitialValues>,
) => {
  return await render(
    <HydrateAtomsWrapper initialValues={options.initialValues}>{component}</HydrateAtomsWrapper>,
  );
};

export type HydrateAtomsWrapperProps<TInitialValues extends InitialValues> =
  React.PropsWithChildren<{
    initialValues: TInitialValues;
  }>;

/**
 * A wrapper component that hydrates Jotai atoms with initial values.
 *
 * @param initialValues - The initial values for the Jotai atoms.
 * @param children - The child components to render.
 * @returns The rendered children.

 */
function HydrateAtomsWrapper<TInitialValues extends InitialValues>({
  initialValues,
  children,
}: HydrateAtomsWrapperProps<TInitialValues>) {
  useHydrateAtoms(initialValues);
  return children;
}
