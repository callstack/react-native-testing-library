// @flow
import format from './format';

/**
 * Log pretty-printed deep test component instance
 */
export default function debugDeep(
  instance: ?ReactTestRendererJSON,
  message?: any = ''
) {
  if (message) {
    console.log(`${message}\n\n`, format(instance));
  } else {
    console.log(format(instance));
  }
}
