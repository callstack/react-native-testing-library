import { HostComponent } from 'universal-test-renderer';
import { setup } from './setup';
import { PressOptions } from './press';
import { TypeOptions } from './type';
import { ScrollToOptions } from './scroll';

export { UserEventConfig } from './setup';

export const userEvent = {
  setup,

  // Direct access for User Event v13 compatibility
  press: (element: HostComponent) => setup().press(element),
  longPress: (element: HostComponent, options?: PressOptions) =>
    setup().longPress(element, options),
  type: (element: HostComponent, text: string, options?: TypeOptions) =>
    setup().type(element, text, options),
  clear: (element: HostComponent) => setup().clear(element),
  paste: (element: HostComponent, text: string) => setup().paste(element, text),
  scrollTo: (element: HostComponent, options: ScrollToOptions) =>
    setup().scrollTo(element, options),
};
