import { setTimeout } from '../helpers/getTimerFuncs';

const TimerMode = {
  Default: 'default',
  Legacy: 'legacy',
  Modern: 'modern', // broken for now
};

function setupFakeTimers(fakeTimerType) {
  switch (fakeTimerType) {
    case TimerMode.Legacy:
    case TimerMode.Modern: {
      jest.useFakeTimers(fakeTimerType);
      break;
    }
    case TimerMode.Default:
    default: {
      jest.useFakeTimers();
    }
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { TimerMode, setupFakeTimers, sleep };
