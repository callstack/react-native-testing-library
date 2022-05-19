---
id: faq
title: FAQ
---

<details>
  <summary>Can I test native features of React Native apps?</summary>

<br />
<p>Short answer: no.</p>

React Native Testing Library does not provide a full React Native runtime since that would require running on physical device
or iOS simulator/Android emulator to provide the underlying OS and platform APIs.

Instead of using React Native renderer, we simulate only the JavaScript part of it runtime by using [React Test Renderer](https://reactjs.org/docs/test-renderer.html) and providing queries and `fireEvent` APIs that mimick certain behaviors from real runtime.

This approach has certain benefits and shortfalse. On the plus side:

- it allows testing most of the logic of regular React Native apps
- it allows running test on any OS supported by Jest or other test runner, e.g. on CI
- it uses much less resources than full runtime emulation
- you can use Jest fake timers

The the negative side:

- you cannot test native features
- certain JavaScript features might not be perfectly simulated by we are working on it

</details>
