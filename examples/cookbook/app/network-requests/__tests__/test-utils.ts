import { User } from '../types';
import {http, HttpResponse} from "msw";
import {setupServer} from "msw/node";

const handlers = [
  http.get('https://randomuser.me/api/*', () => {
    return HttpResponse.json(DATA);
  }),
];

export const server = setupServer(...handlers);

export const mockServerFailureForGetAllContacts = () => {
  server.use(
    http.get('https://randomuser.me/api/', ({ request }) => {
      // Construct a URL instance out of the intercepted request.
      const url = new URL(request.url);
      // Read the "results" URL query parameter using the "URLSearchParams" API.
      const resultsLength = url.searchParams.get('results');
      // Simulate a server error for the get all contacts request.
      // We check if the "results" query parameter is set to "25"
      // to know it's the correct request to mock, in our case get all contacts.
      if (resultsLength === '25') {
        return new HttpResponse(null, { status: 500 });
      }

      return HttpResponse.json(DATA);
    }),
  );
};

export const mockServerFailureForGetAllFavorites = () => {
  server.use(
    http.get('https://randomuser.me/api/', ({ request }) => {
      // Construct a URL instance out of the intercepted request.
      const url = new URL(request.url);
      // Read the "results" URL query parameter using the "URLSearchParams" API.
      const resultsLength = url.searchParams.get('results');
      // Simulate a server error for the get all favorites request.
      // We check if the "results" query parameter is set to "10"
      // to know it's the correct request to mock, in our case get all favorites.
      if (resultsLength === '10') {
        return new HttpResponse(null, { status: 500 });
      }

      return HttpResponse.json(DATA);
    }),
  );
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
