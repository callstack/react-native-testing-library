import React from 'react';
import type { TextInputProps } from 'react-native';
import { Text, TextInput } from 'react-native';

import { fireEvent, render, screen } from '..';

function WrappedTextInput(props: TextInputProps) {
  return <TextInput {...props} />;
}

function DoubleWrappedTextInput(props: TextInputProps) {
  return <WrappedTextInput {...props} />;
}

const layoutEvent = { nativeEvent: { layout: { width: 100, height: 100 } } };

test('should fire only non-touch-related events on non-editable TextInput', async () => {
  const onFocus = jest.fn();
  const onChangeText = jest.fn();
  const onSubmitEditing = jest.fn();
  const onLayout = jest.fn();

  await render(
    <TextInput
      editable={false}
      testID="subject"
      onFocus={onFocus}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      onLayout={onLayout}
    />,
  );

  const subject = screen.getByTestId('subject');
  await fireEvent(subject, 'focus');
  await fireEvent.changeText(subject, 'Text');
  await fireEvent(subject, 'submitEditing', { nativeEvent: { text: 'Text' } });
  await fireEvent(subject, 'layout', layoutEvent);

  expect(onFocus).not.toHaveBeenCalled();
  expect(onChangeText).not.toHaveBeenCalled();
  expect(onSubmitEditing).not.toHaveBeenCalled();
  expect(onLayout).toHaveBeenCalledWith(layoutEvent);
});

test('should fire only non-touch-related events on non-editable TextInput with nested Text', async () => {
  const onFocus = jest.fn();
  const onChangeText = jest.fn();
  const onSubmitEditing = jest.fn();
  const onLayout = jest.fn();

  await render(
    <TextInput
      editable={false}
      testID="subject"
      onFocus={onFocus}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      onLayout={onLayout}
    >
      <Text>Nested Text</Text>
    </TextInput>,
  );

  const subject = screen.getByText('Nested Text');
  await fireEvent(subject, 'focus');
  await fireEvent(subject, 'onFocus');
  await fireEvent.changeText(subject, 'Text');
  await fireEvent(subject, 'submitEditing', { nativeEvent: { text: 'Text' } });
  await fireEvent(subject, 'onSubmitEditing', { nativeEvent: { text: 'Text' } });
  await fireEvent(subject, 'layout', layoutEvent);
  await fireEvent(subject, 'onLayout', layoutEvent);

  expect(onFocus).not.toHaveBeenCalled();
  expect(onChangeText).not.toHaveBeenCalled();
  expect(onSubmitEditing).not.toHaveBeenCalled();
  expect(onLayout).toHaveBeenCalledTimes(2);
  expect(onLayout).toHaveBeenCalledWith(layoutEvent);
});

/**
 * Historically there were problems with custom TextInput wrappers, as they
 * could creat a hierarchy of three or more composite text input views with
 * very similar event props.
 *
 * Typical hierarchy would be:
 * - User composite TextInput
 * - UI library composite TextInput
 * - RN composite TextInput
 * - RN host TextInput
 *
 * Previous implementation of fireEvent only checked `editable` prop for
 * RN TextInputs, both host & composite but did not check on the UI library or
 * user composite TextInput level, hence invoking the event handlers that
 * should be blocked by `editable={false}` prop.
 */
test('should fire only non-touch-related events on non-editable wrapped TextInput', async () => {
  const onFocus = jest.fn();
  const onChangeText = jest.fn();
  const onSubmitEditing = jest.fn();
  const onLayout = jest.fn();

  await render(
    <WrappedTextInput
      editable={false}
      testID="subject"
      onFocus={onFocus}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      onLayout={onLayout}
    />,
  );

  const subject = screen.getByTestId('subject');
  await fireEvent(subject, 'focus');
  await fireEvent.changeText(subject, 'Text');
  await fireEvent(subject, 'submitEditing', { nativeEvent: { text: 'Text' } });
  await fireEvent(subject, 'layout', layoutEvent);

  expect(onFocus).not.toHaveBeenCalled();
  expect(onChangeText).not.toHaveBeenCalled();
  expect(onSubmitEditing).not.toHaveBeenCalled();
  expect(onLayout).toHaveBeenCalledWith(layoutEvent);
});

/**
 * Ditto testing for even deeper hierarchy of TextInput wrappers.
 */
test('should fire only non-touch-related events on non-editable double wrapped TextInput', async () => {
  const onFocus = jest.fn();
  const onChangeText = jest.fn();
  const onSubmitEditing = jest.fn();
  const onLayout = jest.fn();

  await render(
    <DoubleWrappedTextInput
      editable={false}
      testID="subject"
      onFocus={onFocus}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      onLayout={onLayout}
    />,
  );

  const subject = screen.getByTestId('subject');
  await fireEvent(subject, 'focus');
  await fireEvent.changeText(subject, 'Text');
  await fireEvent(subject, 'submitEditing', { nativeEvent: { text: 'Text' } });
  await fireEvent(subject, 'layout', layoutEvent);

  expect(onFocus).not.toHaveBeenCalled();
  expect(onChangeText).not.toHaveBeenCalled();
  expect(onSubmitEditing).not.toHaveBeenCalled();
  expect(onLayout).toHaveBeenCalledWith(layoutEvent);
});
