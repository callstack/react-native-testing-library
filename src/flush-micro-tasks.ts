import { setImmediate } from './helpers/timers';

export function flushMicroTasks() {
  return new Promise((resolve) => setImmediate(resolve));
}

/**
 * @deprecated To be removed in the next major release.
 */
type Thenable<T> = { then: (callback: () => T) => unknown };

/**
 * This legacy implementation of `flushMicroTasks` is used for compatibility with
 * older versions of React Native (pre 0.71) which uses Promise polyfil.
 *
 * For users with older version of React Native there is a workaround of using our own
 * Jest preset instead the `react-native` one, but requiring such change would be a
 * breaking change for existing users.
 *
 * @deprecated To be removed in the next major release.
 */
export function flushMicroTasksLegacy(): Thenable<void> {
  return {
    // using "thenable" instead of a Promise, because otherwise it breaks when
    // using "modern" fake timers
    then(resolve) {
      setImmediate(resolve);
    },
  };
}
