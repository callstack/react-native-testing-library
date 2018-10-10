// @flow
export default function waitForExpect(
  expectation: () => ReactTestInstance,
  timeout: number = 4500,
  interval: number = 50
) {
  const startTime = Date.now();
  return new Promise<ReactTestInstance>((resolve, reject) => {
    const rejectOrRerun = error => {
      if (Date.now() - startTime >= timeout) {
        reject(error);
        return;
      }
      setTimeout(runExpectation, interval);
    };
    function runExpectation() {
      try {
        const result = expectation();
        resolve(result);
      } catch (error) {
        rejectOrRerun(error);
      }
    }
    setTimeout(runExpectation, 0);
  });
}
