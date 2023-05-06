import { jestFakeTimersAreEnabled } from '../../helpers/timers';

export interface UserEventSetupOptions {
  /**
   * Between some subsequent inputs like typing a series of characters
   * the code execution is delayed per `setTimeout` for (at least) `delay` seconds.
   * This moves the next changes at least to next macro task
   * and allows other (asynchronous) code to run between events.
   *
   * `null` prevents `setTimeout` from being called.
   *
   * @default 0
   */
  delay?: number;

  /**
   * Function to be called to advance fake timers. Setting it is necessary for
   * fake timers to work.
   *
   * @example jest.advanceTimersByTime
   */
  advanceTimers?: (delay: number) => Promise<void> | void;
}

/**
 * This functions allow wait to work correctly under both real and fake Jest timers.
 */
function universalJestAdvanceTimersBy(ms: number) {
  if (jestFakeTimersAreEnabled()) {
    return jest.advanceTimersByTime(ms);
  } else {
    return Promise.resolve();
  }
}

const defaultOptions: Required<UserEventSetupOptions> = {
  delay: 0,
  advanceTimers: universalJestAdvanceTimersBy,
};

/**
 * Creates a new instance of user event instance with the given options.
 *
 * @param options
 * @returns
 */
export function setup(options?: UserEventSetupOptions) {
  const config = createConfig(options);
  const instance = createInstance(config);
  return instance;
}

export interface UserEventConfig {
  delay: number;
  advanceTimers: (delay: number) => Promise<void> | void;
}

function createConfig(options?: UserEventSetupOptions): UserEventConfig {
  return {
    ...defaultOptions,
    ...options,
  };
}

export interface UserEventInstance {
  config: UserEventConfig;
}

function createInstance(config: UserEventConfig): UserEventInstance {
  const instance = {
    config,
  } as UserEventInstance;

  const api = {
    // TODO: bind methods to the instance, e.g. type: type.bind(instance),
  };

  Object.assign(instance, api);
  return instance;
}
