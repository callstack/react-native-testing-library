# Fetch

## Introduction

React Native provides the Fetch API for your networking needs. It is promise-based and provides a
simple and clean API for making requests. In this guide, we will show you how to mock `fetch` requests
and guard your test suits from unwanted and unmocked API requests.

:::info
To simulate a real-world scenario, we will use the [Random User Generator API](https://randomuser.me/)
that provides random user data.
:::

## Phonebook Example

Let's assume we have a simple phonebook application that uses `fetch` for fetching Data from a server.
In our case, we have a list of contacts that we want to display in our application.

This is how the root of the application looks like:

```tsx title=network-requests/Phonebook.tsx
import React, {useEffect, useState} from 'react';
import {User} from './types';
import FavoritesList from './components/FavoritesList';

export default () => {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const _data = await getAllContacts();
        setUsersData(_data);
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
    <ContactsList users={usersData}/>
  );
};

```

We fetch the contacts from the server using the `getAllContacts` function that utilizes `fetch`.

```tsx title=network-requests/api/getAllContacts.ts
import {User} from '../types';

export default async (): Promise<User[]> => {
  const res = await fetch('https://randomuser.me/api/?results=25');
  if (!res.ok) {
    throw new Error(`Error fetching contacts`);
  }
  const json = await res.json();
  return json.results;
};
```

Our `ContactsList` component is a simple component that displays the list of favorite contacts and
their avatars.

```tsx title=network-requests/components/ContactsList.tsx
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import type {ListRenderItem} from '@react-native/virtualized-lists';
import {User} from '../types';

export default ({users}: { users: User[] }) => {
  const renderItem: ListRenderItem<User> = useCallback(
    ({item: {name, email, picture, cell}, index}) => {
      const {title, first, last} = name;
      const backgroundColor = index % 2 === 0 ? '#f9f9f9' : '#fff';
      return (
        <View style={[{backgroundColor}, styles.userContainer]}>
          <Image source={{uri: picture.thumbnail}} style={styles.userImage}/>
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

  if (users.length === 0) return (
    <View style={styles.loaderContainer}>
      <Text>Users data not quite there yet...</Text>
    </View>
  );

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

// Looking for styles?
// Check examples/cookbook/app/network-requests/components/ContactsList.tsx
const styles =
...
```

## Start testing with a simple test

In our test we will make sure we mock the `fetch` function to return the data we want.
In this specific case, we will return a list of 3 users.
As the `fetch` api is available globally, we can mock it by using `jest.spyOn` specifically on the
`global` object.

:::info
To prevent unexpected behavior, we ensure the following:
- Prevent the mock from resolving data multiple times by using `mockResolvedValueOnce`.
- Ensure the URL matches the base URL of the API by using a custom function `ensureUrlMatchesBaseUrl`.

:::


```tsx title=network-requests/Phonebook.test.tsx
import {render, waitForElementToBeRemoved} from '@testing-library/react-native';
import React from 'react';
import PhoneBook from '../PhoneBook';
import {User} from '../types';
import {MismatchedUrlError} from './test-utils';

const ensureUrlMatchesBaseUrl = (url: string) => {
  if (!url.includes('https://randomuser.me/api')) throw new MismatchedUrlError(url);
};

export const mockFetchWithSuccessResponse = () => {
  (global.fetch as jest.Mock).mockImplementationOnce((url) => {
    // Ensure the URL matches the base URL of the API
    ensureUrlMatchesBaseUrl(url);

    return Promise.resolve({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(DATA),
    });
  });
};

describe('PhoneBook', () => {
  it('fetches contacts successfully and renders in list', async () => {
    // mock the fetch function to return the data we want
    mockFetchWithSuccessResponse();
    render(<PhoneBook/>);

    // Wait for the loader to disappear
    await waitForElementToBeRemoved(() => screen.getByText(/users data not quite there yet/i));
    // Check if the users are displayed
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
      cell: '123-4567-890',
    },
    // For brevity, we have omitted the rest of the users, you can still find them in
    // examples/cookbook/app/network-requests/__tests__/PhoneBook.test.tsx
    ...
  ],
};

```

## Testing error handling

As we are dealing with network requests, we should also test how our application behaves when the
API request fails. We can mock the `fetch` function to throw an error and/or mark it's response as
not 'ok' in order to verify if our application is handling the error correctly.

:::note
The `fetch` function will reject the promise on some errors, but not if the server responds
with an error status like 404: so we also check the response status and throw if it is not OK.
See MDN's [docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) for more
:::

```tsx title=network-requests/Phonebook.test.tsx
...

export const mockFetchWithFailureResponse = () => {
  (global.fetch as jest.Mock).mockImplementationOnce((url) => {
    ensureUrlMatchesBaseUrl(url);

    return Promise.resolve({
      ok: false,
    });
  });
};

it('fails to fetch contacts and renders error message', async () => {
  // mock the fetch function to be not ok which will throw an error
  mockFetchWithFailureResponse();
  render(<PhoneBook/>);

  // Wait for the loader to disappear
  await waitForElementToBeRemoved(() => screen.getByText(/users data not quite there yet/i));
  // Check if the error message is displayed
  expect(await screen.findByText(/error fetching contacts/i)).toBeOnTheScreen();
});
````

## Global guarding against unwanted API requests

As mistakes may happen, we might forget to mock an API request in one of our tests in the future.
To prevent we make unwanted API requests, and alert the developer when it happens, we can globally
mock the `fetch` in our test suite via the `jest.setup.ts` file. Ensure this setup file is included
in [`setupFilesAfterEnv`](https://jestjs.io/docs/configuration#setupfilesafterenv-array) in your Jest configuration.

```tsx title=jest.setup.ts
beforeAll(() => {
  // the global fetch function:
  jest.spyOn(global, 'fetch').mockImplementation(() => {
    throw Error("Please ensure you mock 'fetch' Only Chuck Norris is allowed to make API requests when testing ;)");
  });
});
afterAll(() => {
  // restore the original fetch function
  (global.fetch as jest.Mock).mockRestore();
});

```

## Conclusion

Testing a component that makes network requests with `fetch` is straightforward. By mocking the fetch
requests, we can control the data that is returned and test how our application behaves in different
scenarios, such as when the request is successful or when it fails.
There are many ways to mock `fetch` requests, and the method you choose will always depend on your specific
use case. In this guide, we showed you how to mock `fetch` requests using Jest's `jest.spyOn` function
and how to guard against unwanted API requests throughout your test suite.

## Further Reading and Alternatives

Explore more powerful tools for mocking network requests in your React Native application:
- [Fetch Mock](https://www.wheresrhys.co.uk/fetch-mock/): A popular library for mocking fetch calls with an extensive API, making it easy to simulate various scenarios.
- [MSW (Mock Service Worker)](https://mswjs.io/): Great for spinning up a local test server that intercepts network requests at the network level, providing end-to-end testing capabilities.
