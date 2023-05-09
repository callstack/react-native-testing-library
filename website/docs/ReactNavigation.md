---
id: react-navigation
title: React Navigation
---

This section deals with integrating `@testing-library/react-native` with `react-navigation`, using Jest.

## Stack Navigator

### Setting up

Install the packages required for React Navigation. For this example, we will use a [stack navigator](https://reactnavigation.org/docs/stack-navigator/) to transition to the second page when any of the items are clicked on.

```
$ yarn add @react-native-community/masked-view @react-navigation/native @react-navigation/stack react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens
```

Create an [`./AppNavigator.js`](https://github.com/callstack/react-native-testing-library/blob/main/examples/reactnavigation/src/AppNavigator.js) component which will list the navigation stack:

```jsx
import 'react-native-gesture-handler';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';

const { Screen, Navigator } = createStackNavigator();

export default function Navigation() {
  const options = {};

  return (
    <Navigator>
      <Screen name="Home" component={HomeScreen} />
      <Screen options={options} name="Details" component={DetailsScreen} />
    </Navigator>
  );
}
```

Create your two screens which we will transition to and from them. The homescreen, found in [`./screens/HomeScreen.js`](https://github.com/callstack/react-native-testing-library/blob/main/examples/reactnavigation/src/screens/HomeScreen.js), contains a list of elements presented in a list view. On tap of any of these items will move to the details screen with the item number:

```jsx
import * as React from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const [items] = React.useState(
    new Array(20).fill(null).map((_, idx) => idx + 1)
  );

  const onOpacityPress = (item) => navigation.navigate('Details', item);

  return (
    <View>
      <Text style={styles.header}>List of numbers from 1 to 20</Text>
      <FlatList
        keyExtractor={(_, idx) => `${idx}`}
        data={items}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onOpacityPress(item)}
            style={styles.row}
          >
            <Text>Item number {item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const divider = '#DDDDDD';

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 16,
  },
  row: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomColor: divider,
    borderBottomWidth: 1,
  },
});
```

The details screen, found in [`./screens/DetailsScreen.js`](https://github.com/callstack/react-native-testing-library/blob/main/examples/reactnavigation/src/screens/DetailsScreen.js), contains a header with the item number passed from the home screen:

```jsx
// ./screens/DetailsScreen.js
import * as React from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default function DetailsScreen(props) {
  const item = Number.parseInt(props.route.params, 10);

  return (
    <View>
      <Text style={styles.header}>Showing details for {item}</Text>
      <Text style={styles.body}>the number you have chosen is {item}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 16,
  },
  body: {
    textAlign: 'center',
  },
});
```

### Setting up the test environment

Install required dev dependencies:

```
$ yarn add -D jest @testing-library/react-native
```

Create your `jest.config.js` file (or place the following properties in your `package.json` as a "jest" property)

```js
module.exports = {
  preset: 'react-native',
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation)',

    // For pnpm you need to use inlcude `(?!(?:.pnpm/)?` part like this:
    // 'node_modules/(?!(?:.pnpm/)?((jest-)?@?react-native|@react-native-community|@react-navigation))',
  ],
};
```

Notice the 2 entries that don't come with the default React Native project:

- `setupFiles` – an array of files that Jest is going to execute before running your tests. In this case, we run `react-native-gesture-handler/jestSetup.js` which sets up necessary mocks for `react-native-gesture-handler` native module
- `transformIgnorePatterns` – an array of paths that Jest ignores when transforming code. In this case, the negative lookahead regular expression is used, to tell Jest to transform (with Babel) every package inside `node_modules/` that starts with `react-native`, `@react-native-community` or `@react-navigation` (added by us, the rest is in `react-native` preset by default, so you don't have to worry about it).

### Example tests

For this example, we are going to test out two things. The first thing is that the page is laid out as expected. The second, and most important, is that the page will transition to the detail screen when any item is tapped on.

Let's add a [`AppNavigator.test.js`](https://github.com/callstack/react-native-testing-library/blob/main/examples/reactnavigation/src/__tests__/AppNavigator.js) file in `src/__tests__` directory:

```jsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen, fireEvent } from '@testing-library/react-native';

import AppNavigator from '../AppNavigator';

// Silence the warning https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
// Use with React Native <= 0.63
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

// Use this instead with React Native >= 0.64
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('Testing react navigation', () => {
  test('page contains the header and 10 items', async () => {
    const component = (
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );

    render(component);

    const header = await screen.findByText('List of numbers from 1 to 20');
    const items = await screen.findAllByText(/Item number/);

    expect(header).toBeOnTheScreen();
    expect(items.length).toBe(10);
  });

  test('clicking on one item takes you to the details screen', async () => {
    const component = (
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );

    render(component);
    const toClick = await screen.findByText('Item number 5');

    fireEvent(toClick, 'press');
    const newHeader = await screen.findByText('Showing details for 5');
    const newBody = await screen.findByText('the number you have chosen is 5');

    expect(newHeader).toBeOnTheScreen();
    expect(newBody).toBeOnTheScreen();
  });
});
```

## Drawer Navigator

Testing the Drawer Navigation requires an additional setup step for mocking the Reanimated library.

### Setting up

Install the packages required for React Navigation. For this example, we will use a [drawer navigator](https://reactnavigation.org/docs/drawer-navigator/) to transition between a home screen and an additional screen.

```
$ yarn add @react-native-community/masked-view @react-navigation/native @react-navigation/drawer react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens
```

Create a [`./DrawerAppNavigator.js`](https://github.com/callstack/react-native-testing-library/blob/main/examples/reactnavigation/src/DrawerAppNavigator.js) component which will list the navigation stack:

```jsx
import 'react-native-gesture-handler';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

const { Screen, Navigator } = createDrawerNavigator();

export default function Navigation() {
  return (
    <Navigator>
      <Screen name="Home" component={HomeScreen} />
      <Screen name="Notifications" component={NotificationsScreen} />
    </Navigator>
  );
}
```

Create your two screens which we will transition to and from:

```jsx
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome!</Text>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This is the notifications screen</Text>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}
```

### Setting up the test environment

Install required dev dependencies:

```
$ yarn add -D jest @testing-library/react-native
```

Create a [`mock file`](https://github.com/callstack/react-native-testing-library/blob/main/examples/reactnavigation/jest-setup.js) necessary for your tests:

```jsx
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
```

Create your `jest.config.js` file (or place the following properties in your `package.json` as a "jest" property)

```js
module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest-setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native-community|@react-navigation)',
  ],
};
```

Make sure that the path to the file in `setupFiles` is correct. Jest will run these files before running your tests, so it's the best place to put your global mocks.

This setup is copied from the [React Navigation documentation](https://reactnavigation.org/docs/testing/).

### Example tests

For this example, we are going to test out two things. The first thing is that the screen is loaded correctly. The second, and most important, is that the page will transition to the notifications screen when the button is tapped on.

Let's add a [`DrawerAppNavigator.test.js`](https://github.com/callstack/react-native-testing-library/blob/main/examples/reactnavigation/src/__tests__/DrawerAppNavigator.js) file in `src/__tests__` directory:

```jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen, fireEvent } from '@testing-library/react-native';

import DrawerAppNavigator from '../DrawerAppNavigator';

describe('Testing react navigation', () => {
  test('screen contains a button linking to the notifications page', async () => {
    const component = (
      <NavigationContainer>
        <DrawerAppNavigator />
      </NavigationContainer>
    );

    render(component);
    const button = await screen.findByText('Go to notifications');

    expect(button).toBeOnTheScreen();
  });

  test('clicking on the button takes you to the notifications screen', async () => {
    const component = (
      <NavigationContainer>
        <DrawerAppNavigator />
      </NavigationContainer>
    );

    render(component);
    const oldScreen = screen.queryByText('Welcome!');
    const button = await screen.findByText('Go to notifications');

    expect(oldScreen).toBeOnTheScreen();

    fireEvent(button, 'press');
    const newScreen = await screen.findByText('This is the notifications screen');

    expect(newScreen).toBeOnTheScreen();
  });
});
```

## Running tests

To run the tests, place a test script inside your `package.json`

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

And run the `test` script with `npm test` or `yarn test`.
