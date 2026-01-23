import * as React from 'react';
import { screen } from '@testing-library/react-native';
import WelcomeScreen from '../WelcomeScreen';
import { renderWithProviders } from './test-utils';

test('renders WelcomeScreen in light theme', async () => {
  await renderWithProviders(<WelcomeScreen />, { theme: 'light' });
  expect(screen.getByText('Theme: light')).toBeOnTheScreen();
});

test('renders WelcomeScreen in dark theme', async () => {
  await renderWithProviders(<WelcomeScreen />, { theme: 'dark' });
  expect(screen.getByText('Theme: dark')).toBeOnTheScreen();
});

test('renders WelcomeScreen with user', async () => {
  await renderWithProviders(<WelcomeScreen />, { user: { name: 'Jar-Jar' } });
  expect(screen.getByText(/hello Jar-Jar/i)).toBeOnTheScreen();
});

test('renders WelcomeScreen without user', async () => {
  await renderWithProviders(<WelcomeScreen />, { user: null });
  expect(screen.getByText(/hello stranger/i)).toBeOnTheScreen();
});
