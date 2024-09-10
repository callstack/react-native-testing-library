# Network Requests

## Introduction

Mocking network requests is an essential part of testing React Native applications. By mocking
network
requests, you can control the data that is returned from the server and test how your application
behaves in different scenarios, such as when the request is successful or when it fails.

In this guide, we will show you how to mock network requests and guard your test suits from unwanted
and unmocked/unhandled network requests

:::info
To simulate a real-world scenario, we will use
the [Random User Generator API](https://randomuser.me/) that provides random user data.
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

We do the same for fetching the favorites, but this time limiting the results to 10.

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

In our test we would like to test if the `PhoneBook` component renders the `FavoritesList`
and `ContactsList` components correctly.
We will mock the network requests and their responses to ensure that the component behaves as
expected. We will use [MSW (Mock Service Worker)](https://mswjs.io/docs/getting-started) to mock the network requests.

```tsx title=network-requests/Phonebook.test.tsx

:::info
We recommend using the Mock Service Worker (MSW) library to declaratively mock API communication in
 your tests instead of stubbing `fetch, or relying on third-party adapters.

:::

```tsx title=network-requests/Phonebook.test.tsx
import {render, waitForElementToBeRemoved} from '@testing-library/react-native';
import React from 'react';
import PhoneBook from '../PhoneBook';
import {User} from '../types';
import axios from 'axios';
import {MismatchedUrlError} from './test-utils';

const ensureUrlMatchesBaseUrl = (url: string) => {
  if (!url.includes('https://randomuser.me/api')) throw new MismatchedUrlError(url);
};

export const mockAxiosGetWithSuccessResponse = () => {
  (axios.get as jest.Mock).mockImplementationOnce((url) => {
    // Ensure the URL matches the base URL of the API
    ensureUrlMatchesBaseUrl(url);

    return Promise.resolve({ data: DATA });
  });
};

describe('PhoneBook', () => {
  it('fetches favorites successfully and renders all users avatars', async () => {
    // Mock the axios.get function to return the data we want
    mockAxiosGetWithSuccessResponse();
    render(<PhoneBook/>);

    // Wait for the loader to disappear
    await waitForElementToBeRemoved(() => screen.getByText(/figuring out your favorites/i));
    expect(await screen.findByText(/my favorites/i)).toBeOnTheScreen();
    // All the avatars should be rendered
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
    // examples/cookbook/app/advanced/__tests__/PhoneBook.test.tsx
    ...
  ],
};

```

## Testing error handling

As we are dealing with network requests, we should also test how our application behaves when the
API
request fails. We can mock the `axios.get` function to throw an error and test if our application is
handling the error correctly.

:::note
It is good to note that Axios throws auto. an error when the response status code is not in the
range of 2xx.
:::

```tsx title=network-requests/Phonebook.test.tsx
...

export const mockAxiosGetWithFailureResponse = () => {
  (axios.get as jest.Mock).mockImplementationOnce((url) => {
    ensureUrlMatchesBaseUrl(url);

    return Promise.reject({ message: 'Error fetching favorites' });
  });
};

it('fails to fetch favorites and renders error message', async () => {
  // Mock the axios.get function to throw an error
  mockAxiosGetWithFailureResponse();
  render(<PhoneBook />);

  // Wait for the loader to disappear
  await waitForElementToBeRemoved(() => screen.getByText(/figuring out your favorites/i));
  // Error message should be displayed
  expect(await screen.findByText(/error fetching favorites/i)).toBeOnTheScreen();
});
````

## Global guarding against unwanted API requests

As mistakes may happen, we might forget to mock an API request in one of our tests in the future.
To prevent we make unwanted API requests, and alert the developer when it happens, we can globally
mock the `axios` module in our test suite.

```tsx title=__mocks__/axios.ts
const chuckNorrisError = () => {
  throw Error(
    "Please ensure you mock 'Axios' - Only Chuck Norris is allowed to make API requests when testing ;)",
  );
};

export default {
  // Mock all the methods to throw an error
  get: jest.fn(chuckNorrisError),
  post: jest.fn(chuckNorrisError),
  put: jest.fn(chuckNorrisError),
  delete: jest.fn(chuckNorrisError),
  request: jest.fn(chuckNorrisError),
};
```

## Conclusion

Testing a component that makes network requests with Axios is straightforward. By mocking the Axios
requests, we can control the data that is returned and test how our application behaves in different
scenarios, such as when the request is successful or when it fails.
There are many ways to mock Axios requests, and the method you choose will depend on your specific
use case. In this guide, we showed you how to mock Axios requests using Jest's `jest.mock` function
and how to guard against unwanted API requests throughout your test suite.

## Further Reading and Alternatives

Explore more powerful tools for mocking network requests in your React Native application:

- [Axios Mock Adapter](https://github.com/ctimmerm/axios-mock-adapter): A popular library for
  mocking Axios calls with an extensive API, making it easy to simulate various scenarios.
- [MSW (Mock Service Worker)](https://mswjs.io/): Great for spinning up a local test server that
  intercepts network requests at the network level, providing end-to-end testing capabilities.
