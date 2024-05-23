# React Navigation

When using [Async chunks](./usage#async-chunks), you can easily integrate React components which are
part of async chunks, by created a wrapper component
with `React.Suspense` and passing it as a `component` prop to a `Screen`, e.g:

```jsx
import * as React from 'react';
import { Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const StudentSide = React.lazy(
  () => import(/* webpackChunkName: "student" */ './StudentSide.js')
);

const TeacherSide = React.lazy(
  () => import(/* webpackChunkName: "teacher" */ './TeacherSide.js')
);

const StudentSideScreen = () => {
  const { params: { user } } = useRoute();
  return (
    <React.Suspense fallback={<Text>Loading...</Text>}>
      <StudentSide user={user} />
    </React.Suspense>
  );
};

const TeacherSideScreen = () => {
  const { params: { user } } = useRoute();
  return (
    <React.Suspense fallback={<Text>Loading...</Text>}>
      <TeacherSide user={user} />
    </React.Suspense>
  );
};

const Stack = createNativeStackNavigator();

export function Home() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="StudentScreen" component={StudentSizeScreen} />
      <Stack.Screen name="TeacherScreen" component={TeacherSideScreen} />
    </Stack.Navigator>
  )
}

```

React context is passed to the chunks as well, so you can use `useNavigation`, `useRoute` and other
hooks inside chunks (e.g: inside `StudentSide` or `TeacherSide` components) to access data or
interact with React Navigation.

:::caution

For [Scripts](./usage#scripts) approach, there's no easy way to integrate React Navigation.
It should be possible to hack your way around it, but in general, we don't recommend scripts
approach unless you know what you're doing.

:::

:::info

[Module Federation](./usage#module-federation) approach is not officially supported yet, but it
should be fairly straightforward to integrate React Navigation with it. For a reference how it could
be done, check out this code: https://github.com/zamotany/module-federation-repack/blob/main/host/Root.js#L51-L86

:::

