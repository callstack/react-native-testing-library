import { HostElement } from '../renderer/host-element';
import { setup } from './setup';
import { PressOptions } from './press';
import { TypeOptions } from './type';
import { ScrollToOptions } from './scroll';

export { UserEventConfig } from './setup';

export const userEvent = {
  setup,

  // Direct access for User Event v13 compatibility
  press: (element: HostElement) => setup().press(element),
  longPress: (element: HostElement, options?: PressOptions) => setup().longPress(element, options),
  type: (element: HostElement, text: string, options?: TypeOptions) =>
    setup().type(element, text, options),
  clear: (element: HostElement) => setup().clear(element),
  paste: (element: HostElement, text: string) => setup().paste(element, text),
  scrollTo: (element: HostElement, options: ScrollToOptions) => setup().scrollTo(element, options),
};
