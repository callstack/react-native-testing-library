import * as React from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

import { render, screen } from '../../..';
import { invokeHandler } from '../invoke-handler';

test('calls the element handler with all params', async () => {
  const onContentSizeChange = jest.fn();
  await render(<ScrollView testID="scroll" onContentSizeChange={onContentSizeChange} />);

  const result = await invokeHandler(screen.getByTestId('scroll'), 'contentSizeChange', 100, 200);

  expect(result).toBe(true);
  expect(onContentSizeChange).toHaveBeenCalledWith(100, 200);
});

test('calls testOnly_ handlers', async () => {
  const onChangeText = jest.fn();
  const testOnlyProps = { testOnly_onChangeText: onChangeText };
  await render(<View testID="view" {...testOnlyProps} />);

  expect(await invokeHandler(screen.getByTestId('view'), 'changeText', 'Hello')).toBe(true);
  expect(onChangeText).toHaveBeenCalledWith('Hello');
});

test('does not call ancestor handlers', async () => {
  const onParentChangeText = jest.fn();
  const parentProps = { onChangeText: onParentChangeText };
  await render(
    <View {...parentProps}>
      <TextInput testID="input" />
    </View>,
  );

  expect(await invokeHandler(screen.getByTestId('input'), 'changeText', 'Hello')).toBe(false);
  expect(onParentChangeText).not.toHaveBeenCalled();
});

test('returns false when the element is unmounted', async () => {
  const onChangeText = jest.fn();
  await render(<TextInput testID="input" onChangeText={onChangeText} />);
  const input = screen.getByTestId('input');
  await screen.rerender(<View />);

  expect(await invokeHandler(input, 'changeText', 'Hello')).toBe(false);
  expect(onChangeText).not.toHaveBeenCalled();
});

test('renders state updates from the handler', async () => {
  function Subject() {
    const [text, setText] = React.useState('');
    return (
      <>
        <TextInput testID="input" onChangeText={setText} />
        <Text>Text: {text}</Text>
      </>
    );
  }
  await render(<Subject />);

  await invokeHandler(screen.getByTestId('input'), 'changeText', 'Hello');

  expect(screen.getByText('Text: Hello')).toBeOnTheScreen();
});
