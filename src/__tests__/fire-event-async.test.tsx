import * as React from 'react';
import {
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { fireEventAsync, render, screen, waitFor } from '..';

type OnPressComponentProps = {
  onPress: () => void;
  text: string;
};
const OnPressComponent = ({ onPress, text }: OnPressComponentProps) => (
  <View>
    <TouchableOpacity onPress={onPress}>
      <Text>{text}</Text>
    </TouchableOpacity>
  </View>
);

type CustomEventComponentProps = {
  onCustomEvent: () => void;
};
const CustomEventComponent = ({ onCustomEvent }: CustomEventComponentProps) => (
  <TouchableOpacity onPress={onCustomEvent}>
    <Text>Custom event component</Text>
  </TouchableOpacity>
);

type MyCustomButtonProps = {
  handlePress: () => void;
  text: string;
};
const MyCustomButton = ({ handlePress, text }: MyCustomButtonProps) => (
  <OnPressComponent onPress={handlePress} text={text} />
);

type CustomEventComponentWithCustomNameProps = {
  handlePress: () => void;
};
const CustomEventComponentWithCustomName = ({
  handlePress,
}: CustomEventComponentWithCustomNameProps) => (
  <MyCustomButton handlePress={handlePress} text="Custom component" />
);

describe('fireEventAsync', () => {
  test('should invoke specified event', async () => {
    const onPressMock = jest.fn();
    render(<OnPressComponent onPress={onPressMock} text="Press me" />);

    await fireEventAsync(screen.getByText('Press me'), 'press');

    expect(onPressMock).toHaveBeenCalled();
  });

  test('should invoke specified event on parent element', async () => {
    const onPressMock = jest.fn();
    const text = 'New press text';
    render(<OnPressComponent onPress={onPressMock} text={text} />);

    await fireEventAsync(screen.getByText(text), 'press');
    expect(onPressMock).toHaveBeenCalled();
  });

  test('should invoke event with custom name', async () => {
    const handlerMock = jest.fn();
    const EVENT_DATA = 'event data';

    render(
      <View>
        <CustomEventComponent onCustomEvent={handlerMock} />
      </View>,
    );

    await fireEventAsync(screen.getByText('Custom event component'), 'customEvent', EVENT_DATA);

    expect(handlerMock).toHaveBeenCalledWith(EVENT_DATA);
  });
});

test('fireEventAsync.press', async () => {
  const onPressMock = jest.fn();
  const text = 'Fireevent press';
  const eventData = {
    nativeEvent: {
      pageX: 20,
      pageY: 30,
    },
  };
  render(<OnPressComponent onPress={onPressMock} text={text} />);

  await fireEventAsync.press(screen.getByText(text), eventData);

  expect(onPressMock).toHaveBeenCalledWith(eventData);
});

test('fireEventAsync.scroll', async () => {
  const onScrollMock = jest.fn();
  const eventData = {
    nativeEvent: {
      contentOffset: {
        y: 200,
      },
    },
  };

  render(
    <ScrollView onScroll={onScrollMock}>
      <Text>XD</Text>
    </ScrollView>,
  );

  await fireEventAsync.scroll(screen.getByText('XD'), eventData);

  expect(onScrollMock).toHaveBeenCalledWith(eventData);
});

test('fireEventAsync.changeText', async () => {
  const onChangeTextMock = jest.fn();

  render(
    <View>
      <TextInput placeholder="Customer placeholder" onChangeText={onChangeTextMock} />
    </View>,
  );

  const input = screen.getByPlaceholderText('Customer placeholder');
  await fireEventAsync.changeText(input, 'content');
  expect(onChangeTextMock).toHaveBeenCalledWith('content');
});

it('sets native state value for unmanaged text inputs', async () => {
  render(<TextInput testID="input" />);

  const input = screen.getByTestId('input');
  expect(input).toHaveDisplayValue('');

  await fireEventAsync.changeText(input, 'abc');
  expect(input).toHaveDisplayValue('abc');
});

test('custom component with custom event name', async () => {
  const handlePress = jest.fn();

  render(<CustomEventComponentWithCustomName handlePress={handlePress} />);

  await fireEventAsync(screen.getByText('Custom component'), 'handlePress');

  expect(handlePress).toHaveBeenCalled();
});

test('event with multiple handler parameters', async () => {
  const handlePress = jest.fn();

  render(<CustomEventComponentWithCustomName handlePress={handlePress} />);

  await fireEventAsync(screen.getByText('Custom component'), 'handlePress', 'param1', 'param2');

  expect(handlePress).toHaveBeenCalledWith('param1', 'param2');
});

test('should not fire on disabled TouchableOpacity', async () => {
  const handlePress = jest.fn();
  render(
    <View>
      <TouchableOpacity onPress={handlePress} disabled={true}>
        <Text>Trigger</Text>
      </TouchableOpacity>
    </View>,
  );

  await fireEventAsync.press(screen.getByText('Trigger'));
  expect(handlePress).not.toHaveBeenCalled();
});

test('should not fire on disabled Pressable', async () => {
  const handlePress = jest.fn();
  render(
    <View>
      <Pressable onPress={handlePress} disabled={true}>
        <Text>Trigger</Text>
      </Pressable>
    </View>,
  );

  await fireEventAsync.press(screen.getByText('Trigger'));
  expect(handlePress).not.toHaveBeenCalled();
});

test('should not fire inside View with pointerEvents="none"', async () => {
  const onPress = jest.fn();
  render(
    <View pointerEvents="none">
      <Pressable onPress={onPress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>,
  );

  await fireEventAsync.press(screen.getByText('Trigger'));
  await fireEventAsync(screen.getByText('Trigger'), 'onPress');
  expect(onPress).not.toHaveBeenCalled();
});

test('should not fire inside View with pointerEvents="box-only"', async () => {
  const onPress = jest.fn();
  render(
    <View pointerEvents="box-only">
      <Pressable onPress={onPress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>,
  );

  await fireEventAsync.press(screen.getByText('Trigger'));
  await fireEventAsync(screen.getByText('Trigger'), 'onPress');
  expect(onPress).not.toHaveBeenCalled();
});

test('should fire inside View with pointerEvents="box-none"', async () => {
  const onPress = jest.fn();
  render(
    <View pointerEvents="box-none">
      <Pressable onPress={onPress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>,
  );

  await fireEventAsync.press(screen.getByText('Trigger'));
  await fireEventAsync(screen.getByText('Trigger'), 'onPress');
  expect(onPress).toHaveBeenCalledTimes(2);
});

test('should fire inside View with pointerEvents="auto"', async () => {
  const onPress = jest.fn();
  render(
    <View pointerEvents="auto">
      <Pressable onPress={onPress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>,
  );

  await fireEventAsync.press(screen.getByText('Trigger'));
  await fireEventAsync(screen.getByText('Trigger'), 'onPress');
  expect(onPress).toHaveBeenCalledTimes(2);
});

test('should not fire deeply inside View with pointerEvents="box-only"', async () => {
  const onPress = jest.fn();
  render(
    <View pointerEvents="box-only">
      <View>
        <Pressable onPress={onPress}>
          <Text>Trigger</Text>
        </Pressable>
      </View>
    </View>,
  );

  await fireEventAsync.press(screen.getByText('Trigger'));
  await fireEventAsync(screen.getByText('Trigger'), 'onPress');
  expect(onPress).not.toHaveBeenCalled();
});

test('should fire non-pointer events inside View with pointerEvents="box-none"', async () => {
  const onTouchStart = jest.fn();
  render(<View testID="view" pointerEvents="box-none" onTouchStart={onTouchStart} />);

  await fireEventAsync(screen.getByTestId('view'), 'touchStart');
  expect(onTouchStart).toHaveBeenCalled();
});

test('should fire non-touch events inside View with pointerEvents="box-none"', async () => {
  const onLayout = jest.fn();
  render(<View testID="view" pointerEvents="box-none" onLayout={onLayout} />);

  await fireEventAsync(screen.getByTestId('view'), 'layout');
  expect(onLayout).toHaveBeenCalled();
});

// This test if pointerEvents="box-only" on composite `Pressable` is blocking
// the 'press' event on host View rendered by pressable.
test('should fire on Pressable with pointerEvents="box-only', async () => {
  const onPress = jest.fn();
  render(<Pressable testID="pressable" pointerEvents="box-only" onPress={onPress} />);

  await fireEventAsync.press(screen.getByTestId('pressable'));
  expect(onPress).toHaveBeenCalled();
});

test('should pass event up on disabled TouchableOpacity', async () => {
  const handleInnerPress = jest.fn();
  const handleOuterPress = jest.fn();
  render(
    <TouchableOpacity onPress={handleOuterPress}>
      <TouchableOpacity onPress={handleInnerPress} disabled={true}>
        <Text>Inner Trigger</Text>
      </TouchableOpacity>
    </TouchableOpacity>,
  );

  await fireEventAsync.press(screen.getByText('Inner Trigger'));
  expect(handleInnerPress).not.toHaveBeenCalled();
  expect(handleOuterPress).toHaveBeenCalledTimes(1);
});

test('should pass event up on disabled Pressable', async () => {
  const handleInnerPress = jest.fn();
  const handleOuterPress = jest.fn();
  render(
    <Pressable onPress={handleOuterPress}>
      <Pressable onPress={handleInnerPress} disabled={true}>
        <Text>Inner Trigger</Text>
      </Pressable>
    </Pressable>,
  );

  await fireEventAsync.press(screen.getByText('Inner Trigger'));
  expect(handleInnerPress).not.toHaveBeenCalled();
  expect(handleOuterPress).toHaveBeenCalledTimes(1);
});

type TestComponentProps = {
  onPress: () => void;
  disabled?: boolean;
};
const TestComponent = ({ onPress }: TestComponentProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>Trigger Test</Text>
    </TouchableOpacity>
  );
};

test('is not fooled by non-native disabled prop', async () => {
  const handlePress = jest.fn();
  render(<TestComponent onPress={handlePress} disabled={true} />);

  await fireEventAsync.press(screen.getByText('Trigger Test'));
  expect(handlePress).toHaveBeenCalledTimes(1);
});

type TestChildTouchableComponentProps = {
  onPress: () => void;
  someProp: boolean;
};

function TestChildTouchableComponent({ onPress, someProp }: TestChildTouchableComponentProps) {
  return (
    <View>
      <TouchableOpacity onPress={onPress} disabled={someProp}>
        <Text>Trigger</Text>
      </TouchableOpacity>
    </View>
  );
}

test('is not fooled by non-responder wrapping host elements', async () => {
  const handlePress = jest.fn();

  render(
    <View>
      <TestChildTouchableComponent onPress={handlePress} someProp={true} />
    </View>,
  );

  await fireEventAsync.press(screen.getByText('Trigger'));
  expect(handlePress).not.toHaveBeenCalled();
});

type TestDraggableComponentProps = { onDrag: () => void };

function TestDraggableComponent({ onDrag }: TestDraggableComponentProps) {
  const responderHandlers = PanResponder.create({
    onMoveShouldSetPanResponder: (_evt, _gestureState) => true,
    onPanResponderMove: onDrag,
  }).panHandlers;

  return (
    <View {...responderHandlers}>
      <Text>Trigger</Text>
    </View>
  );
}

test('has only onMove', async () => {
  const handleDrag = jest.fn();

  render(<TestDraggableComponent onDrag={handleDrag} />);

  await fireEventAsync(screen.getByText('Trigger'), 'responderMove', {
    touchHistory: { mostRecentTimeStamp: '2', touchBank: [] },
  });
  expect(handleDrag).toHaveBeenCalled();
});

// Those events ideally should be triggered through `fireEventAsync.scroll`, but they are handled at the
// native level, so we need to support manually triggering them
describe('native events', () => {
  test('triggers onScrollBeginDrag', async () => {
    const onScrollBeginDragSpy = jest.fn();
    render(<ScrollView testID="test-id" onScrollBeginDrag={onScrollBeginDragSpy} />);

    await fireEventAsync(screen.getByTestId('test-id'), 'onScrollBeginDrag');
    expect(onScrollBeginDragSpy).toHaveBeenCalled();
  });

  test('triggers onScrollEndDrag', async () => {
    const onScrollEndDragSpy = jest.fn();
    render(<ScrollView testID="test-id" onScrollEndDrag={onScrollEndDragSpy} />);

    await fireEventAsync(screen.getByTestId('test-id'), 'onScrollEndDrag');
    expect(onScrollEndDragSpy).toHaveBeenCalled();
  });

  test('triggers onMomentumScrollBegin', async () => {
    const onMomentumScrollBeginSpy = jest.fn();
    render(<ScrollView testID="test-id" onMomentumScrollBegin={onMomentumScrollBeginSpy} />);

    await fireEventAsync(screen.getByTestId('test-id'), 'onMomentumScrollBegin');
    expect(onMomentumScrollBeginSpy).toHaveBeenCalled();
  });

  test('triggers onMomentumScrollEnd', async () => {
    const onMomentumScrollEndSpy = jest.fn();
    render(<ScrollView testID="test-id" onMomentumScrollEnd={onMomentumScrollEndSpy} />);

    await fireEventAsync(screen.getByTestId('test-id'), 'onMomentumScrollEnd');
    expect(onMomentumScrollEndSpy).toHaveBeenCalled();
  });
});

describe('React.Suspense integration', () => {
  let mockPromise: Promise<string>;
  let resolveMockPromise: (value: string) => void;

  beforeEach(() => {
    mockPromise = new Promise((resolve) => {
      resolveMockPromise = resolve;
    });
  });

  type AsyncComponentProps = {
    onPress: () => void;
    shouldSuspend: boolean;
  };

  function AsyncComponent({ onPress, shouldSuspend }: AsyncComponentProps) {
    if (shouldSuspend) {
      throw mockPromise;
    }

    return (
      <TouchableOpacity onPress={onPress}>
        <Text>Async Component Loaded</Text>
      </TouchableOpacity>
    );
  }

  function SuspenseWrapper({ children }: { children: React.ReactNode }) {
    return <React.Suspense fallback={<Text>Loading...</Text>}>{children}</React.Suspense>;
  }

  test('should handle events after Suspense resolves', async () => {
    const onPressMock = jest.fn();

    render(
      <SuspenseWrapper>
        <AsyncComponent onPress={onPressMock} shouldSuspend={true} />
      </SuspenseWrapper>,
    );

    // Initially shows fallback
    expect(screen.getByText('Loading...')).toBeTruthy();

    // Resolve the promise
    resolveMockPromise('loaded');
    await waitFor(() => {
      screen.rerender(
        <SuspenseWrapper>
          <AsyncComponent onPress={onPressMock} shouldSuspend={false} />
        </SuspenseWrapper>,
      );
    });

    // Component should be loaded now
    await waitFor(() => {
      expect(screen.getByText('Async Component Loaded')).toBeTruthy();
    });

    // fireEventAsync should work on the resolved component
    await fireEventAsync.press(screen.getByText('Async Component Loaded'));
    expect(onPressMock).toHaveBeenCalled();
  });

  test('should handle events on Suspense fallback components', async () => {
    const fallbackPressMock = jest.fn();

    function InteractiveFallback() {
      return (
        <TouchableOpacity onPress={fallbackPressMock}>
          <Text>Loading with button...</Text>
        </TouchableOpacity>
      );
    }

    render(
      <React.Suspense fallback={<InteractiveFallback />}>
        <AsyncComponent onPress={jest.fn()} shouldSuspend={true} />
      </React.Suspense>,
    );

    // Should be able to interact with fallback
    expect(screen.getByText('Loading with button...')).toBeTruthy();

    await fireEventAsync.press(screen.getByText('Loading with button...'));
    expect(fallbackPressMock).toHaveBeenCalled();
  });

  test('should work with nested Suspense boundaries', async () => {
    const outerPressMock = jest.fn();
    const innerPressMock = jest.fn();

    type NestedAsyncProps = {
      onPress: () => void;
      shouldSuspend: boolean;
      level: string;
    };

    function NestedAsync({ onPress, shouldSuspend, level }: NestedAsyncProps) {
      if (shouldSuspend) {
        throw mockPromise;
      }

      return (
        <TouchableOpacity onPress={onPress}>
          <Text>{level} Component Loaded</Text>
        </TouchableOpacity>
      );
    }

    const { rerender } = render(
      <React.Suspense fallback={<Text>Outer Loading...</Text>}>
        <NestedAsync onPress={outerPressMock} shouldSuspend={false} level="Outer" />
        <React.Suspense fallback={<Text>Inner Loading...</Text>}>
          <NestedAsync onPress={innerPressMock} shouldSuspend={true} level="Inner" />
        </React.Suspense>
      </React.Suspense>,
    );

    // Outer component should be loaded, inner should show fallback
    expect(screen.getByText('Outer Component Loaded')).toBeTruthy();
    expect(screen.getByText('Inner Loading...')).toBeTruthy();

    // Should be able to interact with outer component
    await fireEventAsync.press(screen.getByText('Outer Component Loaded'));
    expect(outerPressMock).toHaveBeenCalled();

    // Resolve inner component
    resolveMockPromise('inner-loaded');
    await waitFor(() => {
      rerender(
        <React.Suspense fallback={<Text>Outer Loading...</Text>}>
          <NestedAsync onPress={outerPressMock} shouldSuspend={false} level="Outer" />
          <React.Suspense fallback={<Text>Inner Loading...</Text>}>
            <NestedAsync onPress={innerPressMock} shouldSuspend={false} level="Inner" />
          </React.Suspense>
        </React.Suspense>,
      );
    });

    // Both components should be loaded now
    await waitFor(() => {
      expect(screen.getByText('Inner Component Loaded')).toBeTruthy();
    });

    // Should be able to interact with inner component
    await fireEventAsync.press(screen.getByText('Inner Component Loaded'));
    expect(innerPressMock).toHaveBeenCalled();
  });

  test('should work when events cause components to suspend', async () => {
    const onPressMock = jest.fn();
    let shouldSuspend = false;

    function DataComponent() {
      if (shouldSuspend) {
        throw mockPromise; // This will cause suspense
      }
      return <Text>Data loaded</Text>;
    }

    function ButtonComponent() {
      return (
        <TouchableOpacity
          onPress={() => {
            onPressMock();
            shouldSuspend = true; // This will cause DataComponent to suspend on next render
          }}
        >
          <Text>Load Data</Text>
        </TouchableOpacity>
      );
    }

    render(
      <View>
        <ButtonComponent />
        <React.Suspense fallback={<Text>Loading data...</Text>}>
          <DataComponent />
        </React.Suspense>
      </View>,
    );

    // Initially data is loaded
    expect(screen.getByText('Data loaded')).toBeTruthy();

    // Click button - this triggers the state change that will cause suspension
    await fireEventAsync.press(screen.getByText('Load Data'));
    expect(onPressMock).toHaveBeenCalled();

    // Rerender - now DataComponent should suspend
    screen.rerender(
      <View>
        <ButtonComponent />
        <React.Suspense fallback={<Text>Loading data...</Text>}>
          <DataComponent />
        </React.Suspense>
      </View>,
    );

    // Should show loading fallback
    expect(screen.getByText('Loading data...')).toBeTruthy();
  });
});
