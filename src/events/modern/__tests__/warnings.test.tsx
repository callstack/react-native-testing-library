import * as React from 'react';
import { PanResponder, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';

import { fireEvent, render, screen } from '../../..';
import { configure } from '../../../config';
import { logger } from '../../../helpers/logger';

// Modern `fireEvent` diagnostics, so both Jest projects run these tests in the modern event system.

let warnSpy: jest.SpyInstance;

beforeEach(() => {
  configure({ eventSystem: 'modern', eventDiagnostics: true });
  warnSpy = jest.spyOn(logger, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  warnSpy.mockRestore();
});

/** First line of each warning. */
function getWarnings(): string[] {
  return warnSpy.mock.calls.map(([message]) => message.split('\n')[0]);
}

const emptyEvent = { nativeEvent: {} };

describe('dispatched events', () => {
  test('warns when no element handles a bubbling event', async () => {
    await render(
      <View testID="parent">
        <View testID="child" />
      </View>,
    );

    await fireEvent(screen.getByTestId('child'), 'touchStart', emptyEvent);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "No "onTouchStart" handler found on the element or its ancestors.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <View
          testID="child"
        />"
    `);
  });

  test('does not warn when an ancestor handles a bubbling event', async () => {
    const onTouchStart = jest.fn();
    await render(
      <View onTouchStart={onTouchStart}>
        <View testID="child" />
      </View>,
    );

    await fireEvent(screen.getByTestId('child'), 'touchStart', emptyEvent);

    expect(onTouchStart).toHaveBeenCalledTimes(1);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('does not warn when only a capture handler is called', async () => {
    const onTouchStartCapture = jest.fn();
    // `onTouchStartCapture` is missing from `ViewProps` in RN 0.86 and older
    const captureProps: object = { onTouchStartCapture };
    await render(
      <View {...captureProps}>
        <View testID="child" />
      </View>,
    );

    await fireEvent(screen.getByTestId('child'), 'touchStart', emptyEvent);

    expect(onTouchStartCapture).toHaveBeenCalledTimes(1);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('does not warn when the handler stops propagation', async () => {
    const onParentTouchStart = jest.fn();
    await render(
      <View onTouchStart={onParentTouchStart}>
        <View testID="child" onTouchStart={(event) => event.stopPropagation()} />
      </View>,
    );

    await fireEvent(screen.getByTestId('child'), 'touchStart', emptyEvent);

    expect(onParentTouchStart).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('warns when only an ancestor handles a direct event', async () => {
    await render(
      <View onLayout={jest.fn()}>
        <View testID="child" />
      </View>,
    );

    await fireEvent(screen.getByTestId('child'), 'layout', emptyEvent);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "No "onLayout" handler found on the element.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <View
          testID="child"
        />"
    `);
  });

  test('warns when a layout event without layout has no handler', async () => {
    await render(<View testID="view" />);

    await fireEvent(screen.getByTestId('view'), 'layout', emptyEvent);

    expect(getWarnings()).toEqual(['No "onLayout" handler found on the element.']);
  });

  test('does not warn when a layout event updates native state', async () => {
    await render(<View testID="view" />);

    await fireEvent.layout(screen.getByTestId('view'), { width: 100 });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('warns when no element handles a custom direct event', async () => {
    await render(React.createElement('RNCViewPager', { testID: 'pager' }));

    await fireEvent(screen.getByTestId('pager'), 'pageSelected', {
      dispatch: 'direct',
      nativeEvent: { position: 1 },
    });

    expect(getWarnings()).toEqual(['No "onPageSelected" handler found on the element.']);
  });

  test('warns when no element handles a custom bubbling event', async () => {
    await render(<View testID="map" />);

    await fireEvent(screen.getByTestId('map'), 'markerPress', {
      dispatch: 'bubbling',
      nativeEvent: {},
    });

    expect(getWarnings()).toEqual([
      'No "onMarkerPress" handler found on the element or its ancestors.',
    ]);
  });

  test('warns on the hit target when hit testing moves the event', async () => {
    await render(
      <View testID="parent">
        <View testID="child" pointerEvents="none" />
      </View>,
    );

    await fireEvent(screen.getByTestId('child'), 'touchStart', emptyEvent);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "No "onTouchStart" handler found on the element or its ancestors.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <View
          testID="parent"
        >
          <View
            pointerEvents="none"
            testID="child"
          />
        </View>"
    `);
  });

  test('does not warn when scrolling a ScrollView without handlers, as it updates native state', async () => {
    await render(<ScrollView testID="scroll" />);

    await fireEvent.scroll(screen.getByTestId('scroll'), {
      nativeEvent: { contentOffset: { y: 100 } },
    });

    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('warns when scrolling a View without handlers', async () => {
    await render(<View testID="view" />);

    await fireEvent.scroll(screen.getByTestId('view'));

    expect(getWarnings()).toEqual(['No "onScroll" handler found on the element.']);
  });

  test('does not warn on an unmounted element', async () => {
    await render(
      <View>
        <View testID="view" />
      </View>,
    );
    const view = screen.getByTestId('view');
    await screen.rerender(<View />);

    await fireEvent(view, 'touchStart', emptyEvent);
    await fireEvent.press(view);

    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe('dropped events', () => {
  test('warns when display: none hides the element', async () => {
    await render(
      <View testID="hidden" style={{ display: 'none' }}>
        <View onTouchStart={jest.fn()}>
          <View testID="child" />
        </View>
      </View>,
    );

    await fireEvent(
      screen.getByTestId('child', { includeHiddenElements: true }),
      'touchStart',
      emptyEvent,
    );

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Cannot fire the "touchStart" event on an element hidden by display: none.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <View
          testID="child"
        />

      Hidden by:

        <View
          style={
            {
              "display": "none",
            }
          }
          testID="hidden"
        />"
    `);
  });

  test('reports display: none rather than pointerEvents when both drop the event', async () => {
    await render(
      <View style={{ display: 'none' }} pointerEvents="none">
        <View testID="child" />
      </View>,
    );

    await fireEvent(
      screen.getByTestId('child', { includeHiddenElements: true }),
      'touchStart',
      emptyEvent,
    );

    expect(getWarnings()).toEqual([
      'Cannot fire the "touchStart" event on an element hidden by display: none.',
    ]);
  });

  test('warns when pointerEvents blocks every element', async () => {
    await render(
      <View testID="overlay" pointerEvents="none" onTouchStart={jest.fn()}>
        <View testID="child" />
      </View>,
    );

    await fireEvent(screen.getByTestId('child'), 'touchStart', emptyEvent);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Cannot fire the "touchStart" event on an element blocked by pointerEvents.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <View
          testID="child"
        />

      Blocked by:

        <View
          pointerEvents="none"
          testID="overlay"
        />"
    `);
  });

  test('warns when a text editing event is fired on a non-editable TextInput', async () => {
    await render(<TextInput testID="input" editable={false} onFocus={jest.fn()} />);

    await fireEvent(screen.getByTestId('input'), 'focus', emptyEvent);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Cannot fire the "focus" event on a non-editable TextInput.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <TextInput
          editable={false}
          testID="input"
        />"
    `);
  });

  test('names the nearest TextInput when the event is fired on its nested Text', async () => {
    await render(
      <TextInput testID="input" readOnly>
        <Text testID="text">Text</Text>
      </TextInput>,
    );

    await fireEvent(screen.getByTestId('text'), 'blur', emptyEvent);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Cannot fire the "blur" event on a non-editable TextInput.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <TextInput
          testID="input"
        >
          <Text
            testID="text"
          >
            Text
          </Text>
        </TextInput>"
    `);
  });

  test('names changeText when changing the text of a non-editable TextInput', async () => {
    await render(<TextInput testID="input" editable={false} onChangeText={jest.fn()} />);

    await fireEvent.changeText(screen.getByTestId('input'), 'Hello');

    expect(getWarnings()).toEqual([
      'Cannot fire the "changeText" event on a non-editable TextInput.',
    ]);
  });

  test('warns when changing a disabled Switch', async () => {
    await render(<Switch testID="switch" disabled onChange={jest.fn()} />);

    await fireEvent(screen.getByTestId('switch'), 'change', { nativeEvent: { value: true } });

    expect(getWarnings()).toEqual(['Cannot fire the "change" event on a disabled element.']);
  });
});

describe('changeText', () => {
  test('does not warn when onChangeText is called', async () => {
    const onChangeText = jest.fn();
    await render(<TextInput testID="input" value="" onChangeText={onChangeText} />);

    await fireEvent.changeText(screen.getByTestId('input'), 'Hello');

    expect(onChangeText).toHaveBeenCalledWith('Hello');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('does not warn on an uncontrolled TextInput without handlers, as it updates native state', async () => {
    await render(<TextInput testID="input" />);

    await fireEvent.changeText(screen.getByTestId('input'), 'Hello');

    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('does not warn when an ancestor handles onChange', async () => {
    const onChange = jest.fn();
    await render(
      // @ts-expect-error Host View does not declare `onChange`.
      <View onChange={onChange}>
        <TextInput testID="input" value="" />
      </View>,
    );

    await fireEvent.changeText(screen.getByTestId('input'), 'Hello');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe('press', () => {
  test('warns when pressing a disabled Pressable', async () => {
    await render(
      <Pressable onPress={jest.fn()} disabled>
        <Text>Trigger</Text>
      </Pressable>,
    );

    await fireEvent.press(screen.getByText('Trigger'));

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Cannot fire the "press" event on a disabled element.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <View
          accessibilityState={
            {
              "disabled": true,
            }
          }
          accessible={true}
        >
          <Text>
            Trigger
          </Text>
        </View>"
    `);
  });

  test('warns when firing pressIn on a disabled Pressable', async () => {
    await render(<Pressable testID="pressable" onPressIn={jest.fn()} disabled />);

    await fireEvent(screen.getByTestId('pressable'), 'pressIn', emptyEvent);

    expect(getWarnings()).toEqual(['Cannot fire the "pressIn" event on a disabled element.']);
  });

  test('does not warn when a disabled Pressable passes the press to its enabled parent', async () => {
    const onPress = jest.fn();
    await render(
      <Pressable onPress={onPress}>
        <Pressable onPress={jest.fn()} disabled>
          <Text>Trigger</Text>
        </Pressable>
      </Pressable>,
    );

    await fireEvent.press(screen.getByText('Trigger'));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('warns when the touch responder has no onPress', async () => {
    await render(
      <Pressable onLongPress={jest.fn()}>
        <Text>Trigger</Text>
      </Pressable>,
    );

    await fireEvent.press(screen.getByText('Trigger'));

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "No "onPress" handler found on the touch responder.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <View
          accessible={true}
        >
          <Text>
            Trigger
          </Text>
        </View>"
    `);
  });

  test('warns when no element handles the press', async () => {
    await render(
      <View>
        <Text>Trigger</Text>
      </View>,
    );

    await fireEvent.press(screen.getByText('Trigger'));

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "No "onPress" handler found on the element or its ancestors.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <Text>
          Trigger
        </Text>"
    `);
  });

  test('warns when pointerEvents blocks the Pressable', async () => {
    await render(
      <View testID="overlay" pointerEvents="none">
        <Pressable onPress={jest.fn()}>
          <Text>Trigger</Text>
        </Pressable>
      </View>,
    );

    await fireEvent.press(screen.getByText('Trigger'));

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Cannot fire the "press" event on an element blocked by pointerEvents.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <View
          accessible={true}
        >
          <Text>
            Trigger
          </Text>
        </View>

      Blocked by:

        <View
          pointerEvents="none"
          testID="overlay"
        />"
    `);
  });

  test('warns when pointerEvents moves the touch past the Pressable to an element without handlers', async () => {
    await render(
      <View>
        <Pressable onPress={jest.fn()} pointerEvents="none">
          <Text>Trigger</Text>
        </Pressable>
      </View>,
    );

    await fireEvent.press(screen.getByText('Trigger'));

    expect(getWarnings()).toEqual([
      'Cannot fire the "press" event on an element blocked by pointerEvents.',
    ]);
  });

  test('warns when pointerEvents blocks an element without handlers', async () => {
    await render(
      <View pointerEvents="none">
        <Text>Trigger</Text>
      </View>,
    );

    await fireEvent.press(screen.getByText('Trigger'));

    expect(getWarnings()).toEqual([
      'Cannot fire the "press" event on an element blocked by pointerEvents.',
    ]);
  });

  test('warns when display: none hides the Pressable', async () => {
    await render(
      <View testID="hidden" style={{ display: 'none' }}>
        <Pressable onPress={jest.fn()}>
          <Text>Trigger</Text>
        </Pressable>
      </View>,
    );

    await fireEvent.press(screen.getByText('Trigger', { includeHiddenElements: true }));

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Cannot fire the "press" event on an element hidden by display: none.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <Text>
          Trigger
        </Text>

      Hidden by:

        <View
          style={
            {
              "display": "none",
            }
          }
          testID="hidden"
        />"
    `);
  });

  test('warns about the disabled Pressable when its parent responder has no onPress', async () => {
    await render(
      <Pressable onLongPress={jest.fn()}>
        <Pressable onPress={jest.fn()} disabled>
          <Text>Trigger</Text>
        </Pressable>
      </Pressable>,
    );

    await fireEvent.press(screen.getByText('Trigger'));

    expect(getWarnings()).toEqual(['Cannot fire the "press" event on a disabled element.']);
  });

  test('warns about pointerEvents when the parent responder has no onPress', async () => {
    await render(
      <Pressable onLongPress={jest.fn()}>
        <Pressable onPress={jest.fn()} pointerEvents="none">
          <Text>Trigger</Text>
        </Pressable>
      </Pressable>,
    );

    await fireEvent.press(screen.getByText('Trigger'));

    expect(getWarnings()).toEqual([
      'Cannot fire the "press" event on an element blocked by pointerEvents.',
    ]);
  });

  test('does not warn when a custom responder declines the touch', async () => {
    await render(
      <View onStartShouldSetResponder={() => false}>
        <Text>Trigger</Text>
      </View>,
    );

    await fireEvent.press(screen.getByText('Trigger'));

    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('does not warn when a responder without Pressability claims the touch', async () => {
    const panResponder = PanResponder.create({ onStartShouldSetPanResponder: () => true });
    await render(
      <View {...panResponder.panHandlers}>
        <Text>Trigger</Text>
      </View>,
    );

    await fireEvent.press(screen.getByText('Trigger'));

    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('warns when a TextInput responder has no onPress', async () => {
    await render(<TextInput testID="input" />);

    await fireEvent.press(screen.getByTestId('input'));

    expect(getWarnings()).toEqual(['No "onPress" handler found on the touch responder.']);
  });
});

test('does not warn when eventDiagnostics is turned off', async () => {
  configure({ eventDiagnostics: false });
  await render(
    <View>
      <View testID="plain" />
      <View style={{ display: 'none' }}>
        <View testID="hidden" />
      </View>
      <View pointerEvents="none">
        <View testID="blocked" />
      </View>
      <TextInput testID="input" editable={false} />
      <Switch testID="switch" disabled />
      <Pressable onPress={jest.fn()} disabled>
        <Text>Disabled</Text>
      </Pressable>
      <Pressable onLongPress={jest.fn()}>
        <Text>Long press only</Text>
      </Pressable>
    </View>,
  );

  await fireEvent(screen.getByTestId('plain'), 'touchStart', emptyEvent);
  await fireEvent(screen.getByTestId('plain'), 'focus', emptyEvent);
  await fireEvent(
    screen.getByTestId('hidden', { includeHiddenElements: true }),
    'touchStart',
    emptyEvent,
  );
  await fireEvent(screen.getByTestId('blocked'), 'touchStart', emptyEvent);
  await fireEvent(screen.getByTestId('input'), 'focus', emptyEvent);
  await fireEvent.changeText(screen.getByTestId('input'), 'Hello');
  await fireEvent(screen.getByTestId('switch'), 'change', { nativeEvent: { value: true } });
  await fireEvent.press(screen.getByTestId('plain'));
  await fireEvent.press(screen.getByTestId('hidden', { includeHiddenElements: true }));
  await fireEvent.press(screen.getByTestId('blocked'));
  await fireEvent.press(screen.getByText('Disabled'));
  await fireEvent.press(screen.getByText('Long press only'));

  expect(warnSpy).not.toHaveBeenCalled();
});
