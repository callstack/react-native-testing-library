import { ReactTestInstance } from 'react-test-renderer';
import { ContentOffset } from '../event-builder/scroll-view';

const scrollOffsetForElement = new WeakMap<ReactTestInstance, ContentOffset>();

export function getElementScrollOffset(element: ReactTestInstance): ContentOffset {
  return scrollOffsetForElement.get(element) ?? { x: 0, y: 0 };
}

export function setElementScrollOffset(element: ReactTestInstance, scrollState: ContentOffset) {
  scrollOffsetForElement.set(element, scrollState);
}
