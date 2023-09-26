import React from 'react';
import { Pressable, Text } from 'react-native';
import render from '../../render';
import { userEvent } from '..';
import { screen } from '../../screen';

test('user event disables act environmennt', async () => {
  // In this There is state update during a wait when typing
  // Since wait is not wrapped by act there would be a warning
  // if act environment was not disabled
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
