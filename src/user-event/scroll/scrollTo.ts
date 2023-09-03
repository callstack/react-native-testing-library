import { ReactTestInstance } from 'react-test-renderer';
import { UserEventInstance } from '../setup';
import { EventBuilder } from '../event-builder';
import { ErrorWithStack } from '../../helpers/errors';
import { isHostScrollView } from '../../helpers/host-component-names';
import { dispatchEvent } from '../utils';
import { ContentOffset } from '../event-builder/scroll';
import { generateScrollSteps } from './utils';
import { getElementScrollOffset, setElementScrollOffset } from './state';

export interface ScrollToOptions {
  y?: number | number[];
  x?: number | number[];
  momentumY?: number | number[];
  momentumX?: number | number[];
}

export async function scrollTo(
  this: UserEventInstance,
  element: ReactTestInstance,
  options: ScrollToOptions
): Promise<void> {
  if (!isHostScrollView(element)) {
    throw new ErrorWithStack(
      `scrollTo() works only with host "ScrollView" elements. Passed element has type "${element.type}".`,
      scrollTo
    );
  }

  const initialPosition = getElementScrollOffset(element);

  const dragTargetPosition = { y: options.y, x: options.x };
  const dragSteps = generateScrollSteps(dragTargetPosition, initialPosition);

  emitDragScrollEvents(element, dragSteps);

  const momentumTargetPosition = { y: options.momentumY, x: options.momentumX };
  const momentumSteps = generateScrollSteps(
    momentumTargetPosition,
    dragSteps.at(-1) ?? initialPosition
  );

  emitMomentumScrollEvents(element, momentumSteps);

  const finalPosition =
    momentumSteps.at(-1) ?? dragSteps.at(-1) ?? initialPosition;

  setElementScrollOffset(element, finalPosition);
}

function emitDragScrollEvents(
  element: ReactTestInstance,
  scrollSteps: ContentOffset[]
) {
  if (scrollSteps.length === 0) {
    return;
  }

  dispatchEvent(
    element,
    'scrollBeginDrag',
    EventBuilder.Scroll.scroll(scrollSteps[0])
  );

  for (let i = 1; i < scrollSteps.length - 1; i++) {
    dispatchEvent(
      element,
      'scroll',
      EventBuilder.Scroll.scroll(scrollSteps[i])
    );
  }

  const lastStep = scrollSteps[scrollSteps.length - 1];
  dispatchEvent(element, 'scrollEndDrag', EventBuilder.Scroll.scroll(lastStep));
}

function emitMomentumScrollEvents(
  element: ReactTestInstance,
  scrollSteps: ContentOffset[]
) {
  if (scrollSteps.length === 0) {
    return;
  }

  dispatchEvent(
    element,
    'momentumScrollBegin',
    EventBuilder.Scroll.scroll(scrollSteps[0])
  );

  for (let i = 1; i < scrollSteps.length - 1; i++) {
    dispatchEvent(
      element,
      'scroll',
      EventBuilder.Scroll.scroll(scrollSteps[i])
    );
  }

  const lastStep = scrollSteps[scrollSteps.length - 1];
  dispatchEvent(
    element,
    'momentumScrollEnd',
    EventBuilder.Scroll.scroll(lastStep)
  );
}
