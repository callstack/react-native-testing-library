/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react-native';
import configureStore from './store';

export function renderWithRedux(ui, options) {
  const store = options?.store ?? configureStore(options?.initialState);
  const queries = render(<Provider store={store}>{ui}</Provider>);
  return { ...queries, store };
}
