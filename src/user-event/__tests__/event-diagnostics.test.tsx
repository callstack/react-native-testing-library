import * as React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { render, screen, userEvent } from '../..';
import { configure } from '../../config';
import { logger } from '../../helpers/logger';

let warnSpy: jest.SpyInstance;

beforeEach(() => {
  configure({ eventDiagnostics: true });
  warnSpy = jest.spyOn(logger, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  warnSpy.mockRestore();
});

test('warns when pressing a disabled element', async () => {
  await render(
    <Pressable onPress={jest.fn()} disabled={true}>
      <Text>Trigger</Text>
    </Pressable>,
  );
  const user = userEvent.setup();

  await user.press(screen.getByText('Trigger'));

  expect(warnSpy).toHaveBeenCalledTimes(1);
  expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
    "press() did not call any event handlers. The element is disabled.
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

test('warns when no element handles the press', async () => {
  await render(
    <View>
      <Text>Trigger</Text>
    </View>,
  );
  const user = userEvent.setup();

  await user.press(screen.getByText('Trigger'));

  expect(warnSpy).toHaveBeenCalledTimes(1);
  expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
    "press() did not call any event handlers. The element and its ancestors have no handlers for this interaction.
    If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

      <Text>
        Trigger
      </Text>"
  `);
});

test('warns when none of the dispatched events has a handler', async () => {
  // `longPress` dispatches `pressIn`, `longPress` and `pressOut`, but not `press`.
  // @ts-expect-error Host View does not declare `onPress`.
  await render(<View testID="view" onPress={jest.fn()} />);
  const user = userEvent.setup();

  await user.longPress(screen.getByTestId('view'));

  expect(warnSpy).toHaveBeenCalledTimes(1);
  expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
    "longPress() did not call any event handlers. The element has no handler for the "pressIn", "longPress" or "pressOut" events.
    If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

      <View
        testID="view"
      />"
  `);
});

test('warns when pulling to refresh without an onRefresh handler', async () => {
  await render(<ScrollView testID="view" />);
  const user = userEvent.setup();

  await user.pullToRefresh(screen.getByTestId('view'));

  expect(warnSpy).toHaveBeenCalledTimes(1);
  expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
    "pullToRefresh() did not call any event handlers. The element has no handler for the "refresh" event.
    If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

      <RCTScrollView
        testID="view"
      >
        <View />
      </RCTScrollView>"
  `);
});

test('warns when triggering an accessibility action without a handler', async () => {
  // Missing `onAccessibilityAction` is the case under test.
  // eslint-disable-next-line react-native-a11y/has-valid-accessibility-actions
  await render(<View testID="view" accessibilityActions={[{ name: 'activate' }]} />);
  const user = userEvent.setup();

  await user.accessibilityAction(screen.getByTestId('view'), 'activate');

  expect(warnSpy).toHaveBeenCalledTimes(1);
  expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
    "accessibilityAction() did not call any event handlers. The element has no handler for the "accessibilityAction" event.
    If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

      <View
        testID="view"
      />"
  `);
});

test('does not warn when at least one event calls a handler', async () => {
  // `press` dispatches `pressIn`, `pressOut` and `press`, and only `pressIn` has a handler.
  const onPressIn = jest.fn();
  // @ts-expect-error Host View does not declare `onPressIn`.
  await render(<View testID="view" onPressIn={onPressIn} />);
  const user = userEvent.setup();

  await user.press(screen.getByTestId('view'));

  expect(onPressIn).toHaveBeenCalledTimes(1);
  expect(warnSpy).not.toHaveBeenCalled();
});

test('does not warn when the interaction updates native state (uncontrolled TextInput)', async () => {
  await render(<TextInput testID="input" />);
  const user = userEvent.setup();

  await user.type(screen.getByTestId('input'), 'Hello');
  await user.clear(screen.getByTestId('input'));
  await user.paste(screen.getByTestId('input'), 'World');

  expect(warnSpy).not.toHaveBeenCalled();
});

test('warns when typing into a non-editable TextInput', async () => {
  await render(<TextInput testID="input" editable={false} onChangeText={jest.fn()} />);
  const user = userEvent.setup();

  await user.type(screen.getByTestId('input'), 'Hello');

  expect(warnSpy).toHaveBeenCalledTimes(1);
  expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
    "type() did not call any event handlers. The element is disabled.
    If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

      <TextInput
        editable={false}
        testID="input"
      />"
  `);
});

test('warns when clearing or pasting into a non-editable TextInput', async () => {
  await render(<TextInput testID="input" editable={false} onChangeText={jest.fn()} />);
  const user = userEvent.setup();

  await user.clear(screen.getByTestId('input'));
  await user.paste(screen.getByTestId('input'), 'Hello');

  expect(warnSpy).toHaveBeenCalledTimes(2);
  expect(warnSpy.mock.calls[0][0]).toMatch(
    /^clear\(\) did not call any event handlers\. The element is disabled\./,
  );
  expect(warnSpy.mock.calls[1][0]).toMatch(
    /^paste\(\) did not call any event handlers\. The element is disabled\./,
  );
});

test('warns when typing into a TextInput blocked by pointerEvents="none"', async () => {
  await render(
    <View testID="overlay" pointerEvents="none">
      <TextInput testID="input" onChangeText={jest.fn()} />
    </View>,
  );
  const user = userEvent.setup();

  await user.type(screen.getByTestId('input'), 'Hello');

  expect(warnSpy).toHaveBeenCalledTimes(1);
  expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
    "type() did not call any event handlers. The element is blocked by pointerEvents.
    If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

      <TextInput
        testID="input"
      />

    Blocked by:

      <View
        pointerEvents="none"
        testID="overlay"
      />"
  `);
});

test('warns when the press is blocked by pointerEvents="none"', async () => {
  await render(
    <View testID="overlay" pointerEvents="none">
      <Pressable onPress={jest.fn()}>
        <Text>Trigger</Text>
      </Pressable>
    </View>,
  );
  const user = userEvent.setup();

  await user.press(screen.getByText('Trigger'));

  expect(warnSpy).toHaveBeenCalledTimes(1);
  expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
    "press() did not call any event handlers. The element is blocked by pointerEvents.
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

test('reports pointerEvents rather than disabled when both block the interaction', async () => {
  await render(
    <View testID="overlay" pointerEvents="none">
      <Pressable onPress={jest.fn()} disabled={true}>
        <Text>Trigger</Text>
      </Pressable>
      <TextInput testID="input" editable={false} onChangeText={jest.fn()} />
    </View>,
  );
  const user = userEvent.setup();

  await user.press(screen.getByText('Trigger'));
  await user.type(screen.getByTestId('input'), 'Hello');

  expect(warnSpy).toHaveBeenCalledTimes(2);
  expect(warnSpy.mock.calls[0][0]).toMatch(
    /^press\(\) did not call any event handlers\. The element is blocked by pointerEvents\./,
  );
  expect(warnSpy.mock.calls[1][0]).toMatch(
    /^type\(\) did not call any event handlers\. The element is blocked by pointerEvents\./,
  );
});

test('does not warn when the responder declines the touch', async () => {
  const onResponderGrant = jest.fn();
  await render(
    <View
      testID="view"
      onStartShouldSetResponder={() => false}
      onResponderGrant={onResponderGrant}
    />,
  );
  const user = userEvent.setup();

  await user.press(screen.getByTestId('view'));

  expect(onResponderGrant).not.toHaveBeenCalled();
  expect(warnSpy).not.toHaveBeenCalled();
});

test('does not warn when scrolling a ScrollView without scroll handlers', async () => {
  // `scrollTo` always updates the content offset in native state.
  await render(<ScrollView testID="view" />);
  const user = userEvent.setup();

  await user.scrollTo(screen.getByTestId('view'), { y: 100 });

  expect(warnSpy).not.toHaveBeenCalled();
});

test('does not warn when eventDiagnostics is turned off', async () => {
  configure({ eventDiagnostics: false });
  await render(
    <View>
      <Pressable onPress={jest.fn()} disabled={true}>
        <Text>Disabled</Text>
      </Pressable>
      <Text>No handler</Text>
    </View>,
  );
  const user = userEvent.setup();

  await user.press(screen.getByText('Disabled'));
  await user.press(screen.getByText('No handler'));

  expect(warnSpy).not.toHaveBeenCalled();
});
