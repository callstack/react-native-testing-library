import { render, screen, waitForElementToBeRemoved } from '@testing-library/react-native';
import React from 'react';
import PhoneBook from '../PhoneBook';
import {
  mockServerFailureForGetAllContacts,
  mockServerFailureForGetAllFavorites,
} from './test-utils';

jest.setTimeout(10000);

describe('PhoneBook', () => {
  it('fetches all contacts and favorites successfully and renders lists in sections correctly', async () => {
    await render(<PhoneBook />);

    expect(await screen.findByText('Name: Mrs Ida Kristensen')).toBeOnTheScreen();
    expect(await screen.findByText('Email: ida.kristensen@example.com')).toBeOnTheScreen();
    expect(await screen.findAllByText(/name/i)).toHaveLength(3);
    expect(await screen.findByText(/my favorites/i)).toBeOnTheScreen();
    expect(await screen.findAllByLabelText('favorite-contact-avatar')).toHaveLength(3);
  });

  it('fails to fetch all contacts and renders error message', async () => {
    mockServerFailureForGetAllContacts();
    await render(<PhoneBook />);

    expect(
      await screen.findByText(/an error occurred: error fetching contacts/i),
    ).toBeOnTheScreen();
  });

  it('fails to fetch favorites and renders error message', async () => {
    mockServerFailureForGetAllFavorites();
    await render(<PhoneBook />);

    expect(await screen.findByText(/error fetching favorites/i)).toBeOnTheScreen();
  });
});
