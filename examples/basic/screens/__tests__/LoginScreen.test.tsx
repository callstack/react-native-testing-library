import 'react-native';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { LoginScreen } from '../LoginScreen';

test('User can sign in successully with correct credentials', async () => {
  render(<LoginScreen />);

  expect(screen.getByText('Sign in to Admin Panel')).toBeTruthy();
  expect(screen.getByText('Username')).toBeTruthy();
  expect(screen.getByText('Password')).toBeTruthy();

  fireEvent.changeText(screen.getByLabelText('Username'), 'admin');
  fireEvent.changeText(screen.getByLabelText('Password'), 'admin1');
  fireEvent.press(screen.getByText('Sign In'));

  expect(await screen.findByText('Welcome admin!')).toBeTruthy();
  expect(screen.queryByText('Sign in to Admin Panel')).toBeFalsy();
  expect(screen.queryByText('Username')).toBeFalsy();
  expect(screen.queryByText('Password')).toBeFalsy();
});

test('User will see errors for incorrect credentials', async () => {
  render(<LoginScreen />);

  expect(screen.getByText('Sign in to Admin Panel')).toBeTruthy();
  expect(screen.getByText('Username')).toBeTruthy();
  expect(screen.getByText('Password')).toBeTruthy();

  fireEvent.changeText(screen.getByLabelText('Username'), 'admin');
  fireEvent.changeText(screen.getByLabelText('Password'), 'qwerty123');
  fireEvent.press(screen.getByText('Sign In'));

  expect(await screen.findByText('Incorrect username or password!')).toBeTruthy();
  expect(screen.getByText('Sign in to Admin Panel')).toBeTruthy();
  expect(screen.getByText('Username')).toBeTruthy();
  expect(screen.getByText('Password')).toBeTruthy();
});

test('User can sign in after incorrect attempt', async () => {
  render(<LoginScreen />);

  expect(screen.getByText('Sign in to Admin Panel')).toBeTruthy();
  expect(screen.getByText('Username')).toBeTruthy();
  expect(screen.getByText('Password')).toBeTruthy();

  fireEvent.changeText(screen.getByLabelText('Username'), 'admin');
  fireEvent.changeText(screen.getByLabelText('Password'), 'qwerty123');
  fireEvent.press(screen.getByText('Sign In'));

  expect(await screen.findByText('Incorrect username or password!')).toBeTruthy();

  fireEvent.changeText(screen.getByLabelText('Password'), 'admin1');
  fireEvent.press(screen.getByText('Sign In'));

  expect(await screen.findByText('Welcome admin!')).toBeTruthy();
  expect(screen.queryByText('Sign in to Admin Panel')).toBeFalsy();
  expect(screen.queryByText('Username')).toBeFalsy();
  expect(screen.queryByText('Password')).toBeFalsy();
});
