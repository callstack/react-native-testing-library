import { render, screen, waitForElementToBeRemoved } from '@testing-library/react-native';
import React from 'react';
import axios from 'axios';
import PhoneBook from '../PhoneBook';
import { User } from '../types';

jest.mock('axios');

describe('PhoneBook', () => {
  it('fetches contacts successfully and renders in list', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(DATA),
    });
    (axios.get as jest.Mock).mockResolvedValue({ data: DATA });
    render(<PhoneBook />);

    await waitForElementToBeRemoved(() => screen.getByText(/users data not quite there yet/i));
    expect(await screen.findByText('Name: Mrs Ida Kristensen')).toBeOnTheScreen();
    expect(await screen.findByText('Email: ida.kristensen@example.com')).toBeOnTheScreen();
    expect(await screen.findAllByText(/name/i)).toHaveLength(3);
  });

  it('fails to fetch contacts and renders error message', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });
    (axios.get as jest.Mock).mockResolvedValue({ data: DATA });
    render(<PhoneBook />);

    await waitForElementToBeRemoved(() => screen.getByText(/users data not quite there yet/i));
    expect(await screen.findByText(/error fetching contacts/i)).toBeOnTheScreen();
  });

  it('fetches favorites successfully and renders all users avatars', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(DATA),
    });
    (axios.get as jest.Mock).mockResolvedValue({ data: DATA });
    render(<PhoneBook />);

    await waitForElementToBeRemoved(() => screen.getByText(/figuring out your favorites/i));
    expect(await screen.findByText(/my favorites/i)).toBeOnTheScreen();
    expect(await screen.findAllByLabelText('favorite-contact-avatar')).toHaveLength(3);
  });

  it('fails to fetch favorites and renders error message', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(DATA),
    });
    (axios.get as jest.Mock).mockRejectedValueOnce({ message: 'Error fetching favorites' });
    render(<PhoneBook />);

    await waitForElementToBeRemoved(() => screen.getByText(/figuring out your favorites/i));
    expect(await screen.findByText(/error fetching favorites/i)).toBeOnTheScreen();
  });
});

const DATA: { results: User[] } = {
  results: [
    {
      name: {
        title: 'Mrs',
        first: 'Ida',
        last: 'Kristensen',
      },
      email: 'ida.kristensen@example.com',
      id: {
        name: 'CPR',
        value: '250562-5730',
      },
      picture: {
        large: 'https://randomuser.me/api/portraits/women/26.jpg',
        medium: 'https://randomuser.me/api/portraits/med/women/26.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/women/26.jpg',
      },
      cell: '123-4567-890',
    },
    {
      name: {
        title: 'Mr',
        first: 'Elijah',
        last: 'Ellis',
      },
      email: 'elijah.ellis@example.com',
      id: {
        name: 'TFN',
        value: '138117486',
      },
      picture: {
        large: 'https://randomuser.me/api/portraits/men/53.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/53.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/53.jpg',
      },
      cell: '123-4567-890',
    },
    {
      name: {
        title: 'Mr',
        first: 'Miro',
        last: 'Halko',
      },
      email: 'miro.halko@example.com',
      id: {
        name: 'HETU',
        value: 'NaNNA945undefined',
      },
      picture: {
        large: 'https://randomuser.me/api/portraits/men/17.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/17.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/17.jpg',
      },
      cell: '123-4567-890',
    },
  ],
};
