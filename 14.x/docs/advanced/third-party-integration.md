# Third-Party Library Integration

The React Native Testing Library is designed to simulate the core behaviors of React Native. However, it does not replicate the internal logic of third-party libraries. This guide explains how to integrate your library with RNTL.

## Handling Events in Third-Party Libraries

RNTL provides two subsystems to simulate events:

- **Fire Event**: A lightweight simulation system that can trigger event handlers defined on both host and composite components.
- **User Event**: A more realistic interaction simulation system that can trigger event handlers defined only on host components.

In many third-party libraries, event handling involves native code, which means RNTL cannot fully simulate the event flow, as it runs only JavaScript code. To address this limitation, you can use `testOnly_on*` props on host components to expose custom events to RNTL’s event subsystems. Both subsystems will first attempt to locate the standard `on*` event handlers; if these are not available, they fall back to the `testOnly_on*` handlers.

### Example: React Native Gesture Handler

React Native Gesture Handler (RNGH) provides a composite [Pressable](https://docs.swmansion.com/react-native-gesture-handler/docs/components/pressable/) component with `onPress*` props. These event handlers are not exposed on the rendered host views; instead, they are invoked via RNGH’s internal event flow, which involves native modules. As a result, they are not accessible to RNTL’s event subsystems.

To enable RNTL to interact with RNGH’s `Pressable` component, the library exposes `testOnly_onPress*` props on the `NativeButton` host component rendered by `Pressable`. This adjustment allows RNTL to simulate interactions during testing.

```tsx title="Simplified RNGH Pressable component"
function Pressable({ onPress, onPressIn, onPressOut, onLongPress, ... }) {

  // Component logic...

  const isTestEnv = process.env.NODE_ENV === 'test';

  return (
    <GestureDetector gesture={gesture}>
      <NativeButton
        /* Other props... */
        testOnly_onPress={isTestEnv ? onPress : undefined}
        testOnly_onPressIn={isTestEnv ? onPressIn : undefined}
        testOnly_onPressOut={isTestEnv ? onPressOut : undefined}
        testOnly_onLongPress={isTestEnv ? onLongPress : undefined}
      />
    </GestureDetector>
  );
}
```
