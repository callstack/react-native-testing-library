import { render, screen } from '@testing-library/react-native';
import UsersListFetch from '../UsersListFetch';
import React from 'react';

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
      json: jest.fn().mockResolvedValueOnce([
        {
          email: 'gerri@nos.nl',
          name: {
            title: 'Prof.',
            first: 'Gerri',
            last: 'Eickhof',
          },
          id: {
            name: 'abcdef',
            value: 'abc-123',
          },
        },
      ]),
    } as unknown as Response);
    render(<UsersListFetch />);

    await screen.findByText('Email: gerri@nos.nl');
    await screen.findByText('Name: Prof. Gerri Eickhof');
  });
});
