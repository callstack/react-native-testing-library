import * as React from 'react';
import type { TextInputProps } from 'react-native';
import { TextInput, View } from 'react-native';

import { render, screen, userEvent } from '../..';
import { getConfig } from '../../config';
import { createEventLogger, getEventsNames } from '../../test-utils/events';

beforeEach(() => {
  jest.useRealTimers();
});

async function renderTextInputWithToolkit(props: TextInputProps = {}) {
  const { events, logEvent } = createEventLogger();

  await render(
    <TextInput
      testID="input"
      onFocus={logEvent('focus')}
      onBlur={logEvent('blur')}
      onPressIn={logEvent('pressIn')}
      onPressOut={logEvent('pressOut')}
      onChange={logEvent('change')}
      onChangeText={logEvent('changeText')}
      onKeyPress={logEvent('keyPress')}
      onSelectionChange={logEvent('selectionChange')}
      onSubmitEditing={logEvent('submitEditing')}
      onEndEditing={logEvent('endEditing')}
      onContentSizeChange={logEvent('contentSizeChange')}
      {...props}
    />,
  );

  const textInput = screen.getByTestId('input');

  return {
    events,
    textInput,
  };
}

describe('paste()', () => {
  test('paste on empty text input', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => 100100100100);
    const { textInput, events } = await renderTextInputWithToolkit();

    const user = userEvent.setup();
    await user.paste(textInput, 'Hi!');

    expect(getEventsNames(events)).toEqual([
      'focus',
      'selectionChange',
      'change',
      'changeText',
      'selectionChange',
      'endEditing',
      'blur',
    ]);

    expect(events).toMatchSnapshot();
  });

  test('paste on filled text input', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => 100100100100);
    const { textInput, events } = await renderTextInputWithToolkit({
      value: 'Hello!',
    });

    const user = userEvent.setup();
    await user.paste(textInput, 'Hi!');

    expect(getEventsNames(events)).toEqual([
      'focus',
      'selectionChange',
      'change',
      'changeText',
      'selectionChange',
      'endEditing',
      'blur',
    ]);

    expect(events).toMatchSnapshot();
  });

  test.each(['modern', 'legacy'])('works with %s fake timers', async (type) => {
    jest.useFakeTimers({ legacyFakeTimers: type === 'legacy' });
    const { textInput, events } = await renderTextInputWithToolkit({
      value: 'Hello!',
    });

    const user = userEvent.setup();
    await user.paste(textInput, 'Hi!');

    expect(getEventsNames(events)).toEqual([
      'focus',
      'selectionChange',
      'change',
      'changeText',
      'selectionChange',
      'endEditing',
      'blur',
    ]);
  });

  test('supports defaultValue prop', async () => {
    const { textInput, events } = await renderTextInputWithToolkit({
      defaultValue: 'Hello Default!',
    });

    const user = userEvent.setup();
    await user.paste(textInput, 'Hi!');

    expect(getEventsNames(events)).toEqual([
      'focus',
      'selectionChange',
      'change',
      'changeText',
      'selectionChange',
      'endEditing',
      'blur',
    ]);

    expect(events).toMatchSnapshot('defaultValue: "Hello Default!"');
  });

  test('does respect editable prop', async () => {
    const { textInput } = await renderTextInputWithToolkit({
      value: 'Hello!',
      editable: false,
    });

    const user = userEvent.setup();
    await user.paste(textInput, 'Hi!');

    expect(textInput).toHaveDisplayValue('Hello!');
  });

  test('does respect pointer-events prop', async () => {
    const { textInput } = await renderTextInputWithToolkit({
      value: 'Hello!',
      pointerEvents: 'none',
    });

    const user = userEvent.setup();
    await user.paste(textInput, 'Hi!');

    expect(textInput).toHaveDisplayValue('Hello!');
  });

  test('supports multiline', async () => {
    const { textInput, events } = await renderTextInputWithToolkit({
      value: 'Hello World!\nHow are you?',
      multiline: true,
    });

    const user = userEvent.setup();
    await user.paste(textInput, 'Hi!');

    expect(getEventsNames(events)).toEqual([
      'focus',
      'selectionChange',
      'change',
      'changeText',
      'selectionChange',
      'contentSizeChange',
      'endEditing',
      'blur',
    ]);

    expect(events).toMatchSnapshot('value: "Hello World!\nHow are you?" multiline: true,');
  });

  test('works when not all events have handlers', async () => {
    const { events, logEvent } = createEventLogger();
    await render(
      <TextInput
        testID="input"
        onChangeText={logEvent('changeText')}
        onEndEditing={logEvent('endEditing')}
      />,
    );

    const user = userEvent.setup();
    await user.paste(screen.getByTestId('input'), 'Hi!');

    expect(getEventsNames(events)).toEqual(['changeText', 'endEditing']);

    expect(events).toMatchSnapshot();
  });

  test('does NOT work on View', async () => {
    await render(<View testID="input" />);

    const user = userEvent.setup();
    await expect(
      user.paste(screen.getByTestId('input'), 'Hi!'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"paste() only supports host "TextInput" instances. Passed instance has type: "View"."`,
    );
  });

  // View that ignores props type checking
  const AnyView = View as React.ComponentType<any>;

  test('bubbles up only native bubbling events, in the modern event system', async () => {
    const { events, logEvent } = createEventLogger();
    await render(
      <AnyView
        onChangeText={logEvent('changeText')}
        onChange={logEvent('change')}
        onKeyPress={logEvent('keyPress')}
        onTextInput={logEvent('textInput')}
        onFocus={logEvent('focus')}
        onBlur={logEvent('blur')}
        onEndEditing={logEvent('endEditing')}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
      >
        <TextInput testID="input" />
      </AnyView>,
    );

    const user = userEvent.setup();
    await user.paste(screen.getByTestId('input'), 'Hi!');
    // `focus`, `keyPress`, `change`, `endEditing` and `blur` are bubbling events in React Native.
    const modernEvents = ['focus', 'change', 'endEditing', 'blur'];
    expect(getEventsNames(events)).toEqual(
      getConfig().unstable_eventSystem === 'modern' ? modernEvents : [],
    );
  });

  test('sets native state value for unmanaged text inputs', async () => {
    await render(<TextInput testID="input" />);

    const user = userEvent.setup();
    const input = screen.getByTestId('input');
    expect(input).toHaveDisplayValue('');

    await user.paste(input, 'abc');
    expect(input).toHaveDisplayValue('abc');
  });
});
