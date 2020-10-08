import { setTimeout } from '../helpers/getTimerFuncs';

const FakeTimerTypes = [
  'default',
  'legacy',
  // 'modern', // broken for now
];

function setupFakeTimers(fakeTimerType) {
  switch (fakeTimerType) {
    case 'legacy':
    case 'modern': {
      jest.useFakeTimers(fakeTimerType);
      break;
    }
    case 'default':
    default: {
      jest.useFakeTimers();
    }
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { FakeTimerTypes, setupFakeTimers, sleep };
