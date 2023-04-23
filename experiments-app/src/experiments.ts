import { TextInputEvents } from './Experiments/TextInputEvents';

export type Experiment = (typeof experiments)[number];

export const experiments = [
  {
    key: 'textInputEvents',
    title: 'TextInput Events',
    component: TextInputEvents,
  },
];
