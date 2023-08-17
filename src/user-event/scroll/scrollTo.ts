import { ReactTestInstance } from 'react-test-renderer';
import { UserEventInstance } from '../setup';
import { EventBuilder } from '../event-builder';
import { ErrorWithStack } from '../../helpers/errors';
import { isHostScrollView } from '../../helpers/host-component-names';
import { dispatchEvent } from '../utils';
import { ContentOffset } from '../event-builder/scroll';
import { generateScrollSteps } from './utils';

export interface ScrollToOptions {
  y?: number | number[];
  x?: number | number[];
  momentum?: Momentum;
}

export interface Momentum {
  value: number;
}

const scrollStateForElement = new WeakMap<ReactTestInstance, ContentOffset>();

export function getElementScrollState(
  element: ReactTestInstance
): ContentOffset {
  return scrollStateForElement.get(element) ?? { x: 0, y: 0 };
}

export function setElementScrollState(
  element: ReactTestInstance,
  scrollState: ContentOffset
) {
  scrollStateForElement.set(element, scrollState);
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

  const initialState = getElementScrollState(element);
  let scrollSteps = generateScrollSteps(options.y, options.x, initialState);
  if (scrollSteps?.length === 0) {
    return;
  }

  emitScrollEvents(element, scrollSteps);
}

export async function scrollToTop(element: ReactTestInstance): Promise<void> {
  if (!isHostScrollView(element)) {
    throw new ErrorWithStack(
      `scrollToTop() works only with host "ScrollView" elements. Passed element has type "${element.type}".`,
      scrollTo
    );
  }

  const initialState = getElementScrollState(element);

  if (initialState.y === 0 && initialState.x === 0) {
    throw new ErrorWithStack(
      `scrollToTop() does NOT trigger if content offset is already x:0, y:0.`,
      scrollTo
    );
  }

  let scrollSteps = generateScrollSteps(0, 0, initialState);
  emitScrollEvents(element, scrollSteps);

  dispatchEvent(
    element,
    'scrollToTop',
    EventBuilder.Scroll.scroll({
      x: 0,
      y: 0,
    })
  );
}

function emitScrollEvents(
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

  setElementScrollState(element, lastStep);
}
