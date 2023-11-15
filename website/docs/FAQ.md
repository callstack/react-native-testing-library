---
id: faq
title: FAQ
---

#### Can I test the native features of React Native apps?

Short answer: no.

React Native Testing Library does not provide an entire React Native runtime since that would require running on a physical device
or iOS simulator/Android emulator to provision the underlying OS and platform APIs.

Instead of using React Native renderer, it simulates only the JavaScript part of its runtime
using [React Test Renderer](https://reactjs.org/docs/test-renderer.html) while providing queries
and event APIs (`userEvent`, `fireEvent`) that mimicking certain behaviors from the actual runtime.

You can learn more about our testing environment [here](./TestingEnvironment.md).

This approach has specific benefits and shortfalls. On the positive side:

- it allows testing most of the logic of regular React Native apps
- it allows running tests on any OS supported by Jest or other test runners, e.g., on CI
- it uses much less resources than full runtime simulation
- you can use Jest fake timers

On the negative side:

- you cannot test native features
- it might not perfectly simulate certain JavaScript features, but we are working on it

The [User Event interactions](user-event) solve some of the simulation issues, as they offer more realistic event handling than the basic [Fire Event API](api#fireevent-api).

### Should I use/migrate to `screen` queries?

There is no need to migrate existing test code to use `screen`-bases queries. You can still use
queries and other functions returned by `render`. The `screen` object captures the latest `render` result.

For new code, you are encouraged to use `screen` as there are some good reasons for that, which are described in [this article](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#not-using-screen) by Kent C. Dodds.

### Should I use/migrate to User Event interactions?

We encourage you to migrate existing tests to use the [User Event interactions](user-event), which offer more realistic event handling than the basic [Fire Event API](api#fireevent-api). Hence, it will provide more confidence in the quality of your code.
