import type { TestInstance } from 'test-renderer';

import type { PressOptions } from './press';
import type { ScrollToOptions } from './scroll';
import { setup } from './setup';
import type { TypeOptions } from './type';

export { UserEventConfig } from './setup';

export const userEvent = {
  setup,

  // Direct access for User Event v13 compatibility
  press: (instance: TestInstance) => setup().press(instance),
  longPress: (instance: TestInstance, options?: PressOptions) =>
    setup().longPress(instance, options),
  type: (instance: TestInstance, text: string, options?: TypeOptions) =>
    setup().type(instance, text, options),
  clear: (instance: TestInstance) => setup().clear(instance),
  paste: (instance: TestInstance, text: string) => setup().paste(instance, text),
  scrollTo: (instance: TestInstance, options: ScrollToOptions) =>
    setup().scrollTo(instance, options),
};
