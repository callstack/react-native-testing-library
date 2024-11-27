import { configure } from '@testing-library/react-native';

// Import built-in Jest matchers
import '@testing-library/react-native/extend-expect';

configure({ concurrentRoot: true });
