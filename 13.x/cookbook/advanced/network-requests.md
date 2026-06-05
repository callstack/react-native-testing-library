# Network Requests

## Introduction

Mocking network requests is essential for testing React Native applications. By mocking
network requests, you can control the data returned from the server and test how your application
behaves in different scenarios, such as when the request succeeds or fails.

This guide shows how to mock network requests and guard your test suites against unwanted
and unmocked/unhandled network requests.

:::info
To simulate a real-world scenario, we will use the [Random User Generator API](https://randomuser.me/) that provides random user data.
:::

## Phonebook Example

Let's assume we have a simple phonebook application that
uses [`fetch`](https://reactnative.dev/docs/network#using-fetch) for fetching Data from a server.
In our case, we have a list of contacts and favorites that we want to display in our application.

This is how the root of the application looks like:

```tsx title=network-requests/Phonebook.tsx
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { User } from './types';
import ContactsList from './components/ContactsList';
import FavoritesList from './components/FavoritesList';
import getAllContacts from './api/getAllContacts';
import getAllFavorites from './api/getAllFavorites';

export default () => {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [favoritesData, setFavoritesData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const _getAllContacts = async () => {
      const _data = await getAllContacts();
      setUsersData(_data);
    };
    const _getAllFavorites = async () => {
      const _data = await getAllFavorites();
      setFavoritesData(_data);
    };

    const run = async () => {
      try {
        await Promise.all([_getAllContacts(), _getAllFavorites()]);
      } catch (e) {
        const message = isErrorWithMessage(e) ? e.message : 'Something went wrong';
        setError(message);
      }
    };

    void run();
  }, []);

  if (error) {
    return <Text>An error occurred: {error}</Text>;
  }

  return (
    <>
      <FavoritesList users={favoritesData} />
      <ContactsList users={usersData} />
    </>
  );
};
```

We fetch the contacts from the server using the `getAllFavorites` function that utilizes `fetch`.

```tsx title=network-requests/api/getAllContacts.ts
import { User } from '../types';

export default async (): Promise<User[]> => {
  const res = await fetch('https://randomuser.me/api/?results=25');
  if (!res.ok) {
    throw new Error(`Error fetching contacts`);
  }
  const json = await res.json();
  return json.results;
};
```

We have similar function for fetching the favorites, but this time limiting the results to 10.

```tsx title=network-requests/api/getAllFavorites.ts
import { User } from '../types';

export default async (): Promise<User[]> => {
  const res = await fetch('https://randomuser.me/api/?results=10');
  if (!res.ok) {
    throw new Error(`Error fetching favorites`);
  }
  const json = await res.json();
  return json.results;
};
```

Our `FavoritesList` component is a simple component that displays the list of favorite contacts and
their avatars horizontally.

```tsx title=network-requests/components/FavoritesList.tsx
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import type {ListRenderItem} from '@react-native/virtualized-lists';
import {User} from '../types';

export default ({users}: { users: User[] }) => {
  const renderItem: ListRenderItem<User> = useCallback(({item: {picture}}) => {
    return (
      <View style={styles.userContainer}>
        <Image
          source={{uri: picture.thumbnail}}
          style={styles.userImage}
          accessibilityLabel={'favorite-contact-avatar'}
        />
      </View>
    );
  }, []);

  if (users.length === 0) return (
    <View style={styles.loaderContainer}>
      <Text>Figuring out your favorites...</Text>
    </View>
  );

  return (
    <View style={styles.outerContainer}>
      <Text>⭐My Favorites</Text>
      <FlatList<User>
        horizontal
        showsHorizontalScrollIndicator={false}
        data={users}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}-${item.id.value}`}
      />
    </View>
  );
};

// Looking for styles?
// Check examples/cookbook/app/advanced/components/FavoritesList.tsx
const styles =
...
```

Our `ContactsList` component is similar to the `FavoritesList` component, but it displays the list
of
all contacts vertically.

```tsx title=network-requests/components/ContactsList.tsx
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import React, { useCallback } from 'react';
import type { ListRenderItem } from '@react-native/virtualized-lists';
import { User } from '../types';

export default ({ users }: { users: User[] }) => {
  const renderItem: ListRenderItem<User> = useCallback(
    ({ item: { name, email, picture, cell }, index }) => {
      const { title, first, last } = name;
      const backgroundColor = index % 2 === 0 ? '#f9f9f9' : '#fff';
      return (
        <View style={[{ backgroundColor }, styles.userContainer]}>
          <Image source={{ uri: picture.thumbnail }} style={styles.userImage} />
          <View>
            <Text>
              Name: {title} {first} {last}
            </Text>
            <Text>Email: {email}</Text>
            <Text>Mobile: {cell}</Text>
          </View>
        </View>
      );
    },
    [],
  );

  if (users.length === 0) return <FullScreenLoader />;

  return (
    <View>
      <FlatList<User>
        data={users}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}-${item.id.value}`}
      />
    </View>
  );
};

// Looking for styles or FullScreenLoader component?
// Check examples/cookbook/app/advanced/components/ContactsList.tsx
const FullScreenLoader = () => ...
const styles = ...
```

## Start testing with a simple test

In our initial test we would like to test if the `PhoneBook` component renders the `FavoritesList`
and `ContactsList` components correctly.
We will need to mock the network requests and their corresponding responses to ensure that the component behaves as
expected. To mock the network requests we will use [MSW (Mock Service Worker)](https://mswjs.io/docs/getting-started).

:::note
We recommend using the Mock Service Worker (MSW) library to declaratively mock API communication in your tests instead of stubbing `fetch`, or relying on third-party adapters.
:::

:::info
You can install MSW by running `npm install msw --save-dev` or `yarn add msw --dev`.
More info regarding installation can be found in [MSW's getting started guide](https://mswjs.io/docs/getting-started#step-1-install).

Please make sure you're also aware of [MSW's setup guide](https://mswjs.io/docs/integrations/react-native).
Please be minded that the MSW's setup guide is potentially incomplete and might contain discrepancies/missing pieces.
:::

```tsx title=network-requests/Phonebook.test.tsx
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react-native';
import React from 'react';
import PhoneBook from '../PhoneBook';
import { User } from '../types';
import {http, HttpResponse} from "msw";
import {setupServer} from "msw/node";

// Define request handlers and response resolvers for random user API.
// By default, we always return the happy path response.
const handlers = [
  http.get('https://randomuser.me/api/*', () => {
    return HttpResponse.json(DATA);
  }),
];

// Setup a request interception server with the given request handlers.
const server = setupServer(...handlers);

// Enable API mocking via Mock Service Worker (MSW)
beforeAll(() => server.listen());
// Reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers());
// Disable API mocking after the tests are done
afterAll(() => server.close());

describe('PhoneBook', () => {
  it('fetches all contacts and favorites successfully and renders lists in sections correctly', async () => {
    render(<PhoneBook />);

    await waitForElementToBeRemoved(() => screen.getByText(/users data not quite there yet/i));
    expect(await screen.findByText('Name: Mrs Ida Kristensen')).toBeOnTheScreen();
    expect(await screen.findByText('Email: ida.kristensen@example.com')).toBeOnTheScreen();
    expect(await screen.findAllByText(/name/i)).toHaveLength(3);
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
    // For brevity, we have omitted the rest of the users, you can still find them in
    // examples/cookbook/app/network-requests/__tests__/test-utils.ts
    ...
  ],
};
```

:::info
More info regarding how to describe the network using request handlers, intercepting a request and handling its response can be found in the [MSW's documentation](https://mswjs.io/docs/getting-started#step-2-describe).
:::

## Testing error handling

As we are dealing with network requests, and things can go wrong, we should also cover the case when
the API request fails. In this case, we would like to test how our application behaves when the API request fails.

:::info
The nature of the network can be highly dynamic, which makes it challenging to describe it completely in a fixed list of request handlers.
MSW provides us the means to override any particular network behavior using the designated `.use()` API.
More info can be found in [MSW's Network behavior overrides documentation](https://mswjs.io/docs/best-practices/network-behavior-overrides)
:::

```tsx title=network-requests/Phonebook.test.tsx
...

const mockServerFailureForGetAllContacts = () => {
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
      // Return the default response for all other requests that match URL and verb. (in our case get favorites)
      return HttpResponse.json(DATA);
    }),
  );
};

describe('PhoneBook', () => {
...
  it('fails to fetch all contacts and renders error message', async () => {
    mockServerFailureForGetAllContacts();
    render(<PhoneBook />);

    await waitForElementToBeRemoved(() => screen.getByText(/users data not quite there yet/i));
    expect(
      await screen.findByText(/an error occurred: error fetching contacts/i),
    ).toBeOnTheScreen();
  });
});

```

## Global guarding against unwanted API requests

As mistakes may happen, we might forget to mock a network request in one of our tests in the future.
To prevent us from happening, and alert when a certain network request is left unhandled, you may choose to
move MSW's server management from `PhoneBook.test.tsx` to Jest's setup file via [`setupFilesAfterEnv`](https://jestjs.io/docs/configuration#setupfilesafterenv-array).

```tsx title=examples/cookbook/jest-setup.ts
// Enable API mocking via Mock Service Worker (MSW)
beforeAll(() => server.listen());
// Reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers());
// Disable API mocking after the tests are done
afterAll(() => server.close());

// ... rest of your setup file
```

This setup will ensure you have the MSW server running before any test suite starts and stops it after all tests are done.
Which will result in a warning in the console if you forget to mock an API request in your test suite.

```bash
[MSW] Warning: intercepted a request without a matching request handler:
 • GET https://randomuser.me/api/?results=25?results=25
```

## Conclusion

Testing components that make network requests with MSW requires initial setup to configure and describe the overridden networks.
Use MSW's request handlers and intercepting APIs to achieve this.

Once configured, you have full control over network requests, their responses, and statuses.
This lets you test how your application behaves in different
scenarios, such as when requests succeed or fail.

With global configuration in place, MSW will also warn you when an unhandled network request occurs during a test suite.

## Further Reading and Alternatives

Explore more advanced scenarios for mocking network requests with MSW:

- MSW's Basics - [Intercepting requests](https://mswjs.io/docs/basics/intercepting-requests) and/or [Mocking responses](https://mswjs.io/docs/basics/mocking-responses)
- MSW's Network behavior - how to describe [REST](https://mswjs.io/docs/network-behavior/rest) and/or [GraphQL](https://mswjs.io/docs/network-behavior/graphql) APIs
