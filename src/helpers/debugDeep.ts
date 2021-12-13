import type { ReactTestRendererJSON } from 'react-test-renderer';
import format from './format';

/**
 * Log pretty-printed deep test component instance
 */
export default function debugDeep(
  instance: ReactTestRendererJSON | ReactTestRendererJSON[],
  message?: string
) {
  if (message) {
    // eslint-disable-next-line no-console
    console.log(`${message}\n\n`, format(instance));
  } else {
    // eslint-disable-next-line no-console
    console.log(format(instance));
  }
}
