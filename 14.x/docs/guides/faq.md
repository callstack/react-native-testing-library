# FAQ

## Can I test the native features of React Native apps?

Short answer: no.

React Native Testing Library does not provide an entire React Native runtime since that would require running on a physical device
or iOS simulator/Android emulator to provision the underlying OS and platform APIs.

Instead of using React Native renderer, it simulates only the JavaScript part of its runtime
using [Test Renderer](https://github.com/mdjastrzebski/test-renderer) while providing queries
and event APIs ([User Event](/react-native-testing-library/14.x/docs/api/events/user-event.md), [Fire Event](/react-native-testing-library/14.x/docs/api/events/fire-event.md)) that mimicking certain behaviors from the actual runtime.

You can learn more about our testing environment [here](/react-native-testing-library/14.x/docs/advanced/testing-env.md).

This approach has benefits and limitations:

Benefits:

- Tests most of the logic of regular React Native apps
- Runs tests on any OS supported by Jest or other test runners, e.g., on CI
- Uses fewer resources than full runtime simulation
- Works with Jest fake timers

Limitations:

- Cannot test native features
- May not perfectly simulate certain JavaScript features, but we're working on it

The [User Event interactions](/react-native-testing-library/14.x/docs/api/events/user-event.md) solve some simulation issues by handling events more realistically than the basic [Fire Event API](/react-native-testing-library/14.x/docs/api/events/fire-event.md).

## Should I use/migrate to `screen` queries?

There is no need to migrate existing test code to use `screen`-bases queries. You can still use
queries and other functions returned by `render`. The `screen` object captures the latest `render` result.

For new code, use `screen`. [This article](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#not-using-screen) by Kent C. Dodds explains why.

## Should I use/migrate to User Event interactions?

Migrate existing tests to use the [User Event interactions](/react-native-testing-library/14.x/docs/api/events/user-event.md), which handle events more realistically than the basic [Fire Event API](/react-native-testing-library/14.x/docs/api/events/fire-event.md). This provides more confidence in your code quality.
