// @flow
import { act } from 'react-test-renderer';
import type { Thenable } from './types.flow';

const actMock = (callback: () => void) => {
  callback();
};

export default (act || actMock: (callback: () => void) => Thenable);
