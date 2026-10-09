import type { TestInstance } from 'test-renderer';

import type { LegacyEvent } from '../../events/create-event';
import { dispatchEvent } from '../../events/dispatch-event';
import { buildTouchEvent } from '../../events/legacy';
import type { SyntheticEvent } from '../../events/modern/event';
import { invokeEventHandler } from '../../events/shared/invoke-event-handler';

/**
 * Tracks what a single `userEvent` interaction did, so `warnAboutUnhandledInteraction`
 * can tell whether any of its events had an effect.
 */
export class Interaction {
  readonly eventNames: string[] = [];
  /** Elements that could handle the interaction but did not accept it, nearest first. */
  readonly skippedTargets: TestInstance[] = [];
  hasCalledHandler = false;
  hasUpdatedNativeState = false;

  /**
   * @param name Name of the `userEvent` method, e.g. `press`.
   * @param target Element to dispatch events to. `press()` moves it to the element that
   * handles the press.
   */
  constructor(
    readonly name: string,
    public target: TestInstance,
  ) {}

  /** Dispatches a native event from `createEvent()`, e.g. `buildFocusEvent()`. */
  async dispatchEvent(eventName: string, event: LegacyEvent | SyntheticEvent) {
    const hasCalledHandler = await dispatchEvent(this.target, eventName, event);
    this.recordEvent(eventName, hasCalledHandler);
  }

  /**
   * Calls a touch callback that `Pressable` calls from JavaScript (`pressIn`, `pressOut`,
   * `longPress`) with a touch event, the way Pressability does.
   */
  async dispatchTouchEvent(eventName: string) {
    await this.invokeEventHandler(eventName, buildTouchEvent());
  }

  /**
   * Calls the target's own handler with the given params, for callbacks that components call
   * from JavaScript instead of dispatching events, e.g. `onChangeText(text)` or `ScrollView`'s
   * `onContentSizeChange(width, height)`.
   */
  async invokeEventHandler(eventName: string, ...params: unknown[]) {
    const hasCalledHandler = await invokeEventHandler(this.target, eventName, ...params);
    this.recordEvent(eventName, hasCalledHandler);
  }

  /**
   * Records an event whose handler the action called itself instead of using `dispatchEvent`,
   * e.g. `pullToRefresh()` calling `onRefresh` from the `refreshControl` prop.
   */
  recordEvent(eventName: string, hasCalledHandler: boolean) {
    this.eventNames.push(eventName);
    if (hasCalledHandler) {
      this.hasCalledHandler = true;
    }
  }
}
