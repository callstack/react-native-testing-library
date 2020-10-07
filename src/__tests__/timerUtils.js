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

export { FakeTimerTypes, setupFakeTimers };
