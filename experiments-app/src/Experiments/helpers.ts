import { NativeSyntheticEvent } from 'react-native/types';

export function buildEventLogger(name: string) {
  return (event: NativeSyntheticEvent<unknown>) => {
    const eventData = event?.nativeEvent ?? event;
    console.log(`Event: ${name}`, eventData);
  };
}
