import type { TestInstance } from 'test-renderer';

import type { DispatchConfig } from './event-types';

export type NativeEventPayload = Record<string, unknown>;

export type SyntheticEventInit = {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
  /** Direct events are dispatched only to the target, without the capture phase. */
  rnIsDirect?: boolean;
  /** Defaults to `performance.now()`. */
  timeStamp?: number;
};

const NONE = 0;
const CAPTURING_PHASE = 1;
const AT_TARGET = 2;
const BUBBLING_PHASE = 3;

export type EventPhase =
  | typeof NONE
  | typeof CAPTURING_PHASE
  | typeof AT_TARGET
  | typeof BUBBLING_PHASE;

/** State changed by the dispatch, hidden from the event's own properties. */
type DispatchState = {
  target: TestInstance | null;
  currentTarget: TestInstance | null;
  eventPhase: EventPhase;
  composedPath: TestInstance[];
  isTrusted: boolean;
  stopPropagation: boolean;
};

const dispatchStates = new WeakMap<SyntheticEvent, DispatchState>();

function getDispatchState(event: SyntheticEvent): DispatchState {
  const state = dispatchStates.get(event);
  if (state == null) {
    throw new TypeError('Illegal invocation');
  }

  return state;
}

/**
 * Event object passed to handlers by the modern event system.
 *
 * Mirrors React Native's `LegacySyntheticEvent`, which extends the W3C `Event`
 * (`src/private/renderer/events/LegacySyntheticEvent.js` and `src/private/webapis/dom/events/Event.js`).
 * `target` and `currentTarget` are host elements, the same objects that queries return.
 */
export class SyntheticEvent {
  static readonly NONE = NONE;
  static readonly CAPTURING_PHASE = CAPTURING_PHASE;
  static readonly AT_TARGET = AT_TARGET;
  static readonly BUBBLING_PHASE = BUBBLING_PHASE;

  private readonly _type: string;
  private readonly _bubbles: boolean;
  private readonly _cancelable: boolean;
  private readonly _composed: boolean;
  private readonly _rnIsDirect: boolean;
  private readonly _timeStamp: number;
  private readonly _nativeEvent: NativeEventPayload;
  private readonly _dispatchConfig: DispatchConfig | null;
  private _defaultPrevented = false;

  constructor(
    type: string,
    init: SyntheticEventInit,
    nativeEvent: NativeEventPayload,
    dispatchConfig?: DispatchConfig | null,
  ) {
    if (init.rnIsDirect && init.bubbles) {
      throw new TypeError(
        "Failed to construct 'Event': 'rnIsDirect' cannot be true when 'bubbles' is also true.",
      );
    }

    this._type = type;
    this._bubbles = Boolean(init.bubbles);
    this._cancelable = Boolean(init.cancelable);
    this._composed = Boolean(init.composed);
    this._rnIsDirect = Boolean(init.rnIsDirect);
    this._timeStamp = init.timeStamp ?? performance.now();
    this._nativeEvent = nativeEvent;
    this._dispatchConfig = dispatchConfig ?? null;

    dispatchStates.set(this, {
      target: null,
      currentTarget: null,
      eventPhase: NONE,
      composedPath: [],
      isTrusted: false,
      stopPropagation: false,
    });
  }

  // Getters, so the constants live on the prototype as in React Native, not on each event.
  get NONE(): typeof NONE {
    return NONE;
  }

  get CAPTURING_PHASE(): typeof CAPTURING_PHASE {
    return CAPTURING_PHASE;
  }

  get AT_TARGET(): typeof AT_TARGET {
    return AT_TARGET;
  }

  get BUBBLING_PHASE(): typeof BUBBLING_PHASE {
    return BUBBLING_PHASE;
  }

  get type(): string {
    return this._type;
  }

  get bubbles(): boolean {
    return this._bubbles;
  }

  get cancelable(): boolean {
    return this._cancelable;
  }

  get composed(): boolean {
    return this._composed;
  }

  get rnIsDirect(): boolean {
    return this._rnIsDirect;
  }

  get timeStamp(): number {
    return this._timeStamp;
  }

  get nativeEvent(): NativeEventPayload {
    return this._nativeEvent;
  }

  get dispatchConfig(): DispatchConfig | null {
    return this._dispatchConfig;
  }

  get defaultPrevented(): boolean {
    return this._defaultPrevented;
  }

  get target(): TestInstance | null {
    return getDispatchState(this).target;
  }

  get currentTarget(): TestInstance | null {
    return getDispatchState(this).currentTarget;
  }

  get eventPhase(): EventPhase {
    return getDispatchState(this).eventPhase;
  }

  get isTrusted(): boolean {
    return getDispatchState(this).isTrusted;
  }

  get cancelBubble(): boolean {
    return getDispatchState(this).stopPropagation;
  }

  set cancelBubble(value: boolean) {
    if (value) {
      getDispatchState(this).stopPropagation = true;
    }
  }

  composedPath(): TestInstance[] {
    return getDispatchState(this).composedPath.slice();
  }

  preventDefault(): void {
    if (this._cancelable) {
      this._defaultPrevented = true;
    }
  }

  stopPropagation(): void {
    getDispatchState(this).stopPropagation = true;
  }

  /** Same as `stopPropagation()`, as each element has a single prop handler per phase. */
  stopImmediatePropagation(): void {
    getDispatchState(this).stopPropagation = true;
  }

  /** No-op: React Native no longer pools events. */
  persist(): void {}

  isDefaultPrevented(): boolean {
    return this.defaultPrevented;
  }

  isPropagationStopped(): boolean {
    return this.cancelBubble;
  }
}

/** @internal Lets the dispatch update the event, as React Native's `EventInternals` does. */
export const eventInternals = {
  setTarget(event: SyntheticEvent, target: TestInstance | null) {
    getDispatchState(event).target = target;
  },

  setCurrentTarget(event: SyntheticEvent, currentTarget: TestInstance | null) {
    getDispatchState(event).currentTarget = currentTarget;
  },

  setEventPhase(event: SyntheticEvent, eventPhase: EventPhase) {
    getDispatchState(event).eventPhase = eventPhase;
  },

  setComposedPath(event: SyntheticEvent, composedPath: TestInstance[]) {
    getDispatchState(event).composedPath = composedPath;
  },

  setIsTrusted(event: SyntheticEvent, isTrusted: boolean) {
    getDispatchState(event).isTrusted = isTrusted;
  },

  getStopPropagationFlag(event: SyntheticEvent): boolean {
    return getDispatchState(event).stopPropagation;
  },

  resetStopPropagationFlag(event: SyntheticEvent) {
    getDispatchState(event).stopPropagation = false;
  },
};
