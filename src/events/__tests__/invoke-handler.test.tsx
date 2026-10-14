import * as React from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { render, screen, UNSAFE_invokeHandler } from '../..';

test('calls a handler prop of the element with all arguments', async () => {
  const onContentSizeChange = jest.fn();
  await render(<ScrollView testID="scroll" onContentSizeChange={onContentSizeChange} />);

  await UNSAFE_invokeHandler(screen.getByTestId('scroll'), 'onContentSizeChange', 100, 200);

  expect(onContentSizeChange).toHaveBeenCalledTimes(1);
  expect(onContentSizeChange).toHaveBeenCalledWith(100, 200);
});

test('calls a handler without arguments', async () => {
  const onLoadEnd = jest.fn();
  const props = { onLoadEnd };
  await render(<View testID="view" {...props} />);

  await UNSAFE_invokeHandler(screen.getByTestId('view'), 'onLoadEnd');

  expect(onLoadEnd).toHaveBeenCalledWith();
});

test('resolves to the return value of the handler', async () => {
  await render(<View testID="view" onStartShouldSetResponder={() => true} />);

  await expect(
    UNSAFE_invokeHandler(screen.getByTestId('view'), 'onStartShouldSetResponder'),
  ).resolves.toBe(true);
});

test('awaits async handlers and resolves to their value', async () => {
  const onRefresh = jest.fn(async () => {
    await Promise.resolve();
    return 'refreshed';
  });
  const props = { onRefresh };
  await render(<View testID="view" {...props} />);

  await expect(UNSAFE_invokeHandler(screen.getByTestId('view'), 'onRefresh')).resolves.toBe(
    'refreshed',
  );
});

test('calls a handler of a composite component that renders the element', async () => {
  const onHoverIn = jest.fn();
  const onHoverOut = jest.fn();
  await render(
    <Pressable role="button" onHoverIn={onHoverIn} onHoverOut={onHoverOut}>
      <Text>Button</Text>
    </Pressable>,
  );

  const button = screen.getByRole('button');
  await UNSAFE_invokeHandler(button, 'onHoverIn', { nativeEvent: {} });
  await UNSAFE_invokeHandler(button, 'onHoverOut', { nativeEvent: {} });

  expect(onHoverIn).toHaveBeenCalledWith({ nativeEvent: {} });
  expect(onHoverOut).toHaveBeenCalledWith({ nativeEvent: {} });
});

test('calls any function prop, not only on* handlers', async () => {
  function Form(_props: { handleSubmitForm: (code: string) => void }) {
    return <View testID="form" />;
  }

  const handleSubmitForm = jest.fn();
  await render(<Form handleSubmitForm={handleSubmitForm} />);

  await UNSAFE_invokeHandler(screen.getByTestId('form'), 'handleSubmitForm', '123456');

  expect(handleSubmitForm).toHaveBeenCalledWith('123456');
});

test('calls FlatList onContentSizeChange through the list internals', async () => {
  const onContentSizeChange = jest.fn();
  await render(
    <FlatList
      testID="list"
      data={['a']}
      renderItem={({ item }) => <Text>{item}</Text>}
      onContentSizeChange={onContentSizeChange}
    />,
  );

  await UNSAFE_invokeHandler(screen.getByTestId('list'), 'onContentSizeChange', 300, 600);

  expect(onContentSizeChange).toHaveBeenCalledWith(300, 600);
});

test('prefers the handler of the element over its composite components', async () => {
  const onCustom = jest.fn();
  const onCompositeCustom = jest.fn();
  function Composite(_props: { onCustom: () => void }) {
    const hostProps = { onCustom };
    return <View testID="view" {...hostProps} />;
  }

  await render(<Composite onCustom={onCompositeCustom} />);

  await UNSAFE_invokeHandler(screen.getByTestId('view'), 'onCustom');

  expect(onCustom).toHaveBeenCalledTimes(1);
  expect(onCompositeCustom).not.toHaveBeenCalled();
});

test('prefers the nearest composite component', async () => {
  const onInnerCustom = jest.fn();
  const onOuterCustom = jest.fn();
  function Inner(_props: { onCustom: () => void }) {
    return <View testID="view" />;
  }
  function Outer(_props: { onCustom: () => void }) {
    return <Inner onCustom={onInnerCustom} />;
  }

  await render(<Outer onCustom={onOuterCustom} />);

  await UNSAFE_invokeHandler(screen.getByTestId('view'), 'onCustom');

  expect(onInnerCustom).toHaveBeenCalledTimes(1);
  expect(onOuterCustom).not.toHaveBeenCalled();
});

test('does not call handlers of ancestor host elements or their components', async () => {
  const onParentCustom = jest.fn();
  const onCompositeCustom = jest.fn();
  function Composite(props: { onCustom: () => void; children: React.ReactNode }) {
    const hostProps = { onCustom: onParentCustom };
    return <View {...hostProps}>{props.children}</View>;
  }

  await render(
    <Composite onCustom={onCompositeCustom}>
      <View testID="child" />
    </Composite>,
  );

  await expect(UNSAFE_invokeHandler(screen.getByTestId('child'), 'onCustom')).rejects.toThrow(
    'Unable to invoke "onCustom". No "onCustom" function prop found on the element (View) or the ' +
      'components that render it (View).',
  );
  expect(onParentCustom).not.toHaveBeenCalled();
  expect(onCompositeCustom).not.toHaveBeenCalled();
});

test('calls handlers of elements a device would not deliver events to', async () => {
  const onChangeText = jest.fn();
  await render(
    <View pointerEvents="none">
      <TextInput testID="input" editable={false} onChangeText={onChangeText} />
    </View>,
  );

  await UNSAFE_invokeHandler(screen.getByTestId('input'), 'onChangeText', 'Hello');

  expect(onChangeText).toHaveBeenCalledWith('Hello');
});

test('renders state updates from the handler', async () => {
  function Subject() {
    const [isHovered, setIsHovered] = React.useState(false);
    return (
      <Pressable role="button" onHoverIn={() => setIsHovered(true)}>
        <Text>{isHovered ? 'Hovered' : 'Idle'}</Text>
      </Pressable>
    );
  }

  await render(<Subject />);

  await UNSAFE_invokeHandler(screen.getByRole('button'), 'onHoverIn');

  expect(screen.getByText('Hovered')).toBeOnTheScreen();
});

test('rethrows errors from the handler', async () => {
  const props = {
    onCustom: () => {
      throw new Error('Handler failed');
    },
  };
  await render(<View testID="view" {...props} />);

  await expect(UNSAFE_invokeHandler(screen.getByTestId('view'), 'onCustom')).rejects.toThrow(
    'Handler failed',
  );
});

test('throws when no handler is found, listing the components it checked', async () => {
  function MyButton() {
    return (
      <Pressable role="button">
        <Text>Button</Text>
      </Pressable>
    );
  }

  await render(<MyButton />);

  await expect(UNSAFE_invokeHandler(screen.getByRole('button'), 'onHoverIn')).rejects.toThrow(
    'Unable to invoke "onHoverIn". No "onHoverIn" function prop found on the element (View) or ' +
      'the components that render it (View, Pressable, MyButton).',
  );
});

test('throws when the prop is not a function', async () => {
  const props = { onCustom: 'not a function' };
  await render(<View testID="view" {...props} />);

  await expect(UNSAFE_invokeHandler(screen.getByTestId('view'), 'onCustom')).rejects.toThrow(
    'Unable to invoke "onCustom". No "onCustom" function prop found',
  );
});

test('throws for an event type instead of a handler prop name', async () => {
  const onHoverIn = jest.fn();
  await render(<Pressable role="button" onHoverIn={onHoverIn} />);

  await expect(UNSAFE_invokeHandler(screen.getByRole('button'), 'hoverIn')).rejects.toThrow(
    'Unable to invoke "hoverIn". No "hoverIn" function prop found',
  );
  expect(onHoverIn).not.toHaveBeenCalled();
});

test('throws when the element is unmounted', async () => {
  const onCustom = jest.fn();
  const props = { onCustom };
  await render(<View testID="view" {...props} />);
  const view = screen.getByTestId('view');
  await screen.rerender(<Text>Other</Text>);

  await expect(UNSAFE_invokeHandler(view, 'onCustom')).rejects.toThrow(
    'Unable to invoke "onCustom". The element is unmounted.',
  );
  expect(onCustom).not.toHaveBeenCalled();
});

test('throws without an element', async () => {
  // @ts-expect-error Testing invalid input
  await expect(UNSAFE_invokeHandler(null, 'onCustom')).rejects.toThrow(
    'Unable to invoke "onCustom". Please provide a host element.',
  );
});

test('throws without a handler name', async () => {
  await render(<View testID="view" />);

  // @ts-expect-error Testing invalid input
  await expect(UNSAFE_invokeHandler(screen.getByTestId('view'))).rejects.toThrow(
    'Unable to invoke a handler. Please provide a handler prop name, e.g. "onHoverIn".',
  );
});
