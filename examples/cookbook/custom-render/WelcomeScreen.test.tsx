import * as React from 'react';
import { renderWithProviders } from './test-utils';
import { WelcomeScreen } from './WelcomeScreen';

test('renders WelcomeScreen in light theme', () => {
  renderWithProviders(<WelcomeScreen />, { theme: 'light' });
});
