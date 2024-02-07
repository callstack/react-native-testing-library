import * as React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { createEventLogger } from '../../../test-utils';
import { render, screen } from '../../..';
import { userEvent } from '../..';

beforeEach(() => {
  jest.useRealTimers();
});

function renderTextInputWithToolkit(props: TextInputProps = {}) {
  const { events, logEvent } = createEventLogger();

  render(
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

describe('type()', () => {
  it('supports basic case', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => 100100100100);
    const { events, ...queries } = renderTextInputWithToolkit();

    const user = userEvent.setup();
    await user.type(queries.getByTestId('input'), 'abc');

    const eventNames = events.map((e) => e.name);
    expect(eventNames).toEqual([
      'pressIn',
      'focus',
      'pressOut',
      'keyPress',
      'change',
      'changeText',
      'selectionChange',
      'keyPress',
      'change',
      'changeText',
      'selectionChange',
      'keyPress',
      'change',
      'changeText',
      'selectionChange',
      'endEditing',
      'blur',
    ]);

    expect(events).toMatchSnapshot('input: "abc"');
  });

  it.each(['modern', 'legacy'])('works with %s fake timers', async (type) => {
    jest.useFakeTimers({ legacyFakeTimers: type === 'legacy' });
    const { events, ...queries } = renderTextInputWithToolkit();

    const user = userEvent.setup();
    await user.type(queries.getByTestId('input'), 'abc');

    const eventNames = events.map((e) => e.name);
    expect(eventNames).toEqual([
      'pressIn',
      'focus',
      'pressOut',
      'keyPress',
      'change',
      'changeText',
      'selectionChange',
      'keyPress',
      'change',
      'changeText',
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
      defaultValue: 'xxx',
    });

    const user = userEvent.setup();
    await user.type(queries.getByTestId('input'), 'ab');

    const eventNames = events.map((e) => e.name);
    expect(eventNames).toEqual([
      'pressIn',
      'focus',
      'pressOut',
      'keyPress',
      'change',
      'changeText',
      'selectionChange',
      'keyPress',
      'change',
      'changeText',
      'selectionChange',
      'endEditing',
      'blur',
    ]);

    expect(events).toMatchSnapshot('input: "ab", defaultValue: "xxx"');
  });

  it('does respect editable prop', async () => {
    const { events, ...queries } = renderTextInputWithToolkit({
      editable: false,
    });

    const user = userEvent.setup();
    await user.type(queries.getByTestId('input'), 'ab');

    const eventNames = events.map((e) => e.name);
    expect(eventNames).toEqual([]);
  });

  it('supports backspace', async () => {
    const { events, ...queries } = renderTextInputWithToolkit({
      defaultValue: 'xxx',
    });

    const user = userEvent.setup();
    await user.type(queries.getByTestId('input'), '{Backspace}a');

    const eventNames = events.map((e) => e.name);
    expect(eventNames).toEqual([
      'pressIn',
      'focus',
      'pressOut',
      'keyPress',
      'change',
      'changeText',
      'selectionChange',
      'keyPress',
      'change',
      'changeText',
      'selectionChange',
      'endEditing',
      'blur',
    ]);

    expect(events).toMatchSnapshot('input: "{Backspace}a", defaultValue: "xxx"');
  });

  it('supports multiline', async () => {
    const { events, ...queries } = renderTextInputWithToolkit({
      multiline: true,
    });

    const user = userEvent.setup();
    await user.type(queries.getByTestId('input'), '{Enter}\n');

    const eventNames = events.map((e) => e.name);
    expect(eventNames).toEqual([
      'pressIn',
      'focus',
      'pressOut',
      'keyPress',
      'textInput',
      'change',
      'changeText',
      'selectionChange',
      'contentSizeChange',
      'keyPress',
      'textInput',
      'change',
      'changeText',
      'selectionChange',
      'contentSizeChange',
      'endEditing',
      'blur',
    ]);

    expect(events).toMatchSnapshot('input: "{Enter}\\n", multiline: true');
  });

  test('skips press events when `skipPress: true`', async () => {
    const { events, ...queries } = renderTextInputWithToolkit();

    const user = userEvent.setup();
    await user.type(queries.getByTestId('input'), 'a', {
      skipPress: true,
    });

    const eventNames = events.map((e) => e.name);
    expect(eventNames).not.toContainEqual('pressIn');
    expect(eventNames).not.toContainEqual('pressOut');
    expect(eventNames).toEqual([
      'focus',
      'keyPress',
      'change',
      'changeText',
      'selectionChange',
      'endEditing',
      'blur',
    ]);
  });

  it('triggers submit event with `submitEditing: true`', async () => {
    const { events, ...queries } = renderTextInputWithToolkit();

    const user = userEvent.setup();
    await user.type(queries.getByTestId('input'), 'a', {
      submitEditing: true,
    });

    const eventNames = events.map((e) => e.name);
    expect(eventNames).toEqual([
      'pressIn',
      'focus',
      'pressOut',
      'keyPress',
      'change',
      'changeText',
      'selectionChange',
      'submitEditing',
      'endEditing',
      'blur',
    ]);

    expect(events[7].name).toBe('submitEditing');
    expect(events[7].payload).toEqual({
      nativeEvent: { text: 'a', target: 0 },
      currentTarget: {},
      target: {},
    });
  });

  it('works when not all events have handlers', async () => {
    const { events, logEvent } = createEventLogger();
    render(
      <TextInput
        testID="input"
        onChangeText={logEvent('changeText')}
        onEndEditing={logEvent('endEditing')}
      />
    );

    const user = userEvent.setup();
    await user.type(screen.getByTestId('input'), 'abc');

    const eventNames = events.map((e) => e.name);
    expect(eventNames).toEqual(['changeText', 'changeText', 'changeText', 'endEditing']);

    expect(events).toMatchSnapshot('input: "abc"');
  });

  it('does NOT work on View', async () => {
    render(<View testID="input" />);

    const user = userEvent.setup();
    await expect(
      user.type(screen.getByTestId('input'), 'abc')
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"type() works only with host "TextInput" elements. Passed element has type "View"."`
    );
  });

  // View that ignores props type checking
  const AnyView = View as React.ComponentType<any>;

  it('does NOT bubble up', async () => {
    const parentHandler = jest.fn();
    render(
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
    await user.type(screen.getByTestId('input'), 'abc');
    expect(parentHandler).not.toHaveBeenCalled();
  });

  it('supports direct access', async () => {
    const { events, logEvent } = createEventLogger();
    render(
      <TextInput
        testID="input"
        onChangeText={logEvent('changeText')}
        onFocus={logEvent('focus')}
        onBlur={logEvent('blur')}
      />
    );

    await userEvent.type(screen.getByTestId('input'), 'abc');

    const eventNames = events.map((event) => event.name);
    expect(eventNames).toEqual(['focus', 'changeText', 'changeText', 'changeText', 'blur']);
  });
});
