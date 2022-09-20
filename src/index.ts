import { cleanup } from './pure';
import { flushMicroTasks } from './flushMicroTasks';
import { getIsReactActEnvironment, setReactActEnvironment } from './act';

// If we're running in a test runner that supports afterEach
// then we'll automatically run cleanup afterEach test
// this ensures that tests run in isolation from each other
// if you don't like this then either import the `pure` module
// or set the RNTL_SKIP_AUTO_CLEANUP env variable to 'true'.
if (typeof afterEach === 'function' && !process.env.RNTL_SKIP_AUTO_CLEANUP) {
  // eslint-disable-next-line no-undef
  afterEach(async () => {
    await flushMicroTasks();
    cleanup();
  });
}

if (
  typeof beforeAll === 'function' &&
  typeof afterAll === 'function' &&
  !process.env.RNTL_SKIP_AUTO_CLEANUP
) {
  // This matches the behavior of React < 18.
  let previousIsReactActEnvironment = getIsReactActEnvironment();
  beforeAll(() => {
    previousIsReactActEnvironment = getIsReactActEnvironment();
    setReactActEnvironment(true);
  });

  afterAll(() => {
    setReactActEnvironment(previousIsReactActEnvironment);
  });
}

export * from './pure';
