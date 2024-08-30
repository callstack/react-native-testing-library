import { User } from '../types';
import axios from 'axios';

class MismatchedUrlError extends Error {
  constructor(url: string) {
    super(`The URL: ${url} does not match the API's base URL.`);
  }
}

/**
 * Ensures that the URL matches the base URL of the API.
 * @param url
 * @throws {MismatchedUrlError}
 */
const ensureUrlMatchesBaseUrl = (url: string) => {
  if (!url.includes('https://randomuser.me/api')) throw new MismatchedUrlError(url);
};

export const mockFetchWithSuccessResponse = () => {
  (global.fetch as jest.Mock).mockImplementationOnce((url) => {
    ensureUrlMatchesBaseUrl(url);

    return Promise.resolve({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(DATA),
    });
  });
};

export const mockFetchWithFailureResponse = () => {
  (global.fetch as jest.Mock).mockImplementationOnce((url) => {
    ensureUrlMatchesBaseUrl(url);

    return Promise.resolve({
      ok: false,
    });
  });
};

export const mockAxiosGetWithSuccessResponse = () => {
  (axios.get as jest.Mock).mockImplementationOnce((url) => {
    ensureUrlMatchesBaseUrl(url);

    return Promise.resolve({ data: DATA });
  });
};

export const mockAxiosGetWithFailureResponse = () => {
  (axios.get as jest.Mock).mockImplementationOnce((url) => {
    ensureUrlMatchesBaseUrl(url);

    return Promise.reject({ message: 'Error fetching favorites' });
  });
};

export const DATA: { results: User[] } = {
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
