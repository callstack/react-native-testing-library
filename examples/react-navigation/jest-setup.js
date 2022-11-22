/* eslint-disable import/no-extraneous-dependencies */
import { configure } from '@testing-library/react-native';

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

configure({ defaultIncludeHiddenElements: false });
