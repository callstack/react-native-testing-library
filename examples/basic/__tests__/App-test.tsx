import 'react-native';
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

test('renders correctly', () => {
  render(<App />);

  expect(screen.getByText('Welcome to React Native')).toBeTruthy();
});
