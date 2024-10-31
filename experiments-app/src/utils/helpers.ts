import { NativeSyntheticEvent } from 'react-native/types';

let lastEventTimeStamp: number | null = null;

export function nativeEventLogger(name: string) {
  return (event: NativeSyntheticEvent<unknown>) => {
    logEvent(name, event?.nativeEvent);
  };
}

export function customEventLogger(name: string) {
  return (...args: unknown[]) => {
    logEvent(name, ...args);
  };
}

export function logEvent(name: string, ...args: unknown[]) {
  // eslint-disable-next-line no-console
  console.log(`[${Date.now() - (lastEventTimeStamp ?? Date.now())}ms] Event: ${name}`, ...args);
  lastEventTimeStamp = Date.now();
}
