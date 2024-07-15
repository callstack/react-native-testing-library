import * as React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from './test-utils';
import { Index } from './index.test';

test('renders WelcomeScreen in light theme', () => {
  renderWithProviders(<Index />, { theme: 'light' });
  expect(screen.getByText('Theme: light')).toBeOnTheScreen();
});

test('renders WelcomeScreen in dark theme', () => {
  renderWithProviders(<Index />, { theme: 'dark' });
  expect(screen.getByText('Theme: dark')).toBeOnTheScreen();
});

test('renders WelcomeScreen with user', () => {
  renderWithProviders(<Index />, { user: { name: 'Jar-Jar' } });
  expect(screen.getByText(/hello Jar-Jar/i)).toBeOnTheScreen();
});

test('renders WelcomeScreen without user', () => {
  renderWithProviders(<Index />, { user: null });
  expect(screen.getByText(/hello stranger/i)).toBeOnTheScreen();
});
