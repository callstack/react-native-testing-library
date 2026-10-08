import {
  BUBBLING_EVENT_TYPES,
  DIRECT_EVENT_TYPES,
  getEventTypeConfig,
  SKIP_BUBBLING_EVENT_TYPES,
} from '../event-types';

type ViewConfig = {
  bubblingEventTypes?: Record<
    string,
    { phasedRegistrationNames: { bubbled: string; captured: string; skipBubbling?: boolean } }
  >;
  directEventTypes?: Record<string, { registrationName: string }>;
};

// Base view configs plus the built-in components that declare events.
const viewConfigModules = [
  'react-native/Libraries/NativeComponent/BaseViewConfig.ios',
  'react-native/Libraries/NativeComponent/BaseViewConfig.android',
  'react-native/Libraries/Components/DrawerAndroid/AndroidDrawerLayoutNativeComponent',
  'react-native/Libraries/Components/RefreshControl/AndroidSwipeRefreshLayoutNativeComponent',
  'react-native/Libraries/Components/RefreshControl/PullToRefreshViewNativeComponent',
  'react-native/Libraries/Components/ScrollView/ScrollViewNativeComponent',
  'react-native/Libraries/Components/Switch/AndroidSwitchNativeComponent',
  'react-native/Libraries/Components/Switch/SwitchNativeComponent',
  'react-native/Libraries/Components/TextInput/AndroidTextInputNativeComponent',
  'react-native/Libraries/Components/TextInput/RCTMultilineTextInputNativeComponent',
  'react-native/Libraries/Components/TextInput/RCTSingelineTextInputNativeComponent',
  'react-native/Libraries/Image/ImageViewNativeComponent',
  'react-native/Libraries/Modal/RCTModalHostViewNativeComponent',
];

// Missing in older React Native versions.
const optionalViewConfigModules = [
  // Added in React Native 0.81.
  'react-native/src/private/components/virtualview/VirtualViewNativeComponent',
];

// Not exported by React Native, so listed by hand in `event-types.ts`.
const manualDirectEventTypes = ['textLayout'];

function toEventType(topLevelType: string) {
  return topLevelType.charAt(3).toLowerCase() + topLevelType.slice(4);
}

function loadViewConfigs(): ViewConfig[] {
  const modules = viewConfigModules.map((modulePath) => jest.requireActual(modulePath));
  for (const modulePath of optionalViewConfigModules) {
    try {
      modules.push(jest.requireActual(modulePath));
    } catch {
      // Not available in the installed React Native version.
    }
  }

  return modules.map((module) => module.__INTERNAL_VIEW_CONFIG ?? module.default);
}

function loadReactNativeEventTypes() {
  const bubbling = new Set<string>();
  const skipBubbling = new Set<string>();
  const direct = new Set<string>(manualDirectEventTypes);

  for (const viewConfig of loadViewConfigs()) {
    for (const [topLevelType, config] of Object.entries(viewConfig.bubblingEventTypes ?? {})) {
      const eventType = toEventType(topLevelType);
      // `getEventTypeConfig()` derives prop names from the event type.
      expect(getEventTypeConfig(eventType)?.dispatchConfig).toEqual({
        phasedRegistrationNames: config.phasedRegistrationNames,
      });
      bubbling.add(eventType);
      if (config.phasedRegistrationNames.skipBubbling) {
        skipBubbling.add(eventType);
      }
    }

    for (const [topLevelType, config] of Object.entries(viewConfig.directEventTypes ?? {})) {
      // Gesture handler events: registered without `top`, not dispatched by React Native.
      if (!topLevelType.startsWith('top')) {
        continue;
      }

      const eventType = toEventType(topLevelType);
      expect(getEventTypeConfig(eventType)?.dispatchConfig).toEqual({
        registrationName: config.registrationName,
      });
      direct.add(eventType);
    }
  }

  return { bubbling, skipBubbling, direct };
}

// The lists are the union across supported React Native versions, so older versions declare only a
// subset of them (e.g. `keyDown` and `keyUp` were added in React Native 0.84).
test('event types cover React Native view configs', () => {
  const reactNative = loadReactNativeEventTypes();

  expect(BUBBLING_EVENT_TYPES).toEqual(expect.arrayContaining([...reactNative.bubbling]));
  expect(SKIP_BUBBLING_EVENT_TYPES).toEqual(expect.arrayContaining([...reactNative.skipBubbling]));
  expect(DIRECT_EVENT_TYPES).toEqual(expect.arrayContaining([...reactNative.direct]));
});

test('getEventTypeConfig() returns config of bubbling event', () => {
  expect(getEventTypeConfig('pointerUp')).toEqual({
    kind: 'bubbling',
    skipBubbling: false,
    dispatchConfig: {
      phasedRegistrationNames: { bubbled: 'onPointerUp', captured: 'onPointerUpCapture' },
    },
  });
});

test('getEventTypeConfig() returns config of bubbling event with skipBubbling', () => {
  expect(getEventTypeConfig('pointerEnter')).toEqual({
    kind: 'bubbling',
    skipBubbling: true,
    dispatchConfig: {
      phasedRegistrationNames: {
        bubbled: 'onPointerEnter',
        captured: 'onPointerEnterCapture',
        skipBubbling: true,
      },
    },
  });
});

test('getEventTypeConfig() returns config of direct event', () => {
  expect(getEventTypeConfig('layout')).toEqual({
    kind: 'direct',
    dispatchConfig: { registrationName: 'onLayout' },
  });
});

test('getEventTypeConfig() returns null for events unknown to React Native', () => {
  expect(getEventTypeConfig('changeText')).toBeNull();
  expect(getEventTypeConfig('pressIn')).toBeNull();
  expect(getEventTypeConfig('onFocus')).toBeNull();
  expect(getEventTypeConfig('toString')).toBeNull();
});
