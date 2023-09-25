import React from 'react';
import { Pressable, Text } from 'react-native';
import render from '../../render';
import { userEvent } from '..';
import { screen } from '../../screen';

test('user event disables act environmennt', async () => {
  const consoleErrorSpy = jest.spyOn(console, 'error');
  jest.useFakeTimers();
  const TestComponent = () => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }, []);

    return (
      <>
        <Pressable testID="pressable" />
        {isVisible && <Text />}
      </>
    );
  };

  render(<TestComponent />);

  await userEvent.press(screen.getByTestId('pressable'));

  expect(consoleErrorSpy).not.toHaveBeenCalled();
});
