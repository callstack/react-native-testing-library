import { ReactTestInstance } from 'react-test-renderer';
import { UserEventInstance } from '../setup';
import { EventBuilder } from '../event-builder';
import { ErrorWithStack } from '../../helpers/errors';
import { isHostScrollView } from '../../helpers/host-component-names';
import { dispatchEvent } from '../utils';
import { ContentOffset } from '../event-builder/scroll';
import {
  createScrollSteps,
  inertialInterpolator,
  linearInterpolator,
} from './utils';
import { getElementScrollOffset, setElementScrollOffset } from './state';

export interface VerticalScrollToOptions {
  y: number;
  momentumY?: number;

  // Vertical scroll should not contain horizontal scroll part.
  x?: never;
  momentumX?: never;
}

export interface HorizontalScrollToOptions {
  x: number;
  momentumX?: number;

  // Horizontal scroll should not contain vertical scroll part.
  y?: never;
  momentumY?: never;
}

export type ScrollToOptions =
  | VerticalScrollToOptions
  | HorizontalScrollToOptions;

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
  const dragSteps = createScrollSteps(
    { y: options.y, x: options.x },
    initialPosition,
    linearInterpolator
  );
  emitDragScrollEvents(element, dragSteps);

  const momentumStart = dragSteps.at(-1) ?? initialPosition;
  const momentumSteps = createScrollSteps(
    { y: options.momentumY, x: options.momentumX },
    momentumStart,
    inertialInterpolator
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

  // Note: experimentally, in case of drag scroll the last scroll step
  // will not trigger `scroll` event.
  // See: https://github.com/callstack/react-native-testing-library/wiki/ScrollView-Events
  for (let i = 1; i < scrollSteps.length - 1; i += 1) {
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

  // Note: experimentally, in case of momentum scroll the last scroll step
  // will trigger `scroll` event.
  // See: https://github.com/callstack/react-native-testing-library/wiki/ScrollView-Events
  for (let i = 1; i < scrollSteps.length; i += 1) {
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
