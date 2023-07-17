import React from 'react';
import { Pressable, Text } from 'react-native';
import { render, screen } from '../../../pure';
import { userEvent } from '../..';
import { createEventLogger } from '../../../test-utils';

describe('userEvent.longPress with fake timers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(0);
  });

  test('calls onLongPress if the delayLongPress is the default one', async () => {
    const { logEvent, events } = createEventLogger();
    const user = userEvent.setup();

    render(
      <Pressable
        onPress={logEvent('press')}
        onLongPress={logEvent('longPress')}
      >
        <Text>press me</Text>
      </Pressable>
    );
    await user.longPress(screen.getByText('press me'));

    expect(events).toMatchInlineSnapshot(`
      [
        {
          "name": "longPress",
          "payload": {
            "currentTarget": {
              "measure": [MockFunction] {
                "calls": [
                  [
                    [Function],
                  ],
                  [
                    [Function],
                  ],
                ],
                "results": [
                  {
                    "type": "return",
                    "value": undefined,
                  },
                  {
                    "type": "return",
                    "value": undefined,
                  },
                ],
              },
            },
            "dispatchConfig": {
              "registrationName": "onResponderGrant",
            },
            "nativeEvent": {
              "changedTouches": [],
              "identifier": 0,
              "locationX": 0,
              "locationY": 0,
              "pageX": 0,
              "pageY": 0,
              "target": 0,
              "timestamp": 0,
              "touches": [],
            },
            "persist": [MockFunction] {
              "calls": [
                [],
              ],
              "results": [
                {
                  "type": "return",
                  "value": undefined,
                },
              ],
            },
          },
        },
      ]
    `);
  });

  test('calls onLongPress when duration is greater than specified delayLongPress', async () => {
    const mockOnLongPress = jest.fn();
    const mockOnPress = jest.fn();
    const user = userEvent.setup();

    render(
      <Pressable
        delayLongPress={800}
        onLongPress={mockOnLongPress}
        onPress={mockOnPress}
      >
        <Text>press me</Text>
      </Pressable>
    );

    await user.longPress(screen.getByText('press me'), {
      duration: 1000,
    });

    expect(mockOnLongPress).toHaveBeenCalled();
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test('does not calls onLongPress when duration is lesser than specified delayLongPress', async () => {
    const mockOnLongPress = jest.fn();
    const mockOnPress = jest.fn();
    const user = userEvent.setup();

    render(
      <Pressable
        delayLongPress={1000}
        onLongPress={mockOnLongPress}
        onPress={mockOnPress}
      >
        <Text>press me</Text>
      </Pressable>
    );
    await user.longPress(screen.getByText('press me'));

    expect(mockOnLongPress).not.toHaveBeenCalled();
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test('does not calls onPress when onLongPress is called', async () => {
    const mockOnLongPress = jest.fn();
    const mockOnPress = jest.fn();
    const user = userEvent.setup();

    render(
      <Pressable onLongPress={mockOnLongPress} onPress={mockOnPress}>
        <Text>press me</Text>
      </Pressable>
    );
    await user.longPress(screen.getByText('press me'));

    expect(mockOnLongPress).toHaveBeenCalled();
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  test('longPress is accessible directly in userEvent', async () => {
    const mockOnLongPress = jest.fn();

    render(
      <Pressable onLongPress={mockOnLongPress}>
        <Text>press me</Text>
      </Pressable>
    );

    await userEvent.longPress(screen.getByText('press me'));

    expect(mockOnLongPress).toHaveBeenCalled();
  });
});
