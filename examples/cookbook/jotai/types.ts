import * as React from 'react';

import { PrimitiveAtom } from 'jotai/vanilla/atom';
import { useHydrateAtoms } from 'jotai/utils';
import { RenderOptions as RntlRenderOptions } from '@testing-library/react-native';

type WithInitialValue<Value> = {
  init: Value;
};
type UseHydrateAtomsParams = Parameters<typeof useHydrateAtoms>;
export type InitialValues = UseHydrateAtomsParams[0];
export type InitialValue<Value> = [PrimitiveAtom<Value> & WithInitialValue<Value>, Value];

export interface IRenderWithAtomsOptions<T> extends RntlRenderOptions {
  initialValues: Array<InitialValue<T>>;
}

export interface IHydrateAtomsProps<T> {
  initialValues: Array<InitialValue<T>>;
  children: React.JSX.Element;
}
