import { setImmediate } from './helpers/timers';

export function flushMicroTasks() {
  return new Promise((resolve) => setImmediate(resolve));
}
