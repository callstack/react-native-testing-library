# Guide: Async chunks

Let's assume, we are building an E-Learning application with specific functionalities for a student
and for a teacher. Both student and a teacher will get different UIs and different features, so it
would make sense to isolate the student's specific code from the teacher's. That's were Code
Splitting comes into play - we can use dynamic `import(...)` function together with `React.lazy` and
`React.Suspense` to conditionally render the student and the teacher sides based on the user's role.
The code for the student and the teacher will be put into a remote async chunk, so that the initial
download size will be smaller.

:::tip

It's recommended to read:

- [Concepts](./concepts)
- [Generic usage](./usage#generic-usage)
- [Async chunks usage](./usage#async-chunks)

first, to understand Code Splitting, usage on a high-level and get the necessary context.

:::

:::tip

Before you begin, make sure the Re.Pack's native module is linked into your application:

- https://reactnative.dev/docs/linking-libraries-ios
- https://github.com/react-native-community/cli/blob/master/docs/autolinking.md

:::

### Source code

Let's use the following code for the student's side:

```jsx
// StudentSide.js
import * as React from 'react';
import { View, Text } from 'react-native';

export default function StudentSide({ user }) {
  return (
    <View style={{ flex: 1 }}>
      <Text>Hello {user.name}!</Text>
      <Text>You are a student.</Text>
      {/* ...more student related code */}
    </View>
  );
}
```

And a code for the teacher's side:

```jsx
// TeacherSide.js
import * as React from 'react';
import { View, Text } from 'react-native';

export default function TeacherSide({ user }) {
  return (
    <View style={{ flex: 1 }}>
      <Text>Hello {user.name}!</Text>
      <Text>You are a teacher.</Text>
      {/* ...more teacher related code */}
    </View>
  );
}
```

Now in our parent component, which will be common for both the student and the teacher:

```jsx
// Home.js
import * as React from 'react';
import { Text } from 'react-native';

const StudentSide = React.lazy(
  () => import(/* webpackChunkName: "student" */ './StudentSide.js')
);

const TeacherSide = React.lazy(
  () => import(/* webpackChunkName: "teacher" */ './TeacherSide.js')
);

export function Home({ user }) {
  const Side = React.useMemo(
    () =>
      user.role === 'student' ? (
        <StudentSide user={user} />
      ) : (
        <TeacherSize user={user} />
      ),
    [user]
  );

  return (
    <React.Suspense fallback={<Text>Loading...</Text>}>
      <Side />
    </React.Suspense>
  );
}
```

At this point all the code used by `StudentSide.js` will be put into `student.chunk.bundle` and
`TeacherSide.js` into `teacher.chunk.bundle`.

If you try to render `Home` component in your application, it should work in development
(the development server must be running). For production however, there's an additional step
necessary - to configure [`ChunkManager`](../../api/react-native/classes/ChunkManager):

```js
// index.js
import { AppRegistry } from 'react-native';
import { ChunkManager } from '@callstack/repack/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from './src/App'; // Your application's root component
import { name as appName } from './app.json';

ChunkManager.configure({
  storage: AsyncStorage, // optional
  resolveRemoteChunk: async (chunkId) => {
    // Feel free to use any kind of remote config solution to obtain
    // a base URL for the chunks, if you don't know where they will
    // be hosted.

    return {
      url: `http://my-domain.dev/${chunkId}`,
    };
  },
});

AppRegistry.registerComponent(appName, () => App);
```

This code will allow Re.Pack's [`ChunkManager`](../../api/react-native/classes/ChunkManager) to
actually locate your chunks for the student and the teacher, and download them.

When bundling for production/release, all remote chunks, including `student.chunk.bundle` and
`teacher.chunk.bundle` will be copied to `<projectRoot>/build/<platform>/remote` by default.
You should upload files from this directory to a remote server or a CDN from where `ChunkManager`
will download them.

You can change remote chunks output directory using
[`remoteChunksOutput`](../../api/node/interfaces/OutputPluginConfig#remotechunksoutput)
in [`OutputPlugin`](../../api/node/classes/OutputPlugin) configuration.

## Local vs remote chunks

By default all async chunks are remote chunks, meaning they are hosted on a remote server (e.g: CDN)
and downloaded on demand.

Local chunks, however, are always stored on a filesystem and bundled together with main bundle into
the final `.ipa` or `.apk` file, meaning they increase initial download size the user has to
download when installing your application.

Local chunks should only be used if you know that the majority of users will need them or if you
want to have _pre-built_ features/modules.

:::info

Local chunks will not be copied into `<projectRoot>/build/<platform>/remote` (or directory specified
in [`remoteChunksOutput`](../../api/node/interfaces/OutputPluginConfig#remotechunksoutput)).
They will be automatically copied to appropriate locations by
[`OutputPlugin`](../../api/node/classes/OutputPlugin).

:::

To mark a chunk as a local chunk, you need to add it's name or a RegExp matching the chunk's name to
[`OutputPlugin`'s `localChunks` option](../../api/node/interfaces/OutputPluginConfig#localchunks) in
your Webpack config.

For example, if we know they majority of the users will be students, it would make sense to make
`student` chunk a local chunk. To mark the `student` chunk as a local one, apply this diff to your
Webpack configuration:

```diff
    /**
     * By default Webpack will emit files into `output.path` directory (eg: `<root>/build/ios`),
     * but in order to for the React Native application to include those files (or a subset of those)
     * they need to be copied over to correct output directories supplied from React Native CLI
     * when bundling the code (with `webpack-bundle` command).
     * In development mode (when development server is running), this plugin is a no-op.
     */
    new ReactNative.OutputPlugin({
      platform,
      devServerEnabled: devServer.enabled,
+     localChunks: ['student'],
    }),
```
