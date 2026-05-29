import { AccessibilityScreen } from './screens/Accessibility';
import { FlatListEvents } from './screens/FlatListEvents';
import { PressEvents } from './screens/PressEvents';
import { ScrollViewEvents } from './screens/ScrollViewEvents';
import { SectionListEvents } from './screens/SectionListEvents';
import { TextInputEventPropagation } from './screens/TextInputEventPropagation';
import { TextInputEvents } from './screens/TextInputEvents';

export type Experiment = (typeof experiments)[number];

export const experiments = [
  {
    key: 'Accessibility',
    title: 'Accessibility',
    component: AccessibilityScreen,
  },
  {
    key: 'PressEvents',
    title: 'Press Events',
    component: PressEvents,
  },
  {
    key: 'TextInputEvents',
    title: 'TextInput Events',
    component: TextInputEvents,
  },
  {
    key: 'TextInputEventPropagation',
    title: 'TextInput Event Propagation',
    component: TextInputEventPropagation,
  },
  {
    key: 'ScrollViewEvents',
    title: 'ScrollView Events',
    component: ScrollViewEvents,
  },
  {
    key: 'FlatListEvents',
    title: 'FlatList Events',
    component: FlatListEvents,
  },
  {
    key: 'SectionListEvents',
    title: 'SectionList Events',
    component: SectionListEvents,
  },
];
