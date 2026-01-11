import { copyStackTrace, ErrorWithStack } from '../errors';

describe('ErrorWithStack', () => {
  test('should create an error with message', () => {
    const error = new ErrorWithStack('Test error', ErrorWithStack);
    expect(error.message).toBe('Test error');
    expect(error).toBeInstanceOf(Error);

    const originalCaptureStackTrace = Error.captureStackTrace;
    // @ts-expect-error - intentionally removing captureStackTrace
    delete Error.captureStackTrace;

    const errorWithoutCapture = new ErrorWithStack('Test error', ErrorWithStack);
    expect(errorWithoutCapture.message).toBe('Test error');
    expect(errorWithoutCapture).toBeInstanceOf(Error);

    Error.captureStackTrace = originalCaptureStackTrace;
  });

  test('should capture stack trace if Error.captureStackTrace is available', () => {
    const originalCaptureStackTrace = Error.captureStackTrace;
    const captureStackTraceSpy = jest.fn();
    Error.captureStackTrace = captureStackTraceSpy;

    const error = new ErrorWithStack('Test error', ErrorWithStack);
    expect(captureStackTraceSpy).toHaveBeenCalledWith(error, ErrorWithStack);

    Error.captureStackTrace = originalCaptureStackTrace;
  });
});

describe('copyStackTrace', () => {
  test('should copy stack trace from source to target when both are Error instances', () => {
    const target = new Error('Target error');
    const source = new Error('Source error');
    source.stack = 'Error: Source error\n    at test.js:1:1';

    copyStackTrace(target, source);
    expect(target.stack).toBe('Error: Target error\n    at test.js:1:1');

    const target2 = new Error('Target error');
    const source2 = new Error('Source error');
    source2.stack =
      'Error: Source error\n    at test.js:1:1\nError: Source error\n    at test.js:2:2';

    copyStackTrace(target2, source2);
    // Should replace only the first occurrence
    expect(target2.stack).toBe(
      'Error: Target error\n    at test.js:1:1\nError: Source error\n    at test.js:2:2',
    );
  });

  test('should not modify target when conditions are not met', () => {
    const targetNotError = { message: 'Not an error' };
    const source = new Error('Source error');
    source.stack = 'Error: Source error\n    at test.js:1:1';

    copyStackTrace(targetNotError, source);
    expect(targetNotError).toEqual({ message: 'Not an error' });

    const target = new Error('Target error');
    const originalStack = target.stack;
    const sourceNotError = { message: 'Not an error' };

    copyStackTrace(target, sourceNotError as Error);
    expect(target.stack).toBe(originalStack);

    const sourceNoStack = new Error('Source error');
    delete sourceNoStack.stack;

    copyStackTrace(target, sourceNoStack);
    expect(target.stack).toBe(originalStack);
  });
});
