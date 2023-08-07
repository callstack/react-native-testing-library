import * as React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { createEventLogger } from '../../test-utils/events';
import { render, userEvent } from '../..';

beforeEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

function renderTextInputWithToolkit(props: TextInputProps = {}) {
  const { events, logEvent } = createEventLogger();

  const screen = render(
    <TextInput
      testID="input"
      onFocus={logEvent('focus')}
      onBlur={logEvent('blur')}
      onPressIn={logEvent('pressIn')}
      onPressOut={logEvent('pressOut')}
      onChange={logEvent('change')}
      onChangeText={logEvent('changeText')}
      onKeyPress={logEvent('keyPress')}
      onTextInput={logEvent('textInput')}
      onSelectionChange={logEvent('selectionChange')}
      onSubmitEditing={logEvent('submitEditing')}
      onEndEditing={logEvent('endEditing')}
      onContentSizeChange={logEvent('contentSizeChange')}
      {...props}
    />
  );

  return {
    ...screen,
    events,
  };
}

describe('clear()', () => {
  it('supports basic case', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => 100100100100);
    const { events, ...queries } = renderTextInputWithToolkit({
      value: 'Hello!',
    });

    const user = userEvent.setup();
    await user.clear(queries.getByTestId('input'));

    const eventNames = events.map((e) => e.name);
    expect(eventNames).toEqual([
      'focus',
      'selectionChange',
      'keyPress',
      'change',
      'changeText',
      'selectionChange',
      'endEditing',
      'blur',
    ]);

    expect(events).toMatchSnapshot('value: "Hello!');
  });

  it.each(['modern', 'legacy'])('works with %s fake timers', async (type) => {
    jest.useFakeTimers({ legacyFakeTimers: type === 'legacy' });
    const { events, ...queries } = renderTextInputWithToolkit({
      value: 'Hello!',
    });

    const user = userEvent.setup();
    await user.clear(queries.getByTestId('input'));

    const eventNames = events.map((e) => e.name);
    expect(eventNames).toEqual([
      'focus',
      'selectionChange',
      'keyPress',
      'change',
      'changeText',
      'selectionChange',
      'endEditing',
      'blur',
    ]);
  });

  it('supports defaultValue prop', async () => {
    const { events, ...queries } = renderTextInputWithToolkit({
      defaultValue: 'Hello Default!',
    });

    const user = userEvent.setup();
    await user.clear(queries.getByTestId('input'));

    const eventNames = events.map((e) => e.name);
    expect(eventNames).toEqual([
      'focus',
      'selectionChange',
      'keyPress',
      'change',
      'changeText',
      'selectionChange',
      'endEditing',
      'blur',
    ]);

    expect(events).toMatchSnapshot('defaultValue: "Hello Default!"');
  });

  it('does respect editable prop', async () => {
    const { events, ...queries } = renderTextInputWithToolkit({
      value: 'Hello!',
      editable: false,
    });

    const user = userEvent.setup();
    await user.clear(queries.getByTestId('input'));

    const eventNames = events.map((e) => e.name);
    expect(eventNames).toEqual([]);
  });

  it('supports multiline', async () => {
    const { events, ...queries } = renderTextInputWithToolkit({
      value: 'Hello World!\nHow are you?',
      multiline: true,
    });

    const user = userEvent.setup();
    await user.clear(queries.getByTestId('input'));

    const eventNames = events.map((e) => e.name);
    expect(eventNames).toEqual([
      'focus',
      'selectionChange',
      'keyPress',
      'textInput',
      'change',
      'changeText',
      'selectionChange',
      'contentSizeChange',
      'endEditing',
      'blur',
    ]);

    expect(events).toMatchSnapshot(
      'value: "Hello World!\nHow are you?" multiline: true,'
    );
  });

  it('works when not all events have handlers', async () => {
    const { events, logEvent } = createEventLogger();
    const screen = render(
      <TextInput
        testID="input"
        onChangeText={logEvent('changeText')}
        onEndEditing={logEvent('endEditing')}
      />
    );

    const user = userEvent.setup();
    await user.clear(screen.getByTestId('input'));

    const eventNames = events.map((e) => e.name);
    expect(eventNames).toEqual(['changeText', 'endEditing']);

    expect(events).toMatchSnapshot();
  });

  it('does NOT work on View', async () => {
    const screen = render(<View testID="input" />);

    const user = userEvent.setup();
    await expect(
      user.clear(screen.getByTestId('input'))
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"clear() works only with host "TextInput" elements. Passed element has type "View"."`
    );
  });

  // View that ignores props type checking
  const AnyView = View as React.ComponentType<any>;

  it('does NOT bubble up', async () => {
    const parentHandler = jest.fn();
    const screen = render(
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
      </AnyView>
    );

    const user = userEvent.setup();
    await user.clear(screen.getByTestId('input'));
    expect(parentHandler).not.toHaveBeenCalled();
  });
});
