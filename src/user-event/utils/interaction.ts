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

  /**
   * Dispatches the event to `target` with `dispatchEvent` and records it.
   */
  async dispatchEvent(eventName: string, ...event: unknown[]) {
    this.eventNames.push(eventName);
    if (await dispatchEvent(this.target, eventName, ...event)) {
      this.hasCalledHandler = true;
    }
  }
}
