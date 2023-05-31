import { NativeSyntheticEvent } from 'react-native/types';

export function buildEventLogger(name: string) {
  return (event: NativeSyntheticEvent<unknown>) => {
    const payload = event?.nativeEvent ?? event;
    logEvent(name, payload);
  };
}

export function logEvent(name: string, payload: unknown) {
  // eslint-disable-next-line no-console
  console.log(`Event: ${name}`, payload);
}
