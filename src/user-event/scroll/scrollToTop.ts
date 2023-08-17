import { ReactTestInstance } from 'react-test-renderer';
import { isHostScrollView } from '../../helpers/host-component-names';
import { ErrorWithStack } from '../../helpers/errors';
import { EventBuilder } from '../event-builder';
import { dispatchEvent } from '../utils';
import { getElementScrollOffset, setElementScrollOffset } from './state';
import { generateScrollSteps } from './utils';
import { emitDragScrollEvents } from './scrollTo';

export async function scrollToTop(element: ReactTestInstance): Promise<void> {
  if (!isHostScrollView(element)) {
    throw new ErrorWithStack(
      `scrollToTop() works only with host "ScrollView" elements. Passed element has type "${element.type}".`,
      scrollToTop
    );
  }

  const initialPosition = getElementScrollOffset(element);
  const dragSteps = generateScrollSteps({ y: 0, x: 0 }, initialPosition);

  emitDragScrollEvents(element, dragSteps);

  dispatchEvent(
    element,
    'scrollToTop',
    EventBuilder.Scroll.scroll({ y: 0, x: 0 })
  );

  setElementScrollOffset(element, { y: 0, x: 0 });
}
