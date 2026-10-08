import type { TestInstance } from 'test-renderer';

import type { DispatchConfig } from './event-types';
import { getEventTypeConfig } from './event-types';

export type NativeEventPayload = Record<string, unknown>;

export type CreateEventInit = {
  /** Passed to handlers as `event.nativeEvent`. Defaults to `{}`. */
  nativeEvent?: NativeEventPayload;
  /**
   * The event's `timeStamp`. Defaults to the native timestamp, as in React Native
   * (`nativeEvent.timeStamp ?? nativeEvent.timestamp`), then to `performance.now()`.
   */
  timeStamp?: number;
};

type SyntheticEventInit = {
  bubbles?: boolean;
  cancelable?: boolean;
  /** Direct events are dispatched only to the target, without the capture phase. */
  rnIsDirect?: boolean;
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

/**
 * Event fields that the dispatch updates, as in React Native's `EventInternals`. Kept off the
 * event's own properties, so printed events don't include the element tree.
 */
type EventInternals = {
  target: TestInstance | null;
  currentTarget: TestInstance | null;
  eventPhase: EventPhase;
  composedPath: TestInstance[];
  stopPropagation: boolean;
};

const eventInternalsMap = new WeakMap<SyntheticEvent, EventInternals>();

function getEventInternals(event: SyntheticEvent): EventInternals {
  const internals = eventInternalsMap.get(event);
  if (internals == null) {
    throw new TypeError('Illegal invocation');
  }

  return internals;
}

/**
 * Event object passed to handlers by the modern event system.
 *
 * Mirrors React Native's `LegacySyntheticEvent`, which extends the W3C `Event`
 * (`src/private/renderer/events/LegacySyntheticEvent.js`,
 * `src/private/webapis/dom/events/Event.js`).
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
  private readonly _rnIsDirect: boolean;
  private readonly _timeStamp: number;
  private readonly _nativeEvent: NativeEventPayload;
  private readonly _dispatchConfig: DispatchConfig;
  private _defaultPrevented = false;

  constructor(
    type: string,
    init: SyntheticEventInit,
    nativeEvent: NativeEventPayload,
    dispatchConfig: DispatchConfig,
  ) {
    this._type = type;
    this._bubbles = Boolean(init.bubbles);
    this._cancelable = Boolean(init.cancelable);
    this._rnIsDirect = Boolean(init.rnIsDirect);
    this._timeStamp = init.timeStamp ?? performance.now();
    this._nativeEvent = nativeEvent;
    this._dispatchConfig = dispatchConfig;

    eventInternalsMap.set(this, {
      target: null,
      currentTarget: null,
      eventPhase: NONE,
      composedPath: [],
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

  get rnIsDirect(): boolean {
    return this._rnIsDirect;
  }

  get timeStamp(): number {
    return this._timeStamp;
  }

  get nativeEvent(): NativeEventPayload {
    return this._nativeEvent;
  }

  get dispatchConfig(): DispatchConfig {
    return this._dispatchConfig;
  }

  get defaultPrevented(): boolean {
    return this._defaultPrevented;
  }

  get target(): TestInstance | null {
    return getEventInternals(this).target;
  }

  get currentTarget(): TestInstance | null {
    return getEventInternals(this).currentTarget;
  }

  get eventPhase(): EventPhase {
    return getEventInternals(this).eventPhase;
  }

  /** Only the native event dispatch creates events, and React Native marks those as trusted. */
  get isTrusted(): boolean {
    return true;
  }

  get cancelBubble(): boolean {
    return getEventInternals(this).stopPropagation;
  }

  set cancelBubble(value: boolean) {
    if (value) {
      getEventInternals(this).stopPropagation = true;
    }
  }

  composedPath(): TestInstance[] {
    return getEventInternals(this).composedPath.slice();
  }

  preventDefault(): void {
    if (this._cancelable) {
      this._defaultPrevented = true;
    }
  }

  stopPropagation(): void {
    getEventInternals(this).stopPropagation = true;
  }

  /** Same as `stopPropagation()`, as each element has a single prop handler per phase. */
  stopImmediatePropagation(): void {
    getEventInternals(this).stopPropagation = true;
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
    getEventInternals(event).target = target;
  },

  setCurrentTarget(event: SyntheticEvent, currentTarget: TestInstance | null) {
    getEventInternals(event).currentTarget = currentTarget;
  },

  setEventPhase(event: SyntheticEvent, eventPhase: EventPhase) {
    getEventInternals(event).eventPhase = eventPhase;
  },

  setComposedPath(event: SyntheticEvent, composedPath: TestInstance[]) {
    getEventInternals(event).composedPath = composedPath;
  },

  resetStopPropagationFlag(event: SyntheticEvent) {
    getEventInternals(event).stopPropagation = false;
  },
};

/**
 * Creates the event React Native would create for a native event of this type, ready for
 * `dispatchEvent()`. Like Testing Library's DOM `createEvent()`.
 *
 * @param eventType e.g. `focus` or `pointerUp`
 * @returns `null` for events unknown to React Native, as React Native drops them.
 */
export function createEvent(eventType: string, init: CreateEventInit = {}): SyntheticEvent | null {
  const config = getEventTypeConfig(eventType);
  if (config == null) {
    return null;
  }

  const nativeEvent = init.nativeEvent ?? {};
  // React Native keeps the native timestamp as the event's `timeStamp`.
  const nativeTimeStamp = nativeEvent.timeStamp ?? nativeEvent.timestamp;
  const timeStamp =
    init.timeStamp ?? (typeof nativeTimeStamp === 'number' ? nativeTimeStamp : undefined);
  return new SyntheticEvent(
    // React Native's event type is the lowercased name, e.g. `pointerup`.
    eventType.toLowerCase(),
    {
      bubbles: config.kind === 'bubbling' && !config.skipBubbling,
      cancelable: true,
      rnIsDirect: config.kind === 'direct',
      timeStamp,
    },
    nativeEvent,
    config.dispatchConfig,
  );
}
