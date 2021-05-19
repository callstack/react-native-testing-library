// @flow

import { setTimeout } from '../helpers/timers';

const TimerMode = {
  Legacy: 'legacy',
  Modern: 'modern', // broken for now
};

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { TimerMode, sleep };
