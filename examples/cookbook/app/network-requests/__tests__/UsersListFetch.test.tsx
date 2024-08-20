import { render, screen, waitForElementToBeRemoved } from '@testing-library/react-native';
import React from 'react';
import UsersHome from '../UsersHome';
import { User } from '../types';

beforeAll(() => {
  jest.spyOn(global, 'fetch').mockImplementation(
    jest.fn(() => {
      throw Error('Only Chuck Norris is allowed to make API requests when testing ;)');
    }),
  );
});

afterAll(() => {
  (global.fetch as jest.Mock).mockRestore();
});

describe('UsersListFetch', () => {
  it('fetches users successfully and renders in list', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(DATA),
    } as unknown as Response);
    render(<UsersHome />);

    await waitForElementToBeRemoved(() => screen.getByText(/users data not quite there yet/i));
    expect(await screen.findByText('Name: Mrs Ida Kristensen')).toBeOnTheScreen();
    expect(await screen.findByText('Email: ida.kristensen@example.com')).toBeOnTheScreen();
    expect(await screen.findAllByText(/name/i)).toHaveLength(3);
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
    },
  ],
};
