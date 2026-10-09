import type { TestInstance } from 'test-renderer';

import { getConfig } from '../config';
import { fireEvent as legacyFireEvent } from './legacy/fire-event';
import type { FireEventInit } from './modern/fire-event';
import { fireEvent as modernFireEvent } from './modern/fire-event';
import type { EventProps, EventType, LayoutRectangle } from './shared/types';

/**
 * Public `fireEvent`. Calls the implementation of the event system selected by
 * `configure({ unstable_eventSystem })`, read on each call, so `configure()` inside a test applies.
 *
 * Types follow the legacy signatures. The modern implementation checks its arguments at runtime.
 */
async function fireEvent(
  instance: TestInstance,
  eventType: EventType,
  ...data: unknown[]
): Promise<unknown> {
  if (isModern()) {
    return await modernFireEvent(instance, eventType, ...(data as [FireEventInit]));
  }

  return await legacyFireEvent(instance, eventType, ...data);
}

fireEvent.changeText = async (instance: TestInstance, text: string): Promise<unknown> => {
  if (isModern()) {
    return await modernFireEvent.changeText(instance, text);
  }

  return await legacyFireEvent.changeText(instance, text);
};

fireEvent.press = async (instance: TestInstance, eventProps?: EventProps): Promise<void> => {
  if (isModern()) {
    await modernFireEvent.press(instance, eventProps as FireEventInit);
    return;
  }

  await legacyFireEvent.press(instance, eventProps);
};

fireEvent.scroll = async (instance: TestInstance, eventProps?: EventProps): Promise<void> => {
  if (isModern()) {
    await modernFireEvent.scroll(instance, eventProps as FireEventInit);
    return;
  }

  await legacyFireEvent.scroll(instance, eventProps);
};

fireEvent.layout = async (
  instance: TestInstance,
  layout?: Partial<LayoutRectangle>,
): Promise<void> => {
  if (isModern()) {
    await modernFireEvent.layout(instance, layout);
    return;
  }

  await legacyFireEvent.layout(instance, layout);
};

function isModern() {
  return getConfig().unstable_eventSystem === 'modern';
}

export { fireEvent };
