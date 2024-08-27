# Axios

## Introduction

Axios is a popular library for making HTTP requests in JavaScript. It is promise-based and has a
simple API that makes it easy to use.
In this guide, we will show you how to mock Axios requests and guard your test suits from unwanted
and unmocked API requests.

:::info
To simulate a real-world scenario, we will use
the [Random User Generator API](https://randomuser.me/) that provides random user data.
:::

## Phonebook Example

Let's assume we have a simple phonebook application that uses Axios for fetching Data from a server.
In our case, we have a list of favorite contacts that we want to display in our application.

This is how the root of the application looks like:

```tsx title=network-requests/axios/Phonebook.tsx
import React, {useEffect, useState} from 'react';
import {User} from './types';
import FavoritesList from './components/FavoritesList';

export default () => {
  const [favoritesData, setFavoritesData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const _data = await getAllFavorites();
        setFavoritesData(_data);
      } catch (e) {
        setError(e.message);
      }
    };

    void run();
  }, []);

  if (error) {
    return <Text>An error occurred: {error}</Text>;
  }

  return (
    <FavoritesList users={favoritesData}/>
  );
};

```

We fetch the contacts from the server using the `getAllFavorites` function that utilizes Axios.

```tsx title=network-requests/axios/api/getAllFavorites.ts
import axios from 'axios';
import {User} from '../types';

export default async (): Promise<User[]> => {
  const res = await axios.get('https://randomuser.me/api/?results=10');
  return res.data.results;
};

```

Our `FavoritesList` component is a simple component that displays the list of favorite contacts and
their avatars.

```tsx title=network-requests/axios/components/FavoritesList.tsx
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
// Check examples/cookbook/app/network-requests/components/FavoritesList.tsx
const styles =
...
```

## Start testing with a simple test
In our test we will make sure we mock the `axios.get` function to return the data we want.
In this specific case, we will return a list of 3 users.
By using `mockResolvedValueOnce` we gain more grip and prevent the mock from resolving the data
multiple times, which might lead to unexpected behavior.

```tsx title=network-requests/axios/Phonebook.test.tsx
import {render, waitForElementToBeRemoved} from '@testing-library/react-native';
import React from 'react';
import PhoneBook from '../PhoneBook';
import {User} from '../types';
import axios from 'axios';

jest.mock('axios');

describe('PhoneBook', () => {
  it('fetches favorites successfully and renders all users avatars', async () => {
    // Mock the axios.get function to return the data we want
    (axios.get as jest.Mock).mockResolvedValueOnce({data: DATA});
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
    // examples/cookbook/app/network-requests/__tests__/PhoneBook.test.tsx
    ...
  ],
};

```

## Testing error handling
As we are dealing with network requests, we should also test how our application behaves when the API
request fails. We can mock the `axios.get` function to throw an error and test if our application is
handling the error correctly.

:::note
It is good to note that Axios throws auto. an error when the response status code is not in the range of 2xx.
:::

```tsx title=network-requests/axios/Phonebook.test.tsx
...
it('fails to fetch favorites and renders error message', async () => {
  // Mock the axios.get function to throw an error
  (axios.get as jest.Mock).mockRejectedValueOnce({ message: 'Error fetching favorites' });
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
