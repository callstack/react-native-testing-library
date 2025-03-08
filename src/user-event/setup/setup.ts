import { HostElement } from 'universal-test-renderer';
import { jestFakeTimersAreEnabled } from '../../helpers/timers';
import { wrapAsync } from '../../helpers/wrap-async';
import { clear } from '../clear';
import { paste } from '../paste';
import type { PressOptions } from '../press';
import { longPress, press } from '../press';
import type { ScrollToOptions } from '../scroll';
import { scrollTo } from '../scroll';
import type { TypeOptions } from '../type';
import { type } from '../type';
import { wait } from '../utils';

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
 * @returns UserEvent instance
 */
export function setup(options?: UserEventSetupOptions) {
  const config = createConfig(options);
  const instance = createInstance(config);
  return instance;
}

/**
 * Options affecting all user event interactions.
 *
 * @param delay between some subsequent inputs like typing a series of characters
 * @param advanceTimers function to be called to advance fake timers
 */
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

/**
 * UserEvent instance used to invoke user interaction functions.
 */
export interface UserEventInstance {
  config: UserEventConfig;

  press: (element: HostElement) => Promise<void>;
  longPress: (element: HostElement, options?: PressOptions) => Promise<void>;

  /**
   * Simulate user pressing on a given `TextInput` element and typing given text.
   *
   * This method will trigger the events for each character of the text:
   * `keyPress`, `change`, `changeText`, `endEditing`, etc.
   *
   * It will also trigger events connected with entering and leaving the text
   * input.
   *
   * The exact events sent depend on the props of the TextInput (`editable`,
   * `multiline`, etc) and passed options.
   *
   * @param element TextInput element to type on
   * @param text Text to type
   * @param options Options affecting typing behavior:
   *  - `skipPress` - if true, `pressIn` and `pressOut` events will not be
   *   triggered.
   * - `submitEditing` - if true, `submitEditing` event will be triggered after
   * typing the text.
   */
  type: (element: HostElement, text: string, options?: TypeOptions) => Promise<void>;

  /**
   * Simulate user clearing the text of a given `TextInput` element.
   *
   * This method will simulate:
   * 1. entering TextInput
   * 2. selecting all text
   * 3. pressing backspace to delete all text
   * 4. leaving TextInput
   *
   * @param element TextInput element to clear
   */
  clear: (element: HostElement) => Promise<void>;

  /**
   * Simulate user pasting the text to a given `TextInput` element.
   *
   * This method will simulate:
   * 1. entering TextInput
   * 2. selecting all text
   * 3. paste the text
   * 4. leaving TextInput
   *
   * @param element TextInput element to paste to
   */
  paste: (element: HostElement, text: string) => Promise<void>;

  /**
   * Simlate user scorlling a ScrollView element.
   *
   * @param element ScrollView element
   * @returns
   */
  scrollTo: (element: HostElement, options: ScrollToOptions) => Promise<void>;
}

function createInstance(config: UserEventConfig): UserEventInstance {
  const instance = {
    config,
  } as UserEventInstance;

  // Bind interactions to given User Event instance.
  const api = {
    press: wrapAndBindImpl(instance, press),
    longPress: wrapAndBindImpl(instance, longPress),
    type: wrapAndBindImpl(instance, type),
    clear: wrapAndBindImpl(instance, clear),
    paste: wrapAndBindImpl(instance, paste),
    scrollTo: wrapAndBindImpl(instance, scrollTo),
  };

  Object.assign(instance, api);
  return instance;
}

/**
 * Wraps user interaction with `wrapAsync` (temporarily disable `act` environment while
 * calling & resolving the async callback, then flush the microtask queue)
 *
 * This implementation is sourced from `testing-library/user-event`
 * @see https://github.com/testing-library/user-event/blob/7a305dee9ab833d6f338d567fc2e862b4838b76a/src/setup/setup.ts#L121
 */
function wrapAndBindImpl<
  Args extends never[],
  Impl extends (this: UserEventInstance, ...args: Args) => Promise<unknown>,
>(instance: UserEventInstance, impl: Impl) {
  function method(...args: Args) {
    return wrapAsync(() =>
      // eslint-disable-next-line promise/prefer-await-to-then
      impl.apply(instance, args).then(async (result) => {
        await wait(instance.config);
        return result;
      }),
    );
  }

  // Copy implementation name to the returned function
  Object.defineProperty(method, 'name', { get: () => impl.name });

  return method as Impl;
}
