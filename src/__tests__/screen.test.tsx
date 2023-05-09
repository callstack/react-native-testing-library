import * as React from 'react';
import { View, Text } from 'react-native';
import { render, screen } from '..';

test('screen has the same queries as render result', () => {
  const result = render(<Text>Mt. Everest</Text>);
  expect(screen).toBe(result);

  expect(screen.getByText('Mt. Everest')).toBeTruthy();
  expect(screen.queryByText('Mt. Everest')).toBeTruthy();
  expect(screen.getAllByText('Mt. Everest')).toHaveLength(1);
  expect(screen.queryAllByText('Mt. Everest')).toHaveLength(1);
});

test('screen holds last render result', () => {
  render(<Text>Mt. Everest</Text>);
  render(<Text>Mt. Blanc</Text>);
  const finalResult = render(<Text>Śnieżka</Text>);
  expect(screen).toBe(finalResult);

  expect(screen.getByText('Śnieżka')).toBeTruthy();
  expect(screen.queryByText('Mt. Everest')).toBeFalsy();
  expect(screen.queryByText('Mt. Blanc')).toBeFalsy();
});

test('screen works with updating rerender', () => {
  const result = render(<Text>Mt. Everest</Text>);
  expect(screen).toBe(result);

  screen.rerender(<Text>Śnieżka</Text>);
  expect(screen).toBe(result);
  expect(screen.getByText('Śnieżka')).toBeTruthy();
});

test('screen works with nested re-mounting rerender', () => {
  const result = render(
    <View>
      <Text>Mt. Everest</Text>
    </View>
  );
  expect(screen).toBe(result);

  screen.rerender(
    <View>
      <View>
        <Text>Śnieżka</Text>
      </View>
    </View>
  );
  expect(screen).toBe(result);
  expect(screen.getByText('Śnieżka')).toBeTruthy();
});

test('screen throws without render', () => {
  expect(() => screen.root).toThrow('`render` method has not been called');
  expect(() => screen.UNSAFE_root).toThrow(
    '`render` method has not been called'
  );
  expect(() => screen.debug()).toThrow('`render` method has not been called');
  expect(() => screen.debug.shallow()).toThrow(
    '`render` method has not been called'
  );
  expect(() => screen.getByText('Mt. Everest')).toThrow(
    '`render` method has not been called'
  );
});
