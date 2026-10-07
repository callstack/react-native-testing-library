import type { TestInstance } from 'test-renderer';

import { dispatchEvent } from '../../events';

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

  async dispatchEvent(eventName: string, ...event: unknown[]) {
    const hasCalledHandler = await dispatchEvent(this.target, eventName, ...event);
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
