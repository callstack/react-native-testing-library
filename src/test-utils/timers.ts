export type TimerType = 'real' | 'fake' | 'fake-legacy';

export function useTimerType(type: TimerType): void {
  if (type === 'fake-legacy') {
    jest.useFakeTimers({ legacyFakeTimers: true });
  } else if (type === 'fake') {
    jest.useFakeTimers({ legacyFakeTimers: false });
  } else {
    jest.useRealTimers();
  }
}
