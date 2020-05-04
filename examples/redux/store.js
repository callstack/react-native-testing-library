import { createStore } from 'redux';
import reducers from './reducers';

export default function configureStore() {
  return createStore(reducers);
}
