import { ReactTestInstance } from 'react-test-renderer';
import { setup } from './setup';
import { PressOptions } from './press';
import { TypeOptions } from './type';

export const userEvent = {
  setup,

  // Direct access for User Event v13 compatibility
  press: (element: ReactTestInstance) => setup().press(element),
  longPress: (element: ReactTestInstance, options?: PressOptions) =>
    setup().longPress(element, options),
  type: (element: ReactTestInstance, text: string, options?: TypeOptions) =>
    setup().type(element, text, options),
};
