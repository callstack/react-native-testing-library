import {
  bubblingEventTypes,
  directEventTypes,
  getEventTypeConfig,
  skipBubblingEventTypes,
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
  'react-native/src/private/components/virtualview/VirtualViewNativeComponent',
];

// Not exported by React Native, so listed by hand in `event-types.ts`.
const manualDirectEventTypes = ['textLayout'];

function toEventType(topLevelType: string) {
  return topLevelType.charAt(3).toLowerCase() + topLevelType.slice(4);
}

function loadReactNativeEventTypes() {
  const bubbling = new Set<string>();
  const skipBubbling = new Set<string>();
  const direct = new Set<string>(manualDirectEventTypes);

  for (const modulePath of viewConfigModules) {
    const module = jest.requireActual(modulePath);
    const viewConfig: ViewConfig = module.__INTERNAL_VIEW_CONFIG ?? module.default;

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

test('event types match React Native view configs', () => {
  const reactNative = loadReactNativeEventTypes();

  expect([...bubblingEventTypes].sort()).toEqual([...reactNative.bubbling].sort());
  expect([...skipBubblingEventTypes].sort()).toEqual([...reactNative.skipBubbling].sort());
  expect([...directEventTypes].sort()).toEqual([...reactNative.direct].sort());
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
