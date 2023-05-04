import React from 'react';
import { Text, TextInput, TextInputProps } from 'react-native';
import { render, fireEvent } from '..';

function WrappedTextInput(props: TextInputProps) {
  return <TextInput {...props} />;
}

function DoubleWrappedTextInput(props: TextInputProps) {
  return <WrappedTextInput {...props} />;
}

const layoutEvent = { nativeEvent: { layout: { width: 100, height: 100 } } };

test('should fire only non-touch-related events on non-editable TextInput', () => {
  const onFocus = jest.fn();
  const onChangeText = jest.fn();
  const onSubmitEditing = jest.fn();
  const onLayout = jest.fn();

  const view = render(
    <TextInput
      editable={false}
      testID="subject"
      onFocus={onFocus}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      onLayout={onLayout}
    />
  );

  const subject = view.getByTestId('subject');
  fireEvent(subject, 'focus');
  fireEvent.changeText(subject, 'Text');
  fireEvent(subject, 'submitEditing', { nativeEvent: { text: 'Text' } });
  fireEvent(subject, 'layout', layoutEvent);

  expect(onFocus).not.toHaveBeenCalled();
  expect(onChangeText).not.toHaveBeenCalled();
  expect(onSubmitEditing).not.toHaveBeenCalled();
  expect(onLayout).toHaveBeenCalledWith(layoutEvent);
});

test('should fire only non-touch-related events on non-editable TextInput with nested Text', () => {
  const onFocus = jest.fn();
  const onChangeText = jest.fn();
  const onSubmitEditing = jest.fn();
  const onLayout = jest.fn();

  const view = render(
    <TextInput
      editable={false}
      testID="subject"
      onFocus={onFocus}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      onLayout={onLayout}
    >
      <Text>Nested Text</Text>
    </TextInput>
  );

  const subject = view.getByText('Nested Text');
  fireEvent(subject, 'focus');
  fireEvent(subject, 'onFocus');
  fireEvent.changeText(subject, 'Text');
  fireEvent(subject, 'submitEditing', { nativeEvent: { text: 'Text' } });
  fireEvent(subject, 'onSubmitEditing', { nativeEvent: { text: 'Text' } });
  fireEvent(subject, 'layout', layoutEvent);
  fireEvent(subject, 'onLayout', layoutEvent);

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
test('should fire only non-touch-related events on non-editable wrapped TextInput', () => {
  const onFocus = jest.fn();
  const onChangeText = jest.fn();
  const onSubmitEditing = jest.fn();
  const onLayout = jest.fn();

  const view = render(
    <WrappedTextInput
      editable={false}
      testID="subject"
      onFocus={onFocus}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      onLayout={onLayout}
    />
  );

  const subject = view.getByTestId('subject');
  fireEvent(subject, 'focus');
  fireEvent.changeText(subject, 'Text');
  fireEvent(subject, 'submitEditing', { nativeEvent: { text: 'Text' } });
  fireEvent(subject, 'layout', layoutEvent);

  expect(onFocus).not.toHaveBeenCalled();
  expect(onChangeText).not.toHaveBeenCalled();
  expect(onSubmitEditing).not.toHaveBeenCalled();
  expect(onLayout).toHaveBeenCalledWith(layoutEvent);
});

/**
 * Ditto testing for even deeper hierarchy of TextInput wrappers.
 */
test('should fire only non-touch-related events on non-editable double wrapped TextInput', () => {
  const onFocus = jest.fn();
  const onChangeText = jest.fn();
  const onSubmitEditing = jest.fn();
  const onLayout = jest.fn();

  const view = render(
    <DoubleWrappedTextInput
      editable={false}
      testID="subject"
      onFocus={onFocus}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      onLayout={onLayout}
    />
  );

  const subject = view.getByTestId('subject');
  fireEvent(subject, 'focus');
  fireEvent.changeText(subject, 'Text');
  fireEvent(subject, 'submitEditing', { nativeEvent: { text: 'Text' } });
  fireEvent(subject, 'layout', layoutEvent);

  expect(onFocus).not.toHaveBeenCalled();
  expect(onChangeText).not.toHaveBeenCalled();
  expect(onSubmitEditing).not.toHaveBeenCalled();
  expect(onLayout).toHaveBeenCalledWith(layoutEvent);
});
