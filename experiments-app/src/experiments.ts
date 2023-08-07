import { TextInputEventPropagation } from './screens/TextInputEventPropagation';
import { TextInputEvents } from './screens/TextInputEvents';
import { ScrollViewEvents } from './screens/ScrollViewEvents';

export type Experiment = (typeof experiments)[number];

export const experiments = [
  {
    key: 'textInputEvents',
    title: 'TextInput Events',
    component: TextInputEvents,
  },
  {
    key: 'textInputEventPropagation',
    title: 'TextInput Event Propagation',
    component: TextInputEventPropagation,
  },
  {
    key: 'scrollViewEvents',
    title: 'ScrollView Events',
    component: ScrollViewEvents,
  },
];
