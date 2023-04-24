import { TextInputEventPropagation } from './experiments/TextInputEventPropagation';
import { TextInputEvents } from './experiments/TextInputEvents';

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
];
