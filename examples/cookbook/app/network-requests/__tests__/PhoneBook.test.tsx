import { render, screen, waitForElementToBeRemoved } from '@testing-library/react-native';
import React from 'react';
import PhoneBook from '../PhoneBook';
import { User } from '../types';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PhoneBook', () => {
  it('fetches contacts successfully and renders in list', async () => {
    (global.fetch as jest.SpyInstance).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(DATA),
    });
    (mockedAxios.get as jest.Mock).mockResolvedValue({ data: DATA });
    render(<PhoneBook />);

    await waitForElementToBeRemoved(() => screen.getByText(/users data not quite there yet/i));
    expect(await screen.findByText('Name: Mrs Ida Kristensen')).toBeOnTheScreen();
    expect(await screen.findByText('Email: ida.kristensen@example.com')).toBeOnTheScreen();
    expect(await screen.findAllByText(/name/i)).toHaveLength(3);
  });

  it('fetches favorites successfully and renders in list', async () => {
    (global.fetch as jest.SpyInstance).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(DATA),
    });
    (mockedAxios.get as jest.Mock).mockResolvedValue({ data: DATA });
    render(<PhoneBook />);

    await waitForElementToBeRemoved(() => screen.getByText(/figuring out your favorites/i));
    expect(await screen.findByText(/my favorites/i)).toBeOnTheScreen();
    expect(await screen.findAllByLabelText('favorite-contact-avatar')).toHaveLength(3);
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
