import { ReactTestInstance } from 'react-test-renderer';
import { setup } from './setup';

export const userEvent = {
  setup,

  // Direct access for User Event v13 compatibility
  press: (element: ReactTestInstance) => setup().press(element),
  type: (element: ReactTestInstance, text: string) =>
    setup().type(element, text),
};
