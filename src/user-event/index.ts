import type { TestInstance } from 'test-renderer';

import type { PressOptions } from './press';
import type { ScrollToOptions } from './scroll';
import { setup } from './setup';
import type { TypeOptions } from './type';

export { UserEventConfig } from './setup';

export const userEvent = {
  setup,

  // Direct access for User Event v13 compatibility
  press: (element: TestInstance) => setup().press(element),
  longPress: (element: TestInstance, options?: PressOptions) => setup().longPress(element, options),
  type: (element: TestInstance, text: string, options?: TypeOptions) =>
    setup().type(element, text, options),
  clear: (element: TestInstance) => setup().clear(element),
  paste: (element: TestInstance, text: string) => setup().paste(element, text),
  scrollTo: (element: TestInstance, options: ScrollToOptions) => setup().scrollTo(element, options),
};
