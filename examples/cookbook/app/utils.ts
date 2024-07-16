import 'react-native-get-random-values';
import { nanoid } from 'nanoid';

export function generateId() {
  return nanoid();
}
