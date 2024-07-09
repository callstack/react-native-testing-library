import { PropsWithChildren } from 'react';

import { PrimitiveAtom } from 'jotai/vanilla/atom';
import { RenderOptions } from '@testing-library/react-native';

//  We define WithInitialValue, InitialValue and InitialValuesProps types
//  to help us define the initial values type props that we will pass to the
//  renderWithAtoms function and the HydrateAtomsWrapper component.
type WithInitialValue<Value> = {
  init: Value;
};
export type InitialValue<Value> = [PrimitiveAtom<Value> & WithInitialValue<Value>, Value];

export interface InitialValuesProps<T> {
  initialValues: Array<InitialValue<T>>;
}

export type HydrateAtomsWrapperProps<T> = PropsWithChildren<InitialValuesProps<T>>;

export interface RenderWithAtomsOptions<T> extends InitialValuesProps<T>, RenderOptions {}

export type TodoItem = {
  id: string;
  text: string;
};
