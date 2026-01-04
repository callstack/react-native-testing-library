import * as React from 'react';
import type { TextInputProps } from 'react-native';
import { TextInput, View } from 'react-native';

import { render, screen, userEvent } from '../..';
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
  it('paste on empty text input', async () => {
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

  it('paste on filled text input', async () => {
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

  it.each(['modern', 'legacy'])('works with %s fake timers', async (type) => {
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

  it('supports defaultValue prop', async () => {
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

  it('does respect editable prop', async () => {
    const { textInput } = await renderTextInputWithToolkit({
      value: 'Hello!',
      editable: false,
    });

    const user = userEvent.setup();
    await user.paste(textInput, 'Hi!');

    expect(textInput).toHaveDisplayValue('Hello!');
  });

  it('does respect pointer-events prop', async () => {
    const { textInput } = await renderTextInputWithToolkit({
      value: 'Hello!',
      pointerEvents: 'none',
    });

    const user = userEvent.setup();
    await user.paste(textInput, 'Hi!');

    expect(textInput).toHaveDisplayValue('Hello!');
  });

  it('supports multiline', async () => {
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

  it('works when not all events have handlers', async () => {
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

  it('does NOT work on View', async () => {
    await render(<View testID="input" />);

    const user = userEvent.setup();
    await expect(
      user.paste(screen.getByTestId('input'), 'Hi!'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"paste() only supports host "TextInput" elements. Passed element has type: "View"."`,
    );
  });

  // View that ignores props type checking
  const AnyView = View as React.ComponentType<any>;

  it('does NOT bubble up', async () => {
    const parentHandler = jest.fn();
    await render(
      <AnyView
        onChangeText={parentHandler}
        onChange={parentHandler}
        onKeyPress={parentHandler}
        onTextInput={parentHandler}
        onFocus={parentHandler}
        onBlur={parentHandler}
        onEndEditing={parentHandler}
        onPressIn={parentHandler}
        onPressOut={parentHandler}
      >
        <TextInput testID="input" />
      </AnyView>,
    );

    const user = userEvent.setup();
    await user.paste(screen.getByTestId('input'), 'Hi!');
    expect(parentHandler).not.toHaveBeenCalled();
  });

  it('sets native state value for unmanaged text inputs', async () => {
    await render(<TextInput testID="input" />);

    const user = userEvent.setup();
    const input = screen.getByTestId('input');
    expect(input).toHaveDisplayValue('');

    await user.paste(input, 'abc');
    expect(input).toHaveDisplayValue('abc');
  });
});
