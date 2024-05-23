# Known issues

## Hot Module Replacement / React Refresh

### Root component used by `AppRegistry.registerComponent` will always require full reload.

With Webpack's Hot Module Replacement, the modules don't refresh themselves, but their parents refresh them, meaning for components `A` -> `B` (`A` renders `B`),
if you edit `B`, the component `A` will refresh `B`, but if you edit component `A` there's no one to refresh `A`.

The easiest workaround is to create additional component that will simply render your previous root component, eg:

```js
// --- index.js -------------------------------------------
import React from 'react';
import { App } from './App';

// Your new root component, make sure it's exported!
// Editing `Root` will result in full page reload`
export function Root() {
  return <App />;
}

AppRegistry.registerComponent('AppName', () => Root);

// --- App.js ---------------------------------------------
import React from 'react';
// -- snip --

// `Root` will refresh `App` so HMR wll work as expected.
export function App() {
  // -- snip --
}

```

### Stack traces are different after Hot Module Replacement update.

After applying Hot Module replacement update, if the error is throw or `console.log`/`console.error` is called,
the stack trace that React Native prints will be different — less precise — compared to running the same code after a full reload.

It's because HMR updates (which can consist of multiple files and runtime logic) created by Webpack
have to evaluated at once, so it's impossible for the JavaScript engine to identify from which file each pice of code from HMR update is.
Instead it will fallback to the name of the file that evaluated the update — `WebpackHMRClient.ts`.

This expected and there's little we can do about it. The stack trace is still correct, but it's less precise.

If you encounter such situation, and you need to get the precise stack trace, you can do a full reload
and reproduce the error or `console.log`/`console.error` call.

## Android

### OkHttp version (in-)compatibility with React Native

Android native module for `ChunkManager` provided by Re.Pack uses `okhttp3:okhttp` and `okhttp3:okhttp-urlconnection` dependencies in version `4.9.0`.
- If you're using **React Native `0.65`** or later, you **don't have to do anything**.
- If you're using **React Native `0.64` or below**, you should pay closer attention as these versions of React Native use older `okhttp3:okhttp` and `okhttp3:okhttp-urlconnection` versions. 

  Generally, React Native `0.64` should work fine with `4.9.0` of `okhttp3:okhttp` and `okhttp3:okhttp-urlconnection` dependencies.
  
  If you encounter any build problems or crashes in runtime related to `okhttp`, you might want to force a specific version of `okhttp` as a work around. See issue #40.
