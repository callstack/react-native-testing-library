import * as React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { createEventLogger, getEventsNames, lastEventPayload } from '../../../test-utils';
import { render, screen } from '../../..';
import { userEvent } from '../..';
import '../../../matchers/extend-expect';

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
      onSelectionChange={logEvent('selectionChange')}
      onSubmitEditing={logEvent('submitEditing')}
      onEndEditing={logEvent('endEditing')}
      onContentSizeChange={logEvent('contentSizeChange')}
      {...props}
    />,
  );

  return {
    events,
  };
}

describe('type()', () => {
  it('supports basic case', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => 100100100100);
    const { events } = renderTextInputWithToolkit();

    const user = userEvent.setup();
    await user.type(screen.getByTestId('input'), 'abc');

    expect(getEventsNames(events)).toEqual([
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
    const { events } = renderTextInputWithToolkit();

    const user = userEvent.setup();
    await user.type(screen.getByTestId('input'), 'abc');

    expect(getEventsNames(events)).toEqual([
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
    const { events } = renderTextInputWithToolkit({
      defaultValue: 'xxx',
    });

    const user = userEvent.setup();
    await user.type(screen.getByTestId('input'), 'ab');

    expect(getEventsNames(events)).toEqual([
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
    const { events } = renderTextInputWithToolkit({
      editable: false,
    });

    const user = userEvent.setup();
    await user.type(screen.getByTestId('input'), 'ab');

    expect(getEventsNames(events)).toEqual([]);
  });

  it('supports backspace', async () => {
    const { events } = renderTextInputWithToolkit({
      defaultValue: 'xxx',
    });

    const user = userEvent.setup();
    await user.type(screen.getByTestId('input'), '{Backspace}a');

    expect(getEventsNames(events)).toEqual([
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
    const { events } = renderTextInputWithToolkit({
      multiline: true,
    });

    const user = userEvent.setup();
    await user.type(screen.getByTestId('input'), '{Enter}\n');

    expect(getEventsNames(events)).toEqual([
      'pressIn',
      'focus',
      'pressOut',
      'keyPress',
      'change',
      'changeText',
      'selectionChange',
      'contentSizeChange',
      'keyPress',
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
    const { events } = renderTextInputWithToolkit();

    const user = userEvent.setup();
    await user.type(screen.getByTestId('input'), 'a', {
      skipPress: true,
    });

    const eventNames = getEventsNames(events);
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

    expect(lastEventPayload(events, 'endEditing')).toMatchObject({
      nativeEvent: { text: 'a', target: 0 },
    });
  });

  it('triggers submit event with `submitEditing: true`', async () => {
    const { events } = renderTextInputWithToolkit();

    const user = userEvent.setup();
    await user.type(screen.getByTestId('input'), 'a', {
      submitEditing: true,
    });

    expect(getEventsNames(events)).toEqual([
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

    expect(lastEventPayload(events, 'submitEditing')).toMatchObject({
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
      />,
    );

    const user = userEvent.setup();
    await user.type(screen.getByTestId('input'), 'abc');

    expect(getEventsNames(events)).toEqual([
      'changeText',
      'changeText',
      'changeText',
      'endEditing',
    ]);

    expect(events).toMatchSnapshot('input: "abc"');
  });

  it('does NOT work on View', async () => {
    render(<View testID="input" />);

    const user = userEvent.setup();
    await expect(
      user.type(screen.getByTestId('input'), 'abc'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"type() works only with host "TextInput" elements. Passed element has type "View"."`,
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
      </AnyView>,
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
      />,
    );

    await userEvent.type(screen.getByTestId('input'), 'abc');

    expect(getEventsNames(events)).toEqual([
      'focus',
      'changeText',
      'changeText',
      'changeText',
      'blur',
    ]);
  });

  // See: https://github.com/callstack/react-native-testing-library/issues/1588
  it('can call "persist()" on "onKeyPress" event handler', async () => {
    const handleKeyPress = jest.fn();
    render(
      <TextInput
        testID="input"
        onKeyPress={(e) => {
          e.persist();
          handleKeyPress();
        }}
      />,
    );

    await userEvent.type(screen.getByTestId('input'), 'abc');
    expect(handleKeyPress).toHaveBeenCalledTimes(3);
  });

  it('respects the "maxLength" prop', async () => {
    const { events } = renderTextInputWithToolkit({ maxLength: 2 });

    const user = userEvent.setup();
    await user.type(screen.getByTestId('input'), 'abcd');

    expect(getEventsNames(events)).toEqual([
      'pressIn',
      'focus',
      'pressOut',
      'keyPress', // a
      'change',
      'changeText',
      'selectionChange',
      'keyPress', // b
      'change',
      'changeText',
      'selectionChange',
      'keyPress', // c
      'keyPress', // d
      'endEditing',
      'blur',
    ]);

    expect(lastEventPayload(events, 'changeText')).toBe('ab');
    expect(lastEventPayload(events, 'endEditing')).toMatchObject({
      nativeEvent: {
        target: 0,
        text: 'ab',
      },
    });
  });

  it('unmanaged text inputs preserve their native state', async () => {
    render(<TextInput testID="input" />);

    const user = userEvent.setup();
    const input = screen.getByTestId('input');
    expect(input).toHaveDisplayValue('');

    await user.type(input, 'Hello');
    expect(input).toHaveDisplayValue('Hello');

    await user.type(input, ' World');
    expect(input).toHaveDisplayValue('Hello World');
  });
});
