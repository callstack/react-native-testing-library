import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '..';

test('screen has the same queries as render result', async () => {
  const result = await render(<Text>Mt. Everest</Text>);
  expect(screen).toBe(result);

  expect(screen.getByText('Mt. Everest')).toBeTruthy();
  expect(screen.queryByText('Mt. Everest')).toBeTruthy();
  expect(screen.getAllByText('Mt. Everest')).toHaveLength(1);
  expect(screen.queryAllByText('Mt. Everest')).toHaveLength(1);
});

test('screen holds last render result', async () => {
  await render(<Text>Mt. Everest</Text>);
  await render(<Text>Mt. Blanc</Text>);
  const finalResult = await render(<Text>Śnieżka</Text>);
  expect(screen).toBe(finalResult);

  expect(screen.getByText('Śnieżka')).toBeTruthy();
  expect(screen.queryByText('Mt. Everest')).toBeFalsy();
  expect(screen.queryByText('Mt. Blanc')).toBeFalsy();
});

test('screen works with updating rerender', async () => {
  const result = await render(<Text>Mt. Everest</Text>);
  expect(screen).toBe(result);

  await screen.rerender(<Text>Śnieżka</Text>);
  expect(screen).toBe(result);
  expect(screen.getByText('Śnieżka')).toBeTruthy();
});

test('screen works with nested re-mounting rerender', async () => {
  const result = await render(
    <View>
      <Text>Mt. Everest</Text>
    </View>,
  );
  expect(screen).toBe(result);

  await screen.rerender(
    <View>
      <View>
        <Text>Śnieżka</Text>
      </View>
    </View>,
  );
  expect(screen).toBe(result);
  expect(screen.getByText('Śnieżka')).toBeTruthy();
});

test('screen throws without render', () => {
  expect(() => screen.container).toThrow('`render` method has not been called');
  expect(() => screen.root).toThrow('`render` method has not been called');
  expect(() => screen.debug()).toThrow('`render` method has not been called');
  expect(() => screen.getByText('Mt. Everest')).toThrow('`render` method has not been called');
});
