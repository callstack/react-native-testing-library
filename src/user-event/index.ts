import { ReactTestInstance } from 'react-test-renderer';
import { setup } from './setup';
import { PressOptions } from './press';
import { TypeOptions } from './type';
import { ScrollOptions } from './scroll';

export { UserEventConfig } from './setup';

export const userEvent = {
  setup,

  // Direct access for User Event v13 compatibility
  press: (element: ReactTestInstance) => setup().press(element),
  longPress: (element: ReactTestInstance, options?: PressOptions) =>
    setup().longPress(element, options),
  type: (element: ReactTestInstance, text: string, options?: TypeOptions) =>
    setup().type(element, text, options),
  clear: (element: ReactTestInstance) => setup().clear(element),
  scroll: (element: ReactTestInstance, options: ScrollOptions) =>
    setup().scroll(element, options),
  scrollToTop: (element: ReactTestInstance) => setup().scrollToTop(element),
};
