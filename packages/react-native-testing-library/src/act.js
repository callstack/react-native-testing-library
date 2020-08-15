// @flow
import { act } from 'react-test-renderer';

const actMock = (callback: () => void) => {
  callback();
};

export default act || actMock;
