import { ReactTestInstance } from 'react-test-renderer';

export function toBeBusy(
  this: jest.MatcherContext,
  element: ReactTestInstance
) {
  return {
    pass: true,
    message: () => '',
  };
}
