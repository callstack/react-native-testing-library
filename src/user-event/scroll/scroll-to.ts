import { ReactTestInstance } from 'react-test-renderer';
import { stringify } from 'jest-matcher-utils';
import { UserEventConfig, UserEventInstance } from '../setup';
import { EventBuilder } from '../event-builder';
import { ErrorWithStack } from '../../helpers/errors';
import { isHostScrollView } from '../../helpers/host-component-names';
import { pick } from '../../helpers/object';
import { ContentOffset } from '../event-builder/scroll-view';
import { dispatchEvent, wait } from '../utils';
import {
  createScrollSteps,
  inertialInterpolator,
  linearInterpolator,
} from './utils';
import { getElementScrollOffset, setElementScrollOffset } from './state';

interface CommonScrollToOptions {
  contentSize?: {
    height: number;
    width: number;
  };
  layoutMeasurement?: {
    height: number;
    width: number;
  };
}

export interface VerticalScrollToOptions extends CommonScrollToOptions {
  y: number;
  momentumY?: number;

  // Vertical scroll should not contain horizontal scroll part.
  x?: never;
  momentumX?: never;
}

export interface HorizontalScrollToOptions extends CommonScrollToOptions {
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

  ensureScrollViewDirection(element, options);

  dispatchEvent(
    element,
    'contentSizeChange',
    options.contentSize?.width ?? 0,
    options.contentSize?.height ?? 0
  );

  const initialPosition = getElementScrollOffset(element);
  const dragSteps = createScrollSteps(
    { y: options.y, x: options.x },
    initialPosition,
    linearInterpolator
  );
  await emitDragScrollEvents(this.config, element, dragSteps, options);

  const momentumStart = dragSteps.at(-1) ?? initialPosition;
  const momentumSteps = createScrollSteps(
    { y: options.momentumY, x: options.momentumX },
    momentumStart,
    inertialInterpolator
  );
  await emitMomentumScrollEvents(this.config, element, momentumSteps, options);

  const finalPosition =
    momentumSteps.at(-1) ?? dragSteps.at(-1) ?? initialPosition;
  setElementScrollOffset(element, finalPosition);
}

async function emitDragScrollEvents(
  config: UserEventConfig,
  element: ReactTestInstance,
  scrollSteps: ContentOffset[],
  scrollOptions: ScrollToOptions
) {
  if (scrollSteps.length === 0) {
    return;
  }

  await wait(config);
  dispatchEvent(
    element,
    'scrollBeginDrag',
    EventBuilder.ScrollView.scroll(scrollSteps[0], scrollOptions)
  );

  // Note: experimentally, in case of drag scroll the last scroll step
  // will not trigger `scroll` event.
  // See: https://github.com/callstack/react-native-testing-library/wiki/ScrollView-Events
  for (let i = 1; i < scrollSteps.length - 1; i += 1) {
    await wait(config);
    dispatchEvent(
      element,
      'scroll',
      EventBuilder.ScrollView.scroll(scrollSteps[i], scrollOptions)
    );
  }

  await wait(config);
  const lastStep = scrollSteps.at(-1);
  dispatchEvent(
    element,
    'scrollEndDrag',
    EventBuilder.ScrollView.scroll(lastStep, scrollOptions)
  );
}

async function emitMomentumScrollEvents(
  config: UserEventConfig,
  element: ReactTestInstance,
  scrollSteps: ContentOffset[],
  scrollOptions: ScrollToOptions
) {
  if (scrollSteps.length === 0) {
    return;
  }

  await wait(config);
  dispatchEvent(
    element,
    'momentumScrollBegin',
    EventBuilder.ScrollView.scroll(scrollSteps[0], scrollOptions)
  );

  // Note: experimentally, in case of momentum scroll the last scroll step
  // will trigger `scroll` event.
  // See: https://github.com/callstack/react-native-testing-library/wiki/ScrollView-Events
  for (let i = 1; i < scrollSteps.length; i += 1) {
    await wait(config);
    dispatchEvent(
      element,
      'scroll',
      EventBuilder.ScrollView.scroll(scrollSteps[i], scrollOptions)
    );
  }

  await wait(config);
  const lastStep = scrollSteps.at(-1);
  dispatchEvent(
    element,
    'momentumScrollEnd',
    EventBuilder.ScrollView.scroll(lastStep, scrollOptions)
  );
}

function ensureScrollViewDirection(
  element: ReactTestInstance,
  options: ScrollToOptions
) {
  const isVerticalScrollView = element.props.horizontal !== true;

  const hasHorizontalScrollOptions =
    options.x !== undefined || options.momentumX !== undefined;
  if (isVerticalScrollView && hasHorizontalScrollOptions) {
    throw new ErrorWithStack(
      `scrollTo() expected only vertical scroll options: "y" and "momentumY" for vertical "ScrollView" element but received ${stringify(
        pick(options, ['x', 'momentumX'])
      )}`,
      scrollTo
    );
  }

  const hasVerticalScrollOptions =
    options.y !== undefined || options.momentumY !== undefined;
  if (!isVerticalScrollView && hasVerticalScrollOptions) {
    throw new ErrorWithStack(
      `scrollTo() expected only horizontal scroll options: "x" and "momentumX" for horizontal "ScrollView" element but received ${stringify(
        pick(options, ['y', 'momentumY'])
      )}`,
      scrollTo
    );
  }
}
